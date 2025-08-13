// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminPage from "./pages/Admin";
import StudentPage from "./pages/Student";
import NotFound from "./pages/NotFound";
import { DemoStoreProvider } from "@/context/DemoStore";

// Importa a nova página de perfil
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DemoStoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/*" element={<AdminPage />} />
            {/* A rota /student agora leva para a página que decide se mostra o login ou o dashboard */}
            <Route path="/student" element={<StudentPage />} />
            {/* Nova rota para a página de perfil */}
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DemoStoreProvider>
  </QueryClientProvider>
);

export default App;
