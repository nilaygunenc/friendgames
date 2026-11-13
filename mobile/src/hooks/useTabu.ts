import { useState, useCallback, useEffect, useRef } from 'react';
import { tabuKartlar } from '../data/tabu';
import { TabuCard } from '../types';
import { WordManager } from '../services/WordManager';

const wordManager = new WordManager();

export function useTabu(cards: TabuCard[] = tabuKartlar) {
  const [card, setCard] = useState(cards[0] ?? tabuKartlar[0]);
  const [score, setScore] = useState({ correct: 0, pass: 0 });
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [cycleNotice, setCycleNotice] = useState(false);
  const [error, setError] = useState('');
  const deadline = useRef(0);
  const runningRef = useRef(false);
  const startingRef = useRef(false);
  const advancingRef = useRef(false);
  const scoreRef = useRef(score);

  const setGameRunning = (value: boolean) => {
    runningRef.current = value;
    setRunning(value);
  };
  const resetScores = () => {
    const empty = { correct: 0, pass: 0 };
    scoreRef.current = empty;
    setScore(empty);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(seconds);
      if (!seconds) setGameRunning(false);
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  const nextCard = useCallback(async () => {
    try {
      const result = await wordManager.draw(cards);
      setCard(result.card);
      setCycleNotice(result.recycled);
      setError('');
      return true;
    } catch (reason: any) {
      setError(reason?.message ?? 'Bu filtrelerle eşleşen kart yok.');
      setGameRunning(false);
      return false;
    }
  }, [cards]);

  const handleCorrect = () => {
    if (!runningRef.current || advancingRef.current || Date.now() >= deadline.current) return;
    advancingRef.current = true;
    const updated = { ...scoreRef.current, correct: scoreRef.current.correct + 1 };
    scoreRef.current = updated;
    setScore(updated);
    void nextCard().finally(() => { advancingRef.current = false; });
  };
  const handlePass = () => {
    if (!runningRef.current || advancingRef.current || Date.now() >= deadline.current) return;
    advancingRef.current = true;
    const updated = { ...scoreRef.current, pass: scoreRef.current.pass + 1 };
    scoreRef.current = updated;
    setScore(updated);
    void nextCard().finally(() => { advancingRef.current = false; });
  };
  const resetScore = () => {
    setGameRunning(false); setRemaining(60); resetScores(); setError(''); setCycleNotice(false);
    void nextCard();
  };
  const start = async () => {
    if (startingRef.current || runningRef.current) return;
    startingRef.current = true;
    setError('');
    try {
      if (!cards.length) { setError('Seçili filtrelerde kart bulunamadı.'); return; }
      if (!await nextCard()) return;
      resetScores(); setRemaining(60); deadline.current = Date.now() + 60000; setGameRunning(true); setCycleNotice(false);
    } finally { startingRef.current = false; }
  };
  return { card, score, remaining, running, cycleNotice, error, start, handleCorrect, handlePass, resetScore };
}
