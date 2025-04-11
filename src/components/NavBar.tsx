
import React from "react";
import { Brain, Plus } from "lucide-react";

type NavBarProps = {
  onCreateNew: () => void;
};

const NavBar = ({ onCreateNew }: NavBarProps) => {
  return (
    <header className="w-full py-4 border-b bg-background">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">BrainFlash</h1>
        </div>
        
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Flashcard</span>
        </button>
      </div>
    </header>
  );
};

export default NavBar;
