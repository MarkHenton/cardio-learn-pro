import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileAudio2, FileImage, FileText, FileType2 } from "lucide-react";
import { useDemoStore } from "@/context/DemoStore";
import type { Category, RelatorioSubcategory, MaterialType } from "@/types/app";
import { toast } from "@/components/ui/use-toast";

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

function fileIcon(ext: string) {
  if (["mp3", "wav"].includes(ext)) return <FileAudio2 className="h-4 w-4" />;
  if (["png", "jpg", "jpeg"].includes(ext)) return <FileImage className="h-4 w-4" />;
  if (["pdf", "html"].includes(ext)) return <FileText className="h-4 w-4" />;
  return <FileType2 className="h-4 w-4" />;
}

export default function UploadMaterialForm() {
  const { universities, periods, disciplines, addMaterial } = useDemoStore();
  const [universityId, setUniversityId] = useState(universities[0]?.id ?? "");
  const [periodId, setPeriodId] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [subcategory, setSubcategory] = useState<RelatorioSubcategory | undefined>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const allowed = ".html,.wav,.json,.mp3,.pdf,.ppt,.pptx,.ppx,.png,.jpg,.jpeg";

  const filteredPeriods = periods.filter((p) => p.universityId === universityId);
  const filteredDisciplines = disciplines.filter((d) => d.universityId === universityId && d.periodId === periodId);
  
  useEffect(() => {
    if (filteredPeriods.length > 0) {
      setPeriodId(filteredPeriods[0].id);
    } else {
      setPeriodId("");
    }
  }, [universityId, periods]);

  useEffect(() => {
    if (filteredDisciplines.length > 0) {
      setDisciplineId(filteredDisciplines[0].id);
    } else {
      setDisciplineId("");
    }
  }, [periodId, disciplines]);


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category || !disciplineId || !periodId || !universityId) return;
    const ext = (file.name.split(".").pop() || "").toLowerCase() as MaterialType;
    const url = URL.createObjectURL(file); // demo only
    addMaterial({
      title: title || file.name,
      filename: file.name,
      type: ext,
      url,
      disciplineId,
      universityId,
      periodId,
      category: category as Category,
      subcategory,
    });
    setFile(null);
    setTitle("");
    setDescription("");
    toast({ title: "Upload salvo (demo)", description: "Os contadores foram atualizados." });
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Novo Upload</CardTitle>
        <CardDescription>Adicione materiais categorizados</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Universidade</Label>
              <Select value={universityId} onValueChange={setUniversityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Período</Label>
              <Select value={periodId} onValueChange={setPeriodId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPeriods.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Disciplina</Label>
              <Select value={disciplineId} onValueChange={setDisciplineId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDisciplines.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {category === "relatorios" && (
              <div>
                <Label>Subcategoria</Label>
                <Select value={subcategory} onValueChange={(v) => setSubcategory(v as RelatorioSubcategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {relatorioSubcategories.map((sc) => (
                      <SelectItem key={sc.value} value={sc.value}>{sc.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Microbiologia - Aula 1" />
          </div>
          <div>
            <Label>Descrição (opcional)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição" />
          </div>
          <div className="space-y-2">
            <Label>Arquivo</Label>
            <label className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-smooth cursor-pointer block">
              <input type="file" className="hidden" accept={allowed} onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <div className="flex flex-col items-center space-y-2">
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Clique para selecionar ou arraste aqui</div>
                {file && (
                  <div className="flex items-center space-x-2 text-sm mt-2">
                    {fileIcon((file.name.split(".").pop() || "").toLowerCase())}
                    <span>{file.name}</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">Formatos: HTML, WAV, JSON, MP3, PDF, PPT/PPTX/PPX, PNG, JPG</div>
              </div>
            </label>
          </div>

          <Button type="submit" variant="medical" className="w-full">
            Salvar (Demo)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
