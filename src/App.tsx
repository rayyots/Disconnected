
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SplashPage from "./pages/SplashPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import SavedPage from "./pages/SavedPage";
import RidePage from "./pages/RidePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { checkAndSeedData } from "./firebase/seedData";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

// Protected route component to secure routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);
  
  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize Firebase and seed data if needed
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Seed database with test data if needed
        await checkAndSeedData();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing app:", error);
        setIsInitialized(true); // Continue anyway
      }
    };
    
    initializeApp();
  }, []);
  
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-disconnected-dark">
        <div className="animate-pulse text-disconnected-light">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SplashPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/ride" element={
                <ProtectedRoute>
                  <RidePage />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              } />
              <Route path="/saved" element={
                <ProtectedRoute>
                  <SavedPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
