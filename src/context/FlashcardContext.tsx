
import React, { createContext, useContext, useReducer, ReactNode } from "react";

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  lastReviewed?: Date;
  tags: string[];
};

type FlashcardState = {
  flashcards: Flashcard[];
  activeCard: Flashcard | null;
};

type FlashcardAction =
  | { type: "ADD_CARD"; payload: Flashcard }
  | { type: "REMOVE_CARD"; payload: string }
  | { type: "UPDATE_CARD"; payload: Flashcard }
  | { type: "SET_ACTIVE_CARD"; payload: Flashcard | null };

const initialState: FlashcardState = {
  flashcards: [],
  activeCard: null,
};

const reducer = (state: FlashcardState, action: FlashcardAction): FlashcardState => {
  switch (action.type) {
    case "ADD_CARD":
      return {
        ...state,
        flashcards: [...state.flashcards, action.payload],
      };
    case "REMOVE_CARD":
      return {
        ...state,
        flashcards: state.flashcards.filter(card => card.id !== action.payload),
      };
    case "UPDATE_CARD":
      return {
        ...state,
        flashcards: state.flashcards.map(card => 
          card.id === action.payload.id ? action.payload : card
        ),
      };
    case "SET_ACTIVE_CARD":
      return {
        ...state,
        activeCard: action.payload,
      };
    default:
      return state;
  }
};

type FlashcardContextType = {
  state: FlashcardState;
  addCard: (card: Omit<Flashcard, "id" | "createdAt">) => void;
  removeCard: (id: string) => void;
  updateCard: (card: Flashcard) => void;
  setActiveCard: (card: Flashcard | null) => void;
};

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
};

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addCard = (card: Omit<Flashcard, "id" | "createdAt">) => {
    const newCard: Flashcard = {
      ...card,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    dispatch({ type: "ADD_CARD", payload: newCard });
  };

  const removeCard = (id: string) => {
    dispatch({ type: "REMOVE_CARD", payload: id });
  };

  const updateCard = (card: Flashcard) => {
    dispatch({ type: "UPDATE_CARD", payload: card });
  };

  const setActiveCard = (card: Flashcard | null) => {
    dispatch({ type: "SET_ACTIVE_CARD", payload: card });
  };

  return (
    <FlashcardContext.Provider
      value={{ state, addCard, removeCard, updateCard, setActiveCard }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};
