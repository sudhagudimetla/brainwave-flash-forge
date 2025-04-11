
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain } from "lucide-react";

import NavBar from "@/components/NavBar";
import FlashcardForm from "@/components/FlashcardForm";
import FlashcardList from "@/components/FlashcardList";
import FlashcardView from "@/components/FlashcardView";
import { FlashcardProvider, Flashcard } from "@/context/FlashcardContext";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  
  const handleCreateNew = () => {
    setEditingCard(null);
    setShowForm(true);
  };
  
  const handleEdit = (card: Flashcard) => {
    setEditingCard(card);
    setShowForm(true);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCard(null);
  };
  
  const handleView = (cards: Flashcard[]) => {
    setStudyCards(cards);
    setViewMode(true);
  };
  
  const handleCloseView = () => {
    setViewMode(false);
    setStudyCards([]);
  };

  return (
    <FlashcardProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <NavBar onCreateNew={handleCreateNew} />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {viewMode ? (
            <FlashcardView 
              cards={studyCards} 
              onClose={handleCloseView} 
            />
          ) : showForm ? (
            <FlashcardForm 
              onCancel={handleCancelForm} 
            />
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex justify-center">
                  <Brain className="h-12 w-12 text-primary mb-2" />
                </div>
                <h1 className="text-3xl font-bold">BrainFlash</h1>
                <p className="text-muted-foreground mt-2">
                  Your smart flashcard generator and study assistant
                </p>
              </div>
              
              <Tabs defaultValue="my-cards" className="w-full">
                <TabsList className="w-full max-w-md mx-auto mb-6">
                  <TabsTrigger value="my-cards" className="flex-1">My Flashcards</TabsTrigger>
                  <TabsTrigger value="study" className="flex-1">Study Statistics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-cards">
                  <FlashcardList onEdit={handleEdit} onView={handleView} />
                </TabsContent>
                
                <TabsContent value="study">
                  <div className="text-center p-8 border rounded-lg">
                    <h3 className="text-xl font-medium mb-4">Study Statistics Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Track your progress and review history in future updates
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
        
        <footer className="py-6 border-t bg-muted/20">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>BrainFlash Flashcard Generator © 2025</p>
          </div>
        </footer>
      </div>
    </FlashcardProvider>
  );
};

export default Index;
