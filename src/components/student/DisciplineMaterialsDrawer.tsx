// src/components/student/DisciplineMaterialsDrawer.tsx

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileText, Headphones, Image as ImageIcon, Presentation, Shield, Loader2, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Importações do Firebase
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Tipos de dados
import type { Material, Category, RelatorioSubcategory } from "@/types/app";

// Interface para o material vindo do Firestore (inclui o ID do documento)
interface MaterialFromDB extends Material {
  id: string;
  storagePath: string;
  downloadURL: string;
}

// Função para converter Base64 para Blob
function base64ToBlob(base64: string, contentType: string = 'application/pdf'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}


export default function DisciplineMaterialsDrawer({ disciplineId }: { disciplineId: string }) {
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<MaterialFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null); // Armazena o ID do material sendo gerado

  const discipline = { id: disciplineId, name: "Materiais da Disciplina" }; // Placeholder

  // Efeito para buscar os materiais do Firestore quando o drawer é aberto
  useEffect(() => {
    if (open) {
      const fetchMaterials = async () => {
        setIsLoading(true);
        try {
          const materialsRef = collection(db, "materials");
          const q = query(materialsRef, where("disciplineId", "==", disciplineId));
          const querySnapshot = await getDocs(q);
          const materialsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaterialFromDB));
          setMaterials(materialsData);
        } catch (error) {
          console.error("Erro ao buscar materiais:", error);
          toast({ title: "Erro", description: "Não foi possível carregar os materiais.", variant: "destructive" });
        }
        setIsLoading(false);
      };
      fetchMaterials();
    }
  }, [open, disciplineId]);
  
  // Função para chamar a Cloud Function que gera o PDF
  const handleViewPdf = async (material: MaterialFromDB) => {
    setIsGeneratingPdf(material.id);
    try {
      const response = await fetch("medscribe.centerpersianas.com.br/generatePdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Em vez de 'storagePath', enviamos 'fileName' com o nosso ficheiro de teste.
        body: JSON.stringify({ 
          fileName: "exemplo.html" 
        }),
      });
  
      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
  
      const pdfBlob = await response.blob();
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
  
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({ title: "Erro", description: "Não foi possível gerar o PDF.", variant: "destructive" });
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  const byCategory = useMemo(() => ({
    slides: materials.filter((m) => m.category === "slides"),
    resumoAudio: materials.filter((m) => m.category === "resumo-audio"),
    mapaMental: materials.filter((m) => m.category === "mapa-mental"),
    relatorios: materials.filter((m) => m.category === "relatorios"),
  }), [materials]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="medical" size="sm">Materiais</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> {discipline?.name}
          </DrawerTitle>
          <DrawerDescription>Todos os materiais disponíveis para esta disciplina.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <ScrollArea className="h-[60vh] pr-4">
            {isLoading ? <p>Carregando materiais...</p> : (
              <>
                <Section title="Slides" icon={<Presentation className="h-4 w-4" />} empty={byCategory.slides.length === 0}>
                  {byCategory.slides.map((m) => (
                    <MaterialRow key={m.id} material={m} isGeneratingPdf={isGeneratingPdf === m.id} onViewPdf={handleViewPdf} />
                  ))}
                </Section>
                <Section title="Resumo em Áudio" icon={<Headphones className="h-4 w-4" />} empty={byCategory.resumoAudio.length === 0}>
                  {byCategory.resumoAudio.map((m) => (
                    <MaterialRow key={m.id} material={m} isGeneratingPdf={isGeneratingPdf === m.id} onViewPdf={handleViewPdf} />
                  ))}
                </Section>
                <Section title="Mapa Mental" icon={<ImageIcon className="h-4 w-4" />} empty={byCategory.mapaMental.length === 0}>
                  {byCategory.mapaMental.map((m) => (
                    <MaterialRow key={m.id} material={m} isGeneratingPdf={isGeneratingPdf === m.id} onViewPdf={handleViewPdf} />
                  ))}
                </Section>
                <Section title="Relatórios" icon={<FileText className="h-4 w-4" />} empty={byCategory.relatorios.length === 0}>
                  {byCategory.relatorios.map((m) => (
                    <MaterialRow key={m.id} material={m} isGeneratingPdf={isGeneratingPdf === m.id} onViewPdf={handleViewPdf} chip={(m.subcategory as string | undefined)?.replace(/-/g, " ")} />
                  ))}
                </Section>
              </>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-6">
              <Shield className="h-3 w-3" />
              <span>A visualização de materiais de texto gera um PDF seguro com a sua identificação.</span>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Section({ title, icon, empty, children }: { title: string; icon: React.ReactNode; empty?: boolean; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
        {empty && <Badge variant="secondary">0</Badge>}
      </div>
      {empty ? (
        <p className="text-xs text-muted-foreground">Nenhum material ainda.</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}

function MaterialRow({ material, isGeneratingPdf, onViewPdf, chip }: { material: MaterialFromDB; isGeneratingPdf: boolean; onViewPdf: (material: MaterialFromDB) => void; chip?: string }) {
  const isPdfGeneratable = material.fileType?.includes('html') || material.fileType?.includes('json') || material.fileType?.includes('text');

  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
      <div className="text-sm font-medium truncate mr-2">{material.title}</div>
      <div className="flex items-center gap-2">
        {chip && <Badge variant="outline" className="text-xs capitalize">{chip}</Badge>}
        {isPdfGeneratable ? (
          <Button size="sm" onClick={() => onViewPdf(material)} disabled={isGeneratingPdf}>
            {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
            Visualizar
          </Button>
        ) : (
          <Button size="sm" asChild>
            <a href={material.downloadURL} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Abrir
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
