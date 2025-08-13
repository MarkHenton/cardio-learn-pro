// src/pages/Student.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import StudentDashboard from "@/components/StudentDashboard";

// Importações do Firebase - usando o arquivo que criamos!
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

// --- Formulário de Login e Cadastro ---
const AuthPage = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    nome_completo: '',
    telefone: '',
    faculdade: '',
    periodo: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      toast({ title: "Login bem-sucedido!" });
    } catch (err: any) {
      setError("Email ou senha inválidos.");
      console.error("Firebase login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.email || !signUpData.password || !signUpData.nome_completo) {
        setError("Nome completo, email e senha são obrigatórios.");
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nome_completo: signUpData.nome_completo,
        email: signUpData.email,
        telefone: signUpData.telefone || null,
        faculdade: signUpData.faculdade || null,
        periodo: signUpData.periodo ? parseInt(signUpData.periodo, 10) : null,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Cadastro realizado com sucesso!" });
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso.");
      } else {
        setError("Ocorreu um erro no cadastro. Tente novamente.");
      }
      console.error("Firebase registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Criar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Acessar Plataforma</CardTitle>
              <CardDescription>Use seu email e senha para entrar.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" name="email" type="email" value={loginData.email} onChange={handleLoginChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Senha</Label>
                  <Input id="password-login" name="password" type="password" value={loginData.password} onChange={handleLoginChange} required />
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start">
                {error && <p className="text-sm text-destructive mb-4">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription>Preencha seus dados para começar a estudar.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUpSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_completo">Nome Completo</Label>
                  <Input id="nome_completo" name="nome_completo" value={signUpData.nome_completo} onChange={handleSignUpChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" name="email" type="email" value={signUpData.email} onChange={handleSignUpChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Senha</Label>
                  <Input id="password-signup" name="password" type="password" value={signUpData.password} onChange={handleSignUpChange} required />
                </div>
                {/* Campos adicionais podem ser adicionados aqui se desejar */}
              </CardContent>
              <CardFooter className="flex-col items-start">
                 {error && <p className="text-sm text-destructive mb-4">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Criando...' : 'Criar Conta'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


// --- Componente Principal da Página do Estudante ---
const StudentPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged é um "ouvinte" que avisa se o usuário está logado ou não
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpa o ouvinte quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Pode adicionar um componente de loading mais bonito aqui
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  // Se houver um usuário logado, mostra o dashboard. Senão, mostra a página de autenticação.
  return user ? <StudentDashboard /> : <AuthPage />;
};

export default StudentPage;

