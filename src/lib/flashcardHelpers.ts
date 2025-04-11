
import { Flashcard } from "../context/FlashcardContext";

// Function to generate flashcard suggestions based on text input
export const generateSuggestions = (text: string): { question: string; answer: string }[] => {
  // For now, this is a simple implementation
  // In a real app, this could use AI or other algorithms to generate better suggestions
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const suggestions: { question: string; answer: string }[] = [];
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length < 10) return; // Skip very short sentences
    
    // Create a simple question by replacing key terms with blanks
    const words = trimmed.split(' ');
    if (words.length < 4) return; // Skip very short sentences
    
    // Find a candidate word to blank out (longer than 4 chars and not first/last)
    const candidateIndices = words
      .map((word, index) => ({ word, index }))
      .filter(({ word, index }) => 
        word.length > 4 && 
        index > 0 && 
        index < words.length - 1 &&
        !word.match(/^[0-9]+$/) // Avoid blanking out numbers
      );
    
    if (candidateIndices.length === 0) return;
    
    // Select a random candidate
    const { index } = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
    const answer = words[index];
    words[index] = "_______";
    
    suggestions.push({
      question: words.join(' '),
      answer,
    });
  });
  
  return suggestions;
};

// Function to sort flashcards based on various criteria
export const sortFlashcards = (
  flashcards: Flashcard[], 
  sortBy: 'createdAt' | 'lastReviewed' | 'alphabetical'
): Flashcard[] => {
  return [...flashcards].sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'lastReviewed':
        if (!a.lastReviewed) return 1;
        if (!b.lastReviewed) return -1;
        return b.lastReviewed.getTime() - a.lastReviewed.getTime();
      case 'alphabetical':
        return a.question.localeCompare(b.question);
      default:
        return 0;
    }
  });
};

// Function to filter flashcards by tag
export const filterByTag = (
  flashcards: Flashcard[],
  tag: string
): Flashcard[] => {
  if (!tag) return flashcards;
  return flashcards.filter(card => card.tags.includes(tag));
};
