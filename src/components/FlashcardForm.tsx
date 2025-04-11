
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, X, Sparkles, BookText, FileText } from "lucide-react";

import { useFlashcards } from "@/context/FlashcardContext";
import { generateSuggestions } from "@/lib/flashcardHelpers";
import { toast } from "sonner";
import FileUploader from "./FileUploader";

type FlashcardFormProps = {
  onCancel: () => void;
};

const FlashcardForm = ({ onCancel }: FlashcardFormProps) => {
  const { addCard } = useFlashcards();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tags, setTags] = useState("");
  const [textContent, setTextContent] = useState("");
  const [suggestions, setSuggestions] = useState<{ question: string; answer: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    
    addCard({
      question: question.trim(),
      answer: answer.trim(),
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    });
    
    toast.success("Flashcard created!");
    resetForm();
    onCancel();
  };

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setTags("");
    setTextContent("");
    setSuggestions([]);
  };

  const handleGenerateSuggestions = () => {
    if (textContent.trim().length < 20) {
      toast.error("Please enter more text to generate suggestions");
      return;
    }
    
    const newSuggestions = generateSuggestions(textContent);
    if (newSuggestions.length === 0) {
      toast.error("Couldn't generate suggestions from the provided text");
      return;
    }
    
    setSuggestions(newSuggestions);
    toast.success(`Generated ${newSuggestions.length} suggestions`);
  };

  const handleTextExtracted = (text: string) => {
    setTextContent(text);
    // Automatically generate suggestions when text is extracted
    setTimeout(() => {
      if (text.trim().length >= 20) {
        const newSuggestions = generateSuggestions(text);
        if (newSuggestions.length > 0) {
          setSuggestions(newSuggestions);
          toast.success(`Generated ${newSuggestions.length} flashcard suggestions`);
        } else {
          toast.error("Couldn't generate suggestions from the provided text");
        }
      }
    }, 100);
  };

  const applySuggestion = (suggestion: { question: string; answer: string }) => {
    setQuestion(suggestion.question);
    setAnswer(suggestion.answer);
    toast.success("Suggestion applied");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Create a New Flashcard</CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="manual">
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="manual" className="flex-1">
              <BookText className="mr-2 h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="smart" className="flex-1">
              <Sparkles className="mr-2 h-4 w-4" />
              Smart Generator
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Upload File
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="manual">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea 
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the front side of your flashcard"
                  className="min-h-[80px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea 
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the back side of your flashcard"
                  className="min-h-[80px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="math, science, history"
                />
              </div>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="smart">
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textContent">
                  Paste your text and we'll generate flashcard suggestions
                </Label>
                <Textarea 
                  id="textContent"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste a paragraph of text to generate flashcard suggestions..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button 
                type="button" 
                onClick={handleGenerateSuggestions}
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Suggestions
              </Button>
              
              {suggestions.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h3 className="font-medium text-lg">Suggested Flashcards</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="border rounded-md p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <p className="mb-1"><span className="font-medium">Q:</span> {suggestion.question}</p>
                        <p className="mb-2"><span className="font-medium">A:</span> {suggestion.answer}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          Use This
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="upload">
          <CardContent>
            <FileUploader onTextExtracted={handleTextExtracted} />
            
            {suggestions.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-lg">Generated Flashcards</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="border rounded-md p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <p className="mb-1"><span className="font-medium">Q:</span> {suggestion.question}</p>
                      <p className="mb-2"><span className="font-medium">A:</span> {suggestion.answer}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        Use This
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <Separator />
        
        <CardFooter className="flex justify-between py-4">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Check className="mr-2 h-4 w-4" />
            Create Flashcard
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default FlashcardForm;
