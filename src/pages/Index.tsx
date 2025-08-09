import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AdminDashboard from "@/components/AdminDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [currentView, setCurrentView] = useState("landing");

  // Demo navigation - em produção seria baseado em autenticação
  const renderNavigation = () => (
    <div className="fixed top-4 right-4 z-50">
      <Card className="shadow-strong">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Demo Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant={currentView === "landing" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCurrentView("landing")}
            className="w-full"
          >
            Landing Page
          </Button>
          <Button 
            variant={currentView === "admin" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCurrentView("admin")}
            className="w-full"
          >
            Admin Dashboard
          </Button>
          <Button 
            variant={currentView === "student" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCurrentView("student")}
            className="w-full"
          >
            Student Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case "admin":
        return <AdminDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <>
      {renderNavigation()}
      {renderCurrentView()}
    </>
  );
};

export default Index;
