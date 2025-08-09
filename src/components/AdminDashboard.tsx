import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  Users, 
  BookOpen, 
  FileText, 
  PlusCircle, 
  Settings,
  BarChart3,
  Download,
  Eye,
  Trash2
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Total de Usuários", value: "2,847", icon: <Users className="h-6 w-6" />, change: "+12%" },
    { title: "Disciplinas Ativas", value: "42", icon: <BookOpen className="h-6 w-6" />, change: "+3%" },
    { title: "Arquivos Totais", value: "1,284", icon: <FileText className="h-6 w-6" />, change: "+8%" },
    { title: "Downloads do Mês", value: "15,847", icon: <Download className="h-6 w-6" />, change: "+23%" }
  ];

  const recentUsers = [
    { name: "Ana Silva", email: "ana@email.com", plan: "Premium", status: "Ativo", joined: "2024-01-15" },
    { name: "João Santos", email: "joao@email.com", plan: "Básico", status: "Ativo", joined: "2024-01-14" },
    { name: "Maria Costa", email: "maria@email.com", plan: "Premium", status: "Pendente", joined: "2024-01-13" },
    { name: "Pedro Lima", email: "pedro@email.com", plan: "Institucional", status: "Ativo", joined: "2024-01-12" }
  ];

  const disciplines = [
    { name: "Anatomia", files: 45, category: "Básicas", status: "Ativa" },
    { name: "Fisiologia", files: 38, category: "Básicas", status: "Ativa" },
    { name: "Cardiologia", files: 52, category: "Clínicas", status: "Ativa" },
    { name: "Neurologia", files: 29, category: "Clínicas", status: "Em Revisão" },
    { name: "Cirurgia Geral", files: 41, category: "Cirúrgicas", status: "Ativa" }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-primary font-medium">{stat.change} vs mês anterior</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
            <CardDescription>Novos cadastros dos últimos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={user.status === "Ativo" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{user.plan}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Disciplinas Ativas</CardTitle>
            <CardDescription>Status das disciplinas por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disciplines.slice(0, 4).map((discipline, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{discipline.name}</p>
                    <p className="text-xs text-muted-foreground">{discipline.files} arquivos</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={discipline.status === "Ativa" ? "default" : "secondary"}>
                      {discipline.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{discipline.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
          <p className="text-muted-foreground">Administre assinantes e permissões</p>
        </div>
        <Button variant="medical">
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Todos os usuários cadastrados na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={user.status === "Ativo" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                  <span className="text-sm font-medium">{user.plan}</span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Conteúdo</h2>
          <p className="text-muted-foreground">Upload e organização de materiais de estudo</p>
        </div>
        <Button variant="medical">
          <Upload className="h-4 w-4 mr-2" />
          Upload de Arquivo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Novo Upload</CardTitle>
            <CardDescription>Adicione novo material de estudo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Arquivo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-smooth cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Clique para selecionar ou arraste arquivos aqui</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, PPT até 50MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título do Material</Label>
              <Input id="title" placeholder="Ex: Anatomia do Coração - Aula 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discipline">Disciplina</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anatomia">Anatomia</SelectItem>
                  <SelectItem value="fisiologia">Fisiologia</SelectItem>
                  <SelectItem value="cardiologia">Cardiologia</SelectItem>
                  <SelectItem value="neurologia">Neurologia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aulas">Aulas</SelectItem>
                  <SelectItem value="exercicios">Exercícios</SelectItem>
                  <SelectItem value="resumos">Resumos</SelectItem>
                  <SelectItem value="casos">Casos Clínicos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Breve descrição do conteúdo..." />
            </div>
            <Button variant="medical" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Fazer Upload
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Disciplinas</CardTitle>
            <CardDescription>Gerencie as disciplinas disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disciplines.map((discipline, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{discipline.name}</p>
                      <p className="text-xs text-muted-foreground">{discipline.files} arquivos • {discipline.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={discipline.status === "Ativa" ? "default" : "secondary"}>
                      {discipline.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Disciplina
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "users", label: "Usuários", icon: <Users className="h-4 w-4" /> },
    { id: "content", label: "Conteúdo", icon: <BookOpen className="h-4 w-4" /> },
    { id: "settings", label: "Configurações", icon: <Settings className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">MedStudy Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Admin</Badge>
            <Button variant="outline" size="sm">Sair</Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "users" && renderUserManagement()}
        {activeTab === "content" && renderContentManagement()}
      </div>
    </div>
  );
};

export default AdminDashboard;