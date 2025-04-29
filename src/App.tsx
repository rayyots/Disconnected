
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import AuthPage from "./pages/AuthPage";
import DataSelectionPage from "./pages/DataSelectionPage";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import SavedPage from "./pages/SavedPage";
import RidePage from "./pages/RidePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { DataProvider } from "./context/DataContext";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <DataProvider>
            <Routes>
              <Route path="/" element={<SplashPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/data-selection" element={<DataSelectionPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/ride" element={<RidePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
          <Toaster />
          <Sonner position="top-right" />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
