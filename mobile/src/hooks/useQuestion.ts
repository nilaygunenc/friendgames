import { useState, useCallback, useRef } from 'react';
import { buzKiriciSorular, sinirSorular, kimDahaCok, sirinCani } from '../data/questions';
import { shuffleArray } from '../utils/gameEngine';

function localPool(gameId: string): string[] {
  switch (gameId) {
    case 'sinir-sorusu': return sinirSorular;
    case 'kim-daha-cok': return kimDahaCok;
    case 'sirin-cani': return sirinCani;
    default: return buzKiriciSorular;
  }
}
export function useQuestion(gameId: string) {
  const [question, setQuestion] = useState<string | null>(null);
  const deck = useRef<{ id: string; cards: string[] }>({ id: gameId, cards: [] });
  const draw = useCallback(async () => {
    if (deck.current.id !== gameId || !deck.current.cards.length) {
      deck.current = { id: gameId, cards: shuffleArray(localPool(gameId)) };
    }
    setQuestion(deck.current.cards.pop() ?? null);
  }, [gameId]);
  return { question, isLoading: false, draw };
}
