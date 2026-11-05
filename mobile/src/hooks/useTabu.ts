import { useState, useCallback, useEffect, useRef } from 'react';
import { tabuKartlar } from '../data/tabu';
import { shuffleArray } from '../utils/gameEngine';

export function useTabu() {
  const deck = useRef(shuffleArray(tabuKartlar));
  const cursor = useRef(0);
  const [card, setCard] = useState(deck.current[0]);
  const [score, setScore] = useState({ correct: 0, pass: 0 });
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(seconds);
      if (!seconds) setRunning(false);
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  const nextCard = useCallback(() => {
    cursor.current += 1;
    if (cursor.current >= deck.current.length) {
      deck.current = shuffleArray(tabuKartlar);
      cursor.current = 0;
    }
    setCard(deck.current[cursor.current]);
  }, []);
  const handleCorrect = () => {
    if (!running || Date.now() >= deadline.current) return;
    setScore(s => ({ ...s, correct: s.correct + 1 }));
    nextCard();
  };
  const handlePass = () => {
    if (!running || Date.now() >= deadline.current) return;
    setScore(s => ({ ...s, pass: s.pass + 1 }));
    nextCard();
  };
  const resetScore = () => {
    setRunning(false);
    setRemaining(60);
    setScore({ correct: 0, pass: 0 });
    nextCard();
  };
  const start = () => {
    setScore({ correct: 0, pass: 0 });
    setRemaining(60);
    deadline.current = Date.now() + 60000;
    setRunning(true);
    nextCard();
  };
  return { card, score, remaining, running, start, handleCorrect, handlePass, resetScore };
}
