
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Tag, Edit, Trash, Eye } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Flashcard, useFlashcards } from "@/context/FlashcardContext";
import { filterByTag, sortFlashcards } from "@/lib/flashcardHelpers";

type FlashcardListProps = {
  onEdit: (card: Flashcard) => void;
  onView: (cards: Flashcard[]) => void;
};

const FlashcardList = ({ onEdit, onView }: FlashcardListProps) => {
  const { state, removeCard } = useFlashcards();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState<'createdAt' | 'lastReviewed' | 'alphabetical'>('createdAt');
  
  // Extract all unique tags
  const allTags = Array.from(
    new Set(state.flashcards.flatMap(card => card.tags))
  );
  
  // Filter and sort flashcards
  const filteredCards = state.flashcards
    .filter(card => 
      (card.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
       card.answer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTag ? card.tags.includes(selectedTag) : true)
    );
  
  const sortedCards = sortFlashcards(filteredCards, sortBy);
  
  const handleViewAll = () => {
    if (sortedCards.length > 0) {
      onView(sortedCards);
    }
  };

  if (state.flashcards.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <h3 className="text-xl font-medium mb-2">No flashcards yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first flashcard to get started
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-3">
          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest first</SelectItem>
              <SelectItem value="lastReviewed">Recently reviewed</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedCards.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCards.map((card) => (
              <Card key={card.id} className="flex flex-col h-full">
                <CardHeader className="flex flex-row justify-between items-start p-4">
                  <div className="line-clamp-2 font-medium">{card.question}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView([card])}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(card)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => removeCard(card.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                
                <CardContent className="flex-grow p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {card.answer}
                  </p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  {card.tags.length > 0 ? (
                    <div className="flex items-center flex-wrap gap-2">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {card.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleViewAll}>
              Study All Flashcards
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center p-6 border rounded-lg">
          <p>No flashcards match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default FlashcardList;
