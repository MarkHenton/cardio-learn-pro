// src/pages/ProfilePage.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Importações do Firebase
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

// Interface para os dados do perfil do usuário
interface UserProfile {
  nome_completo: string;
  email: string;
  telefone?: string;
  faculdade?: string;
  periodo?: number;
}

export const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [initialProfile, setInitialProfile] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Efeito para observar o estado de autenticação e buscar os dados do perfil
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Busca os dados do perfil no Firestore usando o UID do usuário
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
          setInitialProfile(data); // Guarda o estado inicial para o botão "Cancelar"
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe(); // Limpa o "ouvinte" ao desmontar o componente
  }, []);
  
  // Atualiza o estado do formulário quando o usuário digita
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Salva as alterações no Firestore
  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        telefone: profile.telefone || null,
        faculdade: profile.faculdade || null,
        periodo: profile.periodo ? parseInt(String(profile.periodo), 10) : null,
      });
      toast({ title: "Perfil atualizado com sucesso!" });
      setInitialProfile(profile); // Atualiza o estado inicial após salvar
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({ title: "Erro ao atualizar.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancela a edição e restaura os dados iniciais
  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
  };

  // Renderiza um esqueleto de carregamento enquanto busca os dados
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se não houver usuário, pede para fazer login
  if (!user) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <p className="mb-4">Por favor, faça login para ver seu perfil.</p>
            <Button asChild>
                <Link to="/student">Ir para Login</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <div className='flex items-center gap-4'>
                <Button asChild variant="outline" size="icon">
                  <Link to="/student">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <CardTitle>Meu Perfil</CardTitle>
              </div>
              <CardDescription>Veja e edite suas informações pessoais.</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>Editar</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>Nome Completo</Label>
            <Input value={profile.nome_completo || ''} disabled />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile.email || ''} disabled />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" name="telefone" value={profile.telefone || ''} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="faculdade">Faculdade</Label>
            <Input id="faculdade" name="faculdade" value={profile.faculdade || ''} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="periodo">Período</Label>
            <Input id="periodo" name="periodo" type="number" value={profile.periodo || ''} onChange={handleInputChange} disabled={!isEditing} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
