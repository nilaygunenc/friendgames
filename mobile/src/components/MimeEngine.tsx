import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from '../ui';
import { mimeActions } from '../data/mimeActions';
import { shuffleArray } from '../utils/gameEngine';
import { Colors } from '../theme';
import { useAppStore } from '../store/useAppStore';

type Phase = 'setup' | 'director' | 'perform' | 'guess';

export function MimeEngine() {
  const playerNames = useAppStore(s => s.playerNames);
  const recordMatch = useAppStore(s => s.recordMatch);
  const [deck, setDeck] = useState(() => shuffleArray(mimeActions));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('setup');
  const [director, setDirector] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const action = deck[index];
  const directorName = playerNames[director] || `Oyuncu ${director + 1}`;
  const performerIndex = director === 0 ? 1 : 0;
  const performerName = playerNames[performerIndex] || `Oyuncu ${performerIndex + 1}`;
  const next = (correct: boolean) => {
    if (correct) setScores(old => old.map((score, i) => i === performerIndex ? score + 1 : score));
    if (index + 1 === deck.length) { setDeck(shuffleArray(mimeActions)); setIndex(0); } else setIndex(i => i + 1);
    setDirector(old => old === 0 ? 1 : 0); setPhase('director');
  };
  const finish = () => {
    const first = playerNames[0] || 'Oyuncu 1';
    const second = playerNames[1] || 'Oyuncu 2';
    const winner = scores[0] === scores[1] ? '' : scores[0] > scores[1] ? first : second;
    recordMatch({ gameId: 'ne-yapiyorum', gameName: 'Ne Yapıyorum?', participants: [first, second], winner });
    setScores([0, 0]); setDirector(0); setPhase('setup');
  };
  const button = (label: string, onPress: () => void, secondary = false) => <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.secondary]}><Text style={styles.buttonText}>{label}</Text></TouchableOpacity>;

  return <View style={styles.card}>
    <View style={styles.header}><Text style={styles.eyebrow}>🤫 NE YAPIYORUM?</Text><Text style={styles.score}>{playerNames[0] || 'Oyuncu 1'}: {scores[0]} · {playerNames[1] || 'Oyuncu 2'}: {scores[1]}</Text></View>
    {phase === 'setup' && <><Text style={styles.title}>Hareketlerle tahmin et!</Text><Text style={styles.note}>Yönlendirici komutları okur. Tahmin eden oyuncu konuşmadan uygular ve sonunda yaptığı eylemi söyler.</Text>{button('İlk kartı aç', () => setPhase('director'))}</>}
    {phase === 'director' && <><Text style={styles.title}>{directorName} yönlendirici</Text><Text style={styles.note}>{performerName} ekrana bakmasın. Aşağıdaki komutları sırayla oku; cevabı söyleme.</Text><View style={styles.steps}>{action.steps.map((step, i) => <View key={step} style={styles.step}><Text style={styles.number}>{i + 1}</Text><Text style={styles.stepText}>{step}</Text></View>)}</View>{button('Komutları gizle · Hareket et', () => setPhase('perform'))}</>}
    {phase === 'perform' && <><Text style={styles.title}>{performerName} konuşmadan hareket etsin</Text><Text style={styles.note}>{directorName}, komutları sırayla sesli söyle. Komutlar bittiğinde “Şu an ne yapıyorsun?” diye sor.</Text>{button('Tahmin zamanı', () => setPhase('guess'))}</>}
    {phase === 'guess' && <><Text style={styles.title}>{performerName} doğru bildi mi?</Text><Text style={styles.note}>Doğru cevap: {action.answer}</Text>{button('✓ Doğru bildi', () => next(true))}{button('↻ Bilemedi', () => next(false), true)}</>}
    {phase !== 'setup' && <TouchableOpacity onPress={finish} style={styles.finishButton}><Text style={styles.finishText}>Oyunu bitir ve sonucu kaydet</Text></TouchableOpacity>}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 14, borderWidth: 1, borderColor: Colors.borderGlass }, header: { gap: 5 }, eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 }, score: { color: Colors.accentGold, fontWeight: '700', fontSize: 13 }, title: { color: Colors.textPrimary, fontSize: 23, fontWeight: '800', textAlign: 'center' }, note: { color: Colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' }, steps: { gap: 9 }, step: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: Colors.bgDeep, borderRadius: 12, padding: 12 }, number: { color: Colors.white, backgroundColor: Colors.primary, width: 23, height: 23, borderRadius: 12, textAlign: 'center', lineHeight: 23, fontWeight: '800' }, stepText: { color: Colors.textPrimary, flex: 1, fontSize: 14, lineHeight: 20 }, button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center' }, secondary: { backgroundColor: '#484288' }, buttonText: { color: Colors.white, fontWeight: '700' }, finishButton: { alignItems: 'center', padding: 8 }, finishText: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
});
