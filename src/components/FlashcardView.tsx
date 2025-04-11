
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFlashcards, Flashcard } from "@/context/FlashcardContext";

type FlashcardViewProps = {
  cards: Flashcard[];
  onClose: () => void;
};

const FlashcardView = ({ cards, onClose }: FlashcardViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { updateCard } = useFlashcards();
  
  const currentCard = cards[currentIndex];
  
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      
      // Mark as reviewed
      if (currentCard) {
        updateCard({
          ...currentCard,
          lastReviewed: new Date(),
        });
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!currentCard) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8">
        <h3 className="text-xl font-medium mb-4">No flashcards available</h3>
        <Button onClick={onClose}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <div 
        className="flashcard-container w-full aspect-[4/3] mb-6"
        onClick={toggleFlip}
      >
        <div className={`flashcard relative w-full h-full ${isFlipped ? 'flipped' : ''}`}>
          <Card className="flashcard-front flex items-center justify-center p-8 absolute inset-0 cursor-pointer shadow-lg border-2 border-primary/20">
            <div className="text-center">
              <p className="text-xl font-medium select-none">{currentCard.question}</p>
              <p className="text-sm text-muted-foreground mt-4">Click to reveal answer</p>
            </div>
          </Card>
          
          <Card className="flashcard-back flex items-center justify-center p-8 absolute inset-0 cursor-pointer shadow-lg border-2 border-secondary/20 bg-accent/10">
            <div className="text-center">
              <p className="text-xl font-medium select-none">{currentCard.answer}</p>
              <p className="text-sm text-muted-foreground mt-4">Click to see question</p>
            </div>
          </Card>
        </div>
      </div>
      
      {currentCard.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {currentCard.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        
        <Button variant="outline" onClick={toggleFlip}>
          <RotateCcw className="mr-1 h-4 w-4" />
          Flip
        </Button>
        
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardView;
