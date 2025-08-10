import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useDemoStore } from "@/context/DemoStore";

export default function AddCatalogDialog() {
  const { universities, periods, addUniversity, addPeriod, addDiscipline } = useDemoStore();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"university" | "period" | "discipline">("discipline");

  // Fields
  const [universityId, setUniversityId] = useState(universities[0]?.id ?? "");
  const [periodId, setPeriodId] = useState(periods[0]?.id ?? "");
  const [name, setName] = useState("");

  const onCreate = () => {
    if (!name) return;
    if (mode === "university") {
      addUniversity(name);
    } else if (mode === "period") {
      if (!universityId) return;
      addPeriod(universityId, name);
    } else {
      if (!universityId || !periodId) return;
      addDiscipline(universityId, periodId, name);
    }
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar ao Catálogo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cadastro</DialogTitle>
          <DialogDescription>Cadastre universidades, períodos ou disciplinas.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>O que deseja cadastrar?</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={mode === "university" ? "default" : "outline"} onClick={() => setMode("university")}>Universidade</Button>
              <Button variant={mode === "period" ? "default" : "outline"} onClick={() => setMode("period")}>Período</Button>
              <Button variant={mode === "discipline" ? "default" : "outline"} onClick={() => setMode("discipline")}>Disciplina</Button>
            </div>
          </div>

          {mode !== "university" && (
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
          )}

          {mode === "discipline" && (
            <div>
              <Label>Período</Label>
              <Select value={periodId} onValueChange={setPeriodId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {periods.filter((p) => p.universityId === universityId).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={mode === "university" ? "Ex: Uninassau ..." : mode === "period" ? "Ex: 4º período" : "Ex: Anatomia"} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onCreate}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
