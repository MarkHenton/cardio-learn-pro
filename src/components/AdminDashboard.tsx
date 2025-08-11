import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  BookOpen, 
  FileText, 
  PlusCircle, 
  Settings,
  BarChart3,
  Download,
  Eye
} from "lucide-react";
import { useDemoStore } from "@/context/DemoStore";
// import UploadMaterialForm from "@/components/admin/UploadMaterialForm";
// import AddCatalogDialog from "@/components/admin/AddCatalogDialog";
import { Link, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const activeTabFromUrl = location.pathname.split("/")[2] || "overview";
  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const { disciplines, subscribers } = useDemoStore();

  const stats = [
    { title: "Total de Usuários", value: subscribers.length, icon: <Users className="h-6 w-6" />, change: "+12%" },
    { title: "Disciplinas Ativas", value: disciplines.length, icon: <BookOpen className="h-6 w-6" />, change: "+3%" },
    { title: "Arquivos Totais", value: "1,284", icon: <FileText className="h-6 w-6" />, change: "+8%" },
    { title: "Downloads do Mês", value: "15,847", icon: <Download className="h-6 w-6" />, change: "+23%" }
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
              {subscribers.slice(0, 4).map((user, index) => (
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
            <CardDescription>Status das disciplinas por curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disciplines.slice(0, 4).map((discipline, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{discipline.name}</p>
                    <p className="text-xs text-muted-foreground">{discipline.course}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={"default"}>
                      Ativa
                    </Badge>
                    <p className="text-xs text-muted-foreground">{discipline.course}</p>
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
            {subscribers.map((user, index) => (
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
        <div className="flex gap-2">
          {/* <AddCatalogDialog /> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <UploadMaterialForm /> */}

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Disciplinas</CardTitle>
            <CardDescription>Resumo por disciplina (contadores em tempo real)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disciplines.map((discipline) => {
                const rel = discipline.counters.relatorios;
                const relTotal = rel.guiaDeEstudo + rel.documentoDeResumo + rel.perguntas + rel.linhaDoTempo;
                return (
                  <div key={discipline.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{discipline.name}</p>
                        <p className="text-xs text-muted-foreground">{discipline.course} • 3º período</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary">Slides {discipline.counters.slides}</Badge>
                      <Badge variant="secondary">Áudio {discipline.counters.resumoAudio}</Badge>
                      <Badge variant="secondary">Mapa {discipline.counters.mapaMental}</Badge>
                      <Badge variant="secondary">Relatórios {relTotal}</Badge>
                    </div>
                  </div>
                );
              })}
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações</h2>
      <p className="text-muted-foreground">
        Esta é a página de configurações. O conteúdo para esta seção pode ser adicionado aqui.
      </p>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: <BarChart3 className="h-4 w-4" />, href: "/admin" },
    { id: "users", label: "Usuários", icon: <Users className="h-4 w-4" />, href: "/admin/users" },
    { id: "content", label: "Conteúdo", icon: <BookOpen className="h-4 w-4" />, href: "/admin/content" },
    { id: "settings", label: "Configurações", icon: <Settings className="h-4 w-4" />, href: "/admin/settings" }
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
            <Button asChild variant="outline" size="sm">
              <Link to="/">Sair</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted rounded-lg w-fit">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "users" && renderUserManagement()}
        {activeTab === "content" && renderContentManagement()}
        {activeTab === "settings" && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;
