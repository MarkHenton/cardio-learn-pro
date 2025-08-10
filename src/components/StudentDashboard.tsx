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
  Play, 
  FileText, 
  Star,
  Clock,
  User,
  Settings,
  LogOut,
  Filter,
  Grid,
  List
} from "lucide-react";
import { useDemoStore } from "@/context/DemoStore";
import DisciplineMaterialsDrawer from "@/components/student/DisciplineMaterialsDrawer";

const StudentDashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const { disciplines: demoDiscs } = useDemoStore();

  const userProgress = {
    name: "Ana Silva",
    plan: "Premium",
    totalDisciplines: 12,
    completedDisciplines: 8,
    totalFiles: 245,
    downloadedFiles: 156,
    studyStreak: 15
  };

  const disciplines = [
    {
      id: 1,
      name: "Anatomia Humana",
      category: "Básicas",
      progress: 85,
      totalFiles: 45,
      completedFiles: 38,
      lastAccess: "2 horas atrás",
      color: "bg-blue-100 text-blue-800",
      icon: "🫀"
    },
    {
      id: 2,
      name: "Fisiologia",
      category: "Básicas",
      progress: 72,
      totalFiles: 38,
      completedFiles: 27,
      lastAccess: "1 dia atrás",
      color: "bg-green-100 text-green-800",
      icon: "🧬"
    },
    {
      id: 3,
      name: "Cardiologia",
      category: "Clínicas",
      progress: 45,
      totalFiles: 52,
      completedFiles: 23,
      lastAccess: "3 dias atrás",
      color: "bg-red-100 text-red-800",
      icon: "❤️"
    },
    {
      id: 4,
      name: "Neurologia",
      category: "Clínicas",
      progress: 30,
      totalFiles: 29,
      completedFiles: 9,
      lastAccess: "1 semana atrás",
      color: "bg-purple-100 text-purple-800",
      icon: "🧠"
    },
    {
      id: 5,
      name: "Farmacologia",
      category: "Básicas",
      progress: 60,
      totalFiles: 34,
      completedFiles: 20,
      lastAccess: "2 dias atrás",
      color: "bg-orange-100 text-orange-800",
      icon: "💊"
    },
    {
      id: 6,
      name: "Patologia",
      category: "Clínicas",
      progress: 15,
      totalFiles: 41,
      completedFiles: 6,
      lastAccess: "5 dias atrás",
      color: "bg-yellow-100 text-yellow-800",
      icon: "🔬"
    }
  ];

  const recentFiles = [
    {
      title: "Sistema Cardiovascular - Introdução",
      discipline: "Cardiologia",
      type: "PDF",
      size: "2.4 MB",
      downloadedAt: "2 horas atrás"
    },
    {
      title: "Anatomia do Coração",
      discipline: "Anatomia Humana",
      type: "PPT",
      size: "15.2 MB",
      downloadedAt: "1 dia atrás"
    },
    {
      title: "Casos Clínicos - Arritmias",
      discipline: "Cardiologia",
      type: "PDF",
      size: "1.8 MB",
      downloadedAt: "2 dias atrás"
    }
  ];

  const filteredDisciplines = disciplines.filter(discipline =>
    discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discipline.category.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="flex items-center space-x-4">
            <Badge className="bg-primary text-primary-foreground">{userProgress.plan}</Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
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

        {/* Stats Overview */}
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

        {/* Disciplinas (Demo) - 3º período Uninassau */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Disciplinas (Demo)</h2>
            <Badge variant="secondary">{demoDiscs.length} disciplinas</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoDiscs.map((d) => {
              const rel = d.counters.relatorios;
              const relTotal = rel.guiaDeEstudo + rel.documentoDeResumo + rel.perguntas + rel.linhaDoTempo;
              return (
                <Card key={d.id} className="shadow-soft hover:shadow-medium transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{d.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Slides {d.counters.slides} • Áudio {d.counters.resumoAudio} • Mapa {d.counters.mapaMental} • Relatórios {relTotal}
                        </p>
                      </div>
                      <DisciplineMaterialsDrawer disciplineId={d.id} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Disciplines Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Suas Disciplinas</h2>
              <Badge variant="secondary">{filteredDisciplines.length} disciplinas</Badge>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDisciplines.map((discipline) => (
                  <Card key={discipline.id} className="shadow-soft hover:shadow-medium transition-smooth cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{discipline.icon}</div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                              {discipline.name}
                            </CardTitle>
                            <Badge className={discipline.color} variant="secondary">
                              {discipline.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium">{discipline.progress}%</span>
                        </div>
                        <Progress value={discipline.progress} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {discipline.completedFiles}/{discipline.totalFiles} arquivos
                        </span>
                        <span className="text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {discipline.lastAccess}
                        </span>
                      </div>
                      <Button variant="medical" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Continuar Estudos
                      </Button>
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
                          <div className="text-2xl">{discipline.icon}</div>
                          <div>
                            <h3 className="font-semibold text-lg">{discipline.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <Badge className={discipline.color} variant="secondary">
                                {discipline.category}
                              </Badge>
                              <span>{discipline.completedFiles}/{discipline.totalFiles} arquivos</span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {discipline.lastAccess}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{discipline.progress}%</p>
                            <Progress value={discipline.progress} className="w-24" />
                          </div>
                          <Button variant="medical">
                            <Play className="h-4 w-4 mr-2" />
                            Continuar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Downloads */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Downloads Recentes</CardTitle>
                <CardDescription>Seus últimos materiais baixados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentFiles.map((file, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.title}</p>
                      <p className="text-xs text-muted-foreground">{file.discipline}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <span>{file.type}</span>
                        <span>•</span>
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.downloadedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Ver Todos
                </Button>
              </CardContent>
            </Card>

            {/* Study Goals */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Meta Semanal</CardTitle>
                <CardDescription>Acompanhe seu progresso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">4/7</p>
                    <p className="text-sm text-muted-foreground">dias estudados esta semana</p>
                  </div>
                  <Progress value={57} />
                  <p className="text-sm text-muted-foreground text-center">
                    Faltam apenas 3 dias para bater sua meta!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Materiais
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Favoritos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;