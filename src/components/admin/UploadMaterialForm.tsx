// --- Importações permanecem as mesmas ---
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Discipline } from "@/types/app";

// --- O schema de validação permanece o mesmo ---
const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  disciplineId: z.string().min(1, "Selecione uma disciplina."),
  category: z.string().min(1, "Selecione uma categoria."),
  subcategory: z.string().optional(),
  file: z.instanceof(File).refine(file => file.size > 0, "Selecione um ficheiro."),
});

interface UploadMaterialFormProps {
  disciplines: Discipline[];
  onMaterialAdded: () => void;
}

export default function UploadMaterialForm({ disciplines, onMaterialAdded }: UploadMaterialFormProps) {
  const { toast } = useToast();
  // MELHORIA 2: Removemos o useState 'isSubmitting'. Vamos usar o do react-hook-form.
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", disciplineId: "", category: "", subcategory: "", file: new File([], "") },
  });

  // Extraímos o formState para facilitar o acesso
  const { formState } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // MELHORIA 2: Não precisamos mais do setIsSubmitting(true) aqui.
    
    try {
      const formData = new FormData();
      formData.append('materialFile', values.file);

      // CORREÇÃO 1: Adicionamos o protocolo "http://" e a porta ":8080" à URL.
      // DICA: O ideal é colocar essa URL em uma variável de ambiente (.env).
      const uploadResponse = await fetch("http://medscribe.centerpersianas.com.br:8080/upload", {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        // Lembrete: Se der erro aqui, pode ser um problema de CORS no seu backend!
        // Verifique se o seu servidor Express está usando o middleware 'cors'.
        throw new Error("Falha ao enviar o ficheiro para o servidor. Verifique o console do navegador e do backend.");
      }

      const uploadResult = await uploadResponse.json();
      const { fileName } = uploadResult;

      await addDoc(collection(db, "materials"), {
        title: values.title,
        disciplineId: values.disciplineId,
        category: values.category,
        subcategory: values.subcategory || null,
        fileName: fileName,
        fileType: values.file.type,
        createdAt: serverTimestamp(),
      });
      
      toast({ title: "Sucesso", description: "Material adicionado com sucesso!" });
      onMaterialAdded();
      form.reset();

    } catch (error) {
      console.error("Erro no processo de adição de material:", error);
      toast({ title: "Erro", description: (error as Error).message || "Não foi possível adicionar o material.", variant: "destructive" });
    }
    // MELHORIA 2: Não precisamos mais do setIsSubmitting(false) aqui.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ... (O resto do seu JSX do formulário, como os campos de título, disciplina, etc.) ... */}

        {/* Campo de Upload de Ficheiro (sem alterações aqui, já estava bom) */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ficheiro do Material</FormLabel>
              <FormControl>
                <Input 
                  type="file"
                  // O 'ref' é opcional, mas ajuda o react-hook-form a focar no campo em caso de erro.
                  ref={field.ref}
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* MELHORIA 2: Usamos formState.isSubmitting para controlar o botão */}
        <Button type="submit" disabled={formState.isSubmitting} className="w-full">
          {formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Material
        </Button>
      </form>
    </Form>
  );
}