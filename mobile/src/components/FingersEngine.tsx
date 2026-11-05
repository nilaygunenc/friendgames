import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from '../ui';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type Phase = 'setup' | 'guess' | 'countdown' | 'touch' | 'result';

export function FingersEngine() {
  const savedGroupSize = useAppStore(s => s.groupSize);
  const language = useAppStore(s => s.language);
  const [playerCount, setPlayerCount] = useState(() => Math.max(2, Math.min(8, savedGroupSize)));
  const [scores, setScores] = useState<number[]>([]);
  const [turn, setTurn] = useState(0);
  const [guess, setGuess] = useState(0);
  const [phase, setPhase] = useState<Phase>('setup');
  const [countdown, setCountdown] = useState(3);
  const [touches, setTouches] = useState(0);
  const maxTouches = useRef(0);
  const l = (tr: string, en: string) => language === 'tr' ? tr : en;
  const playerLabel = (n: number) => l(`Oyuncu ${n + 1}`, `Player ${n + 1}`);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown === 0) {
      maxTouches.current = 0;
      setTouches(0);
      setPhase('touch');
      return;
    }
    const id = setTimeout(() => setCountdown(c => c - 1), 900);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== 'touch') return;
    const id = setTimeout(() => {
      setTouches(maxTouches.current);
      setPhase('result');
    }, 2800);
    return () => clearTimeout(id);
  }, [phase]);

  const start = () => {
    setScores(Array(playerCount).fill(0));
    setTurn(0);
    setGuess(0);
    setPhase('guess');
  };
  const countTouch = (event: any) => {
    const count = Math.min(playerCount, event?.nativeEvent?.touches?.length ?? 0);
    if (count > maxTouches.current) {
      maxTouches.current = count;
      setTouches(count);
    }
  };
  const beginCountdown = () => {
    setCountdown(3);
    setPhase('countdown');
  };
  const next = () => {
    setTurn(t => (t + 1) % playerCount);
    setGuess(0);
    setPhase('guess');
  };
  const won = guess === touches;
  const resultScores = useMemo(() => won ? scores.map((s, i) => i === turn ? s + 1 : s) : scores, [won, scores, turn]);
  const button = (label: string, onPress: () => void, secondary = false, disabled = false) => (
    <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return <View style={styles.card}>
    <Text style={styles.eyebrow}>{l('☝️ KAÇ PARMAK? 1-2-3', '☝️ HOW MANY FINGERS? 1-2-3')}</Text>
    {phase === 'setup' && <>
      <Text style={styles.title}>{l('Kaç kişi oynuyor?', 'How many people are playing?')}</Text>
      <View style={styles.picker}>
        <TouchableOpacity accessibilityLabel={l('Oyuncu azalt', 'Decrease players')} disabled={playerCount <= 2} onPress={() => setPlayerCount(n => Math.max(2, n - 1))} style={styles.pickerButton}><Text style={styles.pickerText}>−</Text></TouchableOpacity>
        <Text style={styles.pickerValue}>{playerCount}</Text>
        <TouchableOpacity accessibilityLabel={l('Oyuncu artır', 'Increase players')} disabled={playerCount >= 8} onPress={() => setPlayerCount(n => Math.min(8, n + 1))} style={styles.pickerButton}><Text style={styles.pickerText}>+</Text></TouchableOpacity>
      </View>
      <Text style={styles.note}>{l('Telefonu düz bir zemine koyun. Her oyuncu aynı anda en fazla bir parmağını oyun alanına koymalıdır.', 'Place the phone on a flat surface. Each player should place at most one finger in the play area at the same time.')}</Text>
      {button(l('Oyunu başlat', 'Start game'), start)}
    </>}
    {phase !== 'setup' && <>
      <View style={styles.scoreboard}>{scores.map((score, i) => <View key={i} style={[styles.score, i === turn && styles.currentScore]}><Text style={styles.scoreName}>{playerLabel(i)}</Text><Text style={styles.scoreValue}>{score}</Text></View>)}</View>
      {phase === 'guess' && <>
        <Text style={styles.title}>{playerLabel(turn)}</Text>
        <Text style={styles.instruction}>{l('Kaç parmağın ekrana geleceğini tahmin ediyorsun?', 'How many fingers will touch the screen?')}</Text>
        <View style={styles.guessControls}>
          <TouchableOpacity accessibilityLabel={l('Tahmini azalt', 'Decrease guess')} disabled={guess === 0} onPress={() => setGuess(n => Math.max(0, n - 1))} style={styles.pickerButton}><Text style={styles.pickerText}>−</Text></TouchableOpacity>
          <Text style={styles.guessValue}>{guess}</Text>
          <TouchableOpacity accessibilityLabel={l('Tahmini artır', 'Increase guess')} disabled={guess === playerCount} onPress={() => setGuess(n => Math.min(playerCount, n + 1))} style={styles.pickerButton}><Text style={styles.pickerText}>+</Text></TouchableOpacity>
        </View>
        <Text style={styles.note}>{l('Tahmin açıklandı. Artık kimse parmağını koyup koymayacağını söylemesin.', 'The guess is set. Nobody should reveal whether they will touch the screen.')}</Text>
        {button(l('1-2-3 başlat', 'Start 1-2-3'), beginCountdown)}
      </>}
      {phase === 'countdown' && <View style={styles.center}><Text style={styles.countdown}>{countdown}</Text><Text style={styles.instruction}>{l('Hazırlanın…', 'Get ready…')}</Text></View>}
      {phase === 'touch' && <View onTouchStart={countTouch} onTouchMove={countTouch} style={styles.touchZone}>
        <Text style={styles.touchIcon}>☝️</Text><Text style={styles.touchTitle}>{l('ŞİMDİ DOKUN!', 'TOUCH NOW!')}</Text>
        <Text style={styles.touchNote}>{l('Herkes aynı anda oyun alanına bir parmağını koysun.', 'Everyone places one finger in the play area at the same time.')}</Text>
        <Text style={styles.liveCount}>{touches}</Text>
      </View>}
      {phase === 'result' && <View style={styles.center}>
        <Text style={styles.resultEmoji}>{won ? '🎯' : '🙈'}</Text>
        <Text style={styles.resultTitle}>{l('Tahmin', 'Guess')}: {guess} · {l('Parmak', 'Fingers')}: {touches}</Text>
        <Text style={styles.instruction}>{won ? l(`${playerLabel(turn)} doğru bildi ve 1 puan kazandı!`, `${playerLabel(turn)} guessed right and earns 1 point!`) : l('Eşleşmedi. Bu turda puan yok.', 'No match. No point this round.')}</Text>
        {button(l('Sonraki oyuncu', 'Next player'), () => { if (won) setScores(resultScores); next(); })}
      </View>}
    </>}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 16, borderWidth: 1, borderColor: Colors.borderGlass },
  eyebrow: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: .8 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  instruction: { color: Colors.textPrimary, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  note: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  picker: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22 },
  pickerButton: { backgroundColor: Colors.bgDeep, borderColor: Colors.borderGlass, borderWidth: 1, width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  pickerText: { color: Colors.textPrimary, fontSize: 28, fontWeight: '700' },
  pickerValue: { color: Colors.textPrimary, fontSize: 40, minWidth: 48, textAlign: 'center', fontWeight: '900' },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center' },
  secondary: { backgroundColor: '#484288' },
  disabled: { opacity: .38 },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 14, textAlign: 'center' },
  scoreboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7 },
  score: { backgroundColor: Colors.bgDeep, borderRadius: 10, minWidth: 58, padding: 8, alignItems: 'center' },
  currentScore: { borderColor: Colors.primary, borderWidth: 1 },
  scoreName: { color: Colors.textMuted, fontSize: 10 },
  scoreValue: { color: Colors.textPrimary, fontSize: 20, fontWeight: '800' },
  guessControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22 },
  guessValue: { color: Colors.accentGold, fontSize: 64, minWidth: 70, textAlign: 'center', fontWeight: '900' },
  center: { alignItems: 'center', gap: 12 },
  countdown: { color: Colors.accentGold, fontSize: 100, lineHeight: 112, fontWeight: '900' },
  touchZone: { minHeight: 265, backgroundColor: 'rgba(16,185,129,0.14)', borderRadius: 20, borderColor: Colors.accentGreen, borderWidth: 2, justifyContent: 'center', alignItems: 'center', gap: 7, padding: 22 },
  touchIcon: { fontSize: 55 },
  touchTitle: { color: Colors.accentGreen, fontSize: 25, letterSpacing: 1, fontWeight: '900' },
  touchNote: { color: Colors.textPrimary, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  liveCount: { color: Colors.white, fontSize: 32, fontWeight: '900', marginTop: 8 },
  resultEmoji: { fontSize: 58 },
  resultTitle: { color: Colors.textPrimary, fontSize: 20, fontWeight: '800' },
});
