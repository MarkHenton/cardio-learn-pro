import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Upload, Shield, Star, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

const LandingPage = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Biblioteca Organizada",
      description: "Acesse materiais de estudo organizados por disciplina e categoria"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidade Médica",
      description: "Conecte-se com outros estudantes e profissionais da medicina"
    },
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Atualizações Constantes",
      description: "Novo conteúdo adicionado regularmente pelos nossos especialistas"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Segurança de Dados",
      description: "Seus dados e progresso protegidos com tecnologia de ponta"
    }
  ];

  const plans = [
    {
      name: "Básico",
      price: "R$ 29",
      period: "/mês",
      description: "Ideal para estudantes iniciantes",
      features: [
        "Acesso a 5 disciplinas",
        "Download de materiais",
        "Suporte por email",
        "Atualizações mensais"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "R$ 59",
      period: "/mês",
      description: "Para estudantes avançados",
      features: [
        "Acesso ilimitado a todas disciplinas",
        "Download de materiais",
        "Suporte prioritário",
        "Atualizações semanais",
        "Simulados exclusivos",
        "Mentoria online"
      ],
      popular: true
    },
    {
      name: "Institucional",
      price: "R$ 199",
      period: "/mês",
      description: "Para universidades e grupos",
      features: [
        "Até 50 usuários",
        "Dashboard administrativo",
        "Relatórios de progresso",
        "Personalização de conteúdo",
        "Suporte 24/7",
        "Treinamento da equipe"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Dr. Ana Silva",
      role: "Residente em Cardiologia",
      content: "Esta plataforma transformou minha forma de estudar. O conteúdo é atualizado e muito bem organizado.",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Estudante de Medicina - 4º ano",
      content: "Consegui melhorar minhas notas significativamente. Os materiais são de excelente qualidade.",
      rating: 5
    },
    {
      name: "Dra. Maria Costa",
      role: "Professora de Anatomia",
      content: "Recomendo para todos os meus alunos. É uma ferramenta indispensável para o ensino médico.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">MedStudy</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-smooth">Recursos</a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-smooth">Planos</a>
            <a href="#testimonials" className="text-foreground/80 hover:text-foreground transition-smooth">Depoimentos</a>
            <Button variant="outline" size="sm">Entrar</Button>
            <Button variant="medical" size="sm">Começar Agora</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-accent text-accent-foreground">Nova Plataforma</Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  O futuro do ensino médico está
                  <span className="bg-gradient-hero bg-clip-text text-transparent"> aqui</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Acesse materiais de estudo organizados por especialistas, atualizados constantemente 
                  e disponíveis em qualquer dispositivo.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Começar Gratuitamente
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Ver Demonstração
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>14 dias grátis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Estudantes de medicina estudando" 
                className="rounded-2xl shadow-strong object-cover w-full h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Recursos que fazem a diferença
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desenvolvido especialmente para estudantes e profissionais da medicina
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Escolha seu plano
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Planos flexíveis para cada momento da sua jornada médica
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-strong' : 'shadow-soft'} hover:shadow-medium transition-smooth`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary">
                    {plan.price}<span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.popular ? "hero" : "outline"} 
                    className="w-full"
                    size="lg"
                  >
                    {plan.popular ? "Escolher Premium" : "Escolher Plano"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de estudantes e profissionais da medicina
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para revolucionar seus estudos?
            </h2>
            <p className="text-xl opacity-90">
              Junte-se a milhares de estudantes que já estão transformando sua jornada médica
            </p>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              Começar Gratuitamente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">MedStudy</span>
              </div>
              <p className="text-muted-foreground">
                Transformando a educação médica através da tecnologia.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Produto</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Recursos</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">API</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Suporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Documentação</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Status</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Termos</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MedStudy. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;