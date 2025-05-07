
import React from 'react';
import { History } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";

const HistoryPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark pb-16">
      <main className="flex-1 overflow-auto pt-4 px-4">
        <h1 className="text-xl font-bold mb-4 text-center">Ride History</h1>
        
        <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
          <History className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 font-medium">No ride history yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your completed rides will appear here
          </p>
        </div>
      </main>
      
      <BottomNavBar />
    </div>
  );
};

export default HistoryPage;
