// src/components/StudentDashboard.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Download, 
  Search, 
  FileText, 
  Star,
  User,
  Settings,
  LogOut,
  Filter,
  Grid,
  List
} from "lucide-react";
import { useDemoStore } from "@/context/DemoStore";
import DisciplineMaterialsDrawer from "@/components/student/DisciplineMaterialsDrawer";
import { Link } from "react-router-dom";
import { auth } from "@/lib/firebaseConfig"; // Importa o auth para o logout

const StudentDashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const { disciplines, subscribers } = useDemoStore();
  
  const currentUser = auth.currentUser; // Pega o usuário logado do Firebase

  const userProgress = {
    name: currentUser?.displayName || currentUser?.email || "Usuário",
    plan: "Premium", // Placeholder
    totalDisciplines: disciplines.length,
    completedDisciplines: 8, // Placeholder
    totalFiles: 245, // Placeholder
    downloadedFiles: 156, // Placeholder
    studyStreak: 15 // Placeholder
  };

  const filteredDisciplines = disciplines.filter(discipline =>
    discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">MedStudy</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary text-primary-foreground">{userProgress.plan}</Badge>
            {/* Link para a nova página de perfil */}
            <Button asChild variant="ghost" size="icon">
              <Link to="/student/profile" title="Meu Perfil">
                <User className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" title="Configurações">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Sair" onClick={() => signOut(auth)}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Olá, {userProgress.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue seus estudos de onde parou. Você está indo muito bem!
          </p>
        </div>

        {/* O restante do seu componente continua igual... */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progresso Geral</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round((userProgress.completedDisciplines / userProgress.totalDisciplines) * 100)}%</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
              <Progress value={(userProgress.completedDisciplines / userProgress.totalDisciplines) * 100} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Arquivos Baixados</p>
                  <p className="text-2xl font-bold text-foreground">{userProgress.downloadedFiles}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Download className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">de {userProgress.totalFiles} disponíveis</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sequência de Estudos</p>
                  <p className="text-2xl font-bold text-foreground">{userProgress.studyStreak} dias</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Star className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Continue assim!</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disciplinas Ativas</p>
                  <p className="text-2xl font-bold text-foreground">{userProgress.totalDisciplines}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{userProgress.completedDisciplines} concluídas</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar disciplinas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1">
          {/* Disciplines Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Disciplinas</h2>
              <Badge variant="secondary">{filteredDisciplines.length} disciplinas</Badge>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDisciplines.map((discipline) => (
                  <Card key={discipline.id} className="shadow-soft hover:shadow-medium transition-smooth cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            <BookOpen className="h-8 w-8" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                              {discipline.name}
                            </CardTitle>
                            <Badge variant="secondary">
                              {discipline.course}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <Progress value={75} />
                      </div>
                      <DisciplineMaterialsDrawer disciplineId={discipline.id} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDisciplines.map((discipline) => (
                  <Card key={discipline.id} className="shadow-soft hover:shadow-medium transition-smooth cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            <BookOpen className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{discipline.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <Badge variant="secondary">
                                {discipline.course}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">75%</p>
                            <Progress value={75} className="w-24" />
                          </div>
                          <DisciplineMaterialsDrawer disciplineId={discipline.id} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
