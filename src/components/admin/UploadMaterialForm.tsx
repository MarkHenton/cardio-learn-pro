import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Importações do Firebase (apenas para a base de dados)
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Tipos
import type { Discipline, Category, RelatorioSubcategory } from "@/types/app";

// Esquema de validação do formulário
const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  disciplineId: z.string().min(1, "Selecione uma disciplina."),
  category: z.string().min(1, "Selecione uma categoria."),
  subcategory: z.string().optional(),
  file: z.instanceof(File).refine(file => file.size > 0, "Selecione um ficheiro."),
});

// Props do componente
interface UploadMaterialFormProps {
  disciplines: Discipline[];
  onMaterialAdded: () => void;
}

export default function UploadMaterialForm({ disciplines, onMaterialAdded }: UploadMaterialFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", disciplineId: "", category: "", subcategory: "", file: new File([], "") },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // --- PASSO 1: ENVIAR O FICHEIRO PARA A VPS ---
      const formData = new FormData();
      formData.append('materialFile', values.file);

      console.log("A enviar o ficheiro para a VPS...");
      const uploadResponse = await fetch("medscribe.centerpersianas.com.br/upload", {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Falha ao enviar o ficheiro para o servidor.");
      }

      const uploadResult = await uploadResponse.json();
      const { fileName } = uploadResult; // Nome do ficheiro guardado na VPS

      console.log("Ficheiro enviado com sucesso. Nome do ficheiro:", fileName);

      // --- PASSO 2: GUARDAR OS DADOS NO FIRESTORE ---
      console.log("A guardar os metadados no Firestore...");
      
      await addDoc(collection(db, "materials"), {
        title: values.title,
        disciplineId: values.disciplineId,
        category: values.category,
        subcategory: values.subcategory || null,
        // Guardamos o nome do ficheiro em vez do URL do Storage
        fileName: fileName,
        fileType: values.file.type,
        createdAt: serverTimestamp(),
      });
      
      toast({ title: "Sucesso", description: "Material adicionado com sucesso!" });
      onMaterialAdded(); // Para atualizar a lista de materiais
      form.reset();

    } catch (error) {
      console.error("Erro no processo de adição de material:", error);
      toast({ title: "Erro", description: "Não foi possível adicionar o material.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ... (o resto do seu JSX do formulário continua aqui, sem alterações) ... */}
        {/* ... (FormField para title, disciplineId, category, etc.) ... */}
        
        {/* Campo de Upload de Ficheiro */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ficheiro do Material</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Material
        </Button>
      </form>
    </Form>
  );
}