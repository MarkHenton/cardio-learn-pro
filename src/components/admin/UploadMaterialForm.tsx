// src/components/admin/UploadMaterialForm.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileUp, CheckCircle } from "lucide-react";
import { useDemoStore } from "@/context/DemoStore"; // Usaremos para pegar os catálogos
import type { Category, RelatorioSubcategory, MaterialType } from "@/types/app";
import { toast } from "@/components/ui/use-toast";

// Importações do Firebase
import { storage, db } from "@/lib/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const categories: { value: Category; label: string }[] = [
  { value: "slides", label: "Slides" },
  { value: "resumo-audio", label: "Resumo em Áudio" },
  { value: "mapa-mental", label: "Mapa Mental" },
  { value: "relatorios", label: "Relatórios" },
];

const relatorioSubcategories: { value: RelatorioSubcategory; label: string }[] = [
  { value: "guia-de-estudo", label: "Guia de Estudo" },
  { value: "documento-de-resumo", label: "Documento de Resumo" },
  { value: "perguntas", label: "Perguntas" },
  { value: "linha-do-tempo", label: "Linha do Tempo" },
];

export default function UploadMaterialForm() {
  // Mantemos o useDemoStore para popular os seletores de universidade, período, etc.
  const { universities, periods, disciplines } = useDemoStore();

  // Estados do formulário
  const [universityId, setUniversityId] = useState(universities[0]?.id ?? "");
  const [periodId, setPeriodId] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [subcategory, setSubcategory] = useState<RelatorioSubcategory | undefined>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Estados para controlar o upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredPeriods = periods.filter((p) => p.universityId === universityId);
  const filteredDisciplines = disciplines.filter((d) => d.universityId === universityId && d.periodId === periodId);
  
  useEffect(() => {
    setPeriodId(filteredPeriods.length > 0 ? filteredPeriods[0].id : "");
  }, [universityId, periods]);

  useEffect(() => {
    setDisciplineId(filteredDisciplines.length > 0 ? filteredDisciplines[0].id : "");
  }, [periodId, disciplines]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setCategory("");
    setSubcategory(undefined);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category || !disciplineId) {
      toast({ title: "Erro", description: "Por favor, preencha todos os campos obrigatórios e selecione um arquivo.", variant: "destructive" });
      return;
    }
    setIsUploading(true);

    // 1. Define o caminho no Firebase Storage
    const storagePath = `materials/${disciplineId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);

    // 2. Inicia o upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // 3. Acompanha o progresso do upload
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        toast({ title: "Erro no Upload", description: "Não foi possível enviar o arquivo.", variant: "destructive" });
        setIsUploading(false);
      },
      async () => {
        // 4. Upload concluído com sucesso, pega a URL de download
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // 5. Salva os metadados do material no Firestore
        try {
          await addDoc(collection(db, "materials"), {
            title: title || file.name,
            fileName: file.name,
            fileType: file.type,
            storagePath: storagePath,
            downloadURL: downloadURL,
            disciplineId,
            universityId,
            periodId,
            category,
            subcategory: subcategory || null,
            description,
            createdAt: serverTimestamp(),
          });

          toast({ title: "Sucesso!", description: "Material enviado e salvo." });
          resetForm();
        } catch (error) {
          console.error("Firestore error:", error);
          toast({ title: "Erro ao Salvar", description: "O arquivo foi enviado, mas houve um erro ao salvar as informações.", variant: "destructive" });
          setIsUploading(false);
        }
      }
    );
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Novo Upload</CardTitle>
        <CardDescription>Adicione materiais para os estudantes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* ... Seletores de universidade, período e disciplina (código inalterado) ... */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Universidade</Label>
              <Select value={universityId} onValueChange={setUniversityId} disabled={isUploading}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{universities.map((u) => (<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Período</Label>
              <Select value={periodId} onValueChange={setPeriodId} disabled={isUploading}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{filteredPeriods.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Disciplina</Label>
              <Select value={disciplineId} onValueChange={setDisciplineId} disabled={isUploading}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{filteredDisciplines.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)} disabled={isUploading}>
                <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                <SelectContent>{categories.map((c) => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            {category === "relatorios" && (
              <div>
                <Label>Subcategoria</Label>
                <Select value={subcategory} onValueChange={(v) => setSubcategory(v as RelatorioSubcategory)} disabled={isUploading}>
                  <SelectTrigger><SelectValue placeholder="Selecione a subcategoria" /></SelectTrigger>
                  <SelectContent>{relatorioSubcategories.map((sc) => (<SelectItem key={sc.value} value={sc.value}>{sc.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div>
            <Label>Título (opcional)</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={file ? file.name : "Ex: Microbiologia - Aula 1"} disabled={isUploading} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file-upload">Arquivo</Label>
            <label className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-smooth cursor-pointer block">
              <input id="file-upload" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} disabled={isUploading} />
              <div className="flex flex-col items-center space-y-2">
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">{file ? file.name : "Clique para selecionar ou arraste aqui"}</div>
              </div>
            </label>
          </div>

          {isUploading && <Progress value={uploadProgress} className="w-full" />}

          <Button type="submit" variant="medical" className="w-full" disabled={isUploading || !file}>
            {isUploading ? `Enviando... ${Math.round(uploadProgress)}%` : <><FileUp className="mr-2 h-4 w-4" /> Enviar Material</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
