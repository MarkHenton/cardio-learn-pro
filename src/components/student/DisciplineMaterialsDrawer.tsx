import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileText, Headphones, Image as ImageIcon, Presentation, Shield } from "lucide-react";
import { useDemoStore } from "@/context/DemoStore";

export default function DisciplineMaterialsDrawer({ disciplineId }: { disciplineId: string }) {
  const { materials, disciplines } = useDemoStore();
  const [open, setOpen] = useState(false);

  const discipline = disciplines.find((d) => d.id === disciplineId);
  const byCategory = useMemo(() => ({
    slides: materials.filter((m) => m.disciplineId === disciplineId && m.category === "slides"),
    resumoAudio: materials.filter((m) => m.disciplineId === disciplineId && m.category === "resumo-audio"),
    mapaMental: materials.filter((m) => m.disciplineId === disciplineId && m.category === "mapa-mental"),
    relatorios: materials.filter((m) => m.disciplineId === disciplineId && m.category === "relatorios"),
  }), [materials, disciplineId]);

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
          <DrawerDescription>Visualização segura (download desabilitado).</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <ScrollArea className="h-[60vh] pr-4">
            <Section title="Slides" icon={<Presentation className="h-4 w-4" />} empty={byCategory.slides.length === 0}>
              {byCategory.slides.map((m) => (
                <MaterialRow key={m.id} title={m.title} type={m.type} />
              ))}
            </Section>
            <Section title="Resumo em Áudio" icon={<Headphones className="h-4 w-4" />} empty={byCategory.resumoAudio.length === 0}>
              {byCategory.resumoAudio.map((m) => (
                <MaterialRow key={m.id} title={m.title} type={m.type} />
              ))}
            </Section>
            <Section title="Mapa Mental" icon={<ImageIcon className="h-4 w-4" />} empty={byCategory.mapaMental.length === 0}>
              {byCategory.mapaMental.map((m) => (
                <MaterialRow key={m.id} title={m.title} type={m.type} />
              ))}
            </Section>
            <Section title="Relatórios" icon={<FileText className="h-4 w-4" />} empty={byCategory.relatorios.length === 0}>
              {byCategory.relatorios.map((m) => (
                <MaterialRow key={m.id} title={m.title} type={m.type} chip={(m.subcategory as string | undefined)?.replace(/-/g, " ")} />
              ))}
            </Section>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-6">
              <Shield className="h-3 w-3" />
              <span>Modo demo: downloads ocultos no player; bloqueio completo requer backend (Supabase/MinIO).</span>
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

function MaterialRow({ title, type, chip }: { title: string; type: string; chip?: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
      <div className="text-sm font-medium truncate mr-2">{title}</div>
      <div className="flex items-center gap-2">
        {chip && <Badge variant="outline" className="text-xs capitalize">{chip}</Badge>}
        <Badge variant="secondary" className="text-xs">{type.toUpperCase()}</Badge>
      </div>
    </div>
  );
}
