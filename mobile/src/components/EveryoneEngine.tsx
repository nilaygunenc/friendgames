import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from '../ui';
import { everyoneQuestions, everyoneQuestionsEn } from '../data/everyone';
import { shuffleArray } from '../utils/gameEngine';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type Phase = 'ready' | 'countdown' | 'point' | 'talk';

export function EveryoneEngine() {
  const language = useAppStore(s => s.language);
  const questions = useMemo(
    () => language === 'tr' ? everyoneQuestions : everyoneQuestionsEn,
    [language],
  );
  const [deck, setDeck] = useState(() => shuffleArray(questions));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [seconds, setSeconds] = useState(3);
  const l = (tr: string, en: string) => language === 'tr' ? tr : en;

  useEffect(() => {
    setDeck(shuffleArray(questions));
    setIndex(0);
    setPhase('ready');
  }, [questions]);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (seconds === 0) {
      setPhase('point');
      return;
    }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, seconds]);

  const start = () => {
    setSeconds(3);
    setPhase('countdown');
  };
  const next = () => {
    if (index + 1 === deck.length) {
      setDeck(shuffleArray(questions));
      setIndex(0);
    } else {
      setIndex(i => i + 1);
    }
    setPhase('ready');
  };
  const button = (label: string, onPress: () => void, secondary = false) => (
    <TouchableOpacity accessibilityRole="button" onPress={onPress}
      style={[styles.button, secondary && styles.secondary]}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
  const question = deck[index] ?? questions[0];

  return <View style={styles.card}>
    <View style={styles.header}><Text style={styles.eyebrow}>{l('👀 HERKESİN GÖZÜ BİRBİRİNDE', '👀 ALL EYES ON EACH OTHER')}</Text><Text style={styles.progress}>{index + 1}/{questions.length}</Text></View>
    <View style={styles.question}><Text style={styles.questionText}>{question}</Text></View>
    {phase === 'ready' && <>
      <Text style={styles.instruction}>{l('Herkes cevabını sessizce seçsin. Hazır olduğunuzda geri sayımı başlatın.', 'Everyone chooses silently. Start the countdown when you are ready.')}</Text>
      {button(l('3 saniyelik geri sayımı başlat', 'Start 3-second countdown'), start)}
    </>}
    {phase === 'countdown' && <View style={styles.center}>
      <Text style={styles.countdown}>{seconds}</Text>
      <Text style={styles.instruction}>{l('Seçimini düşün. Henüz gösterme!', 'Choose your person. Do not point yet!')}</Text>
    </View>}
    {phase === 'point' && <View style={styles.center}>
      <Text style={styles.point}>👉</Text>
      <Text style={styles.pointTitle}>{l('ŞİMDİ GÖSTER!', 'POINT NOW!')}</Text>
      <Text style={styles.instruction}>{l('Herkes aynı anda seçtiği kişiyi göstersin.', 'Everyone points to their chosen person at the same time.')}</Text>
      {button(l('Seçimleri konuşun', 'Discuss the choices'), () => setPhase('talk'), true)}
    </View>}
    {phase === 'talk' && <>
      <Text style={styles.instruction}>{l('Kim en çok seçildi? Neden? Yorumlayın, gülün ve sonra devam edin.', 'Who got the most votes? Why? Talk, laugh, then continue.')}</Text>
      {button(l('Sonraki soru', 'Next question'), next)}
    </>}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 16, borderWidth: 1, borderColor: Colors.borderGlass },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: .8, flex: 1 },
  progress: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  question: { backgroundColor: 'rgba(99,102,241,0.16)', borderRadius: 16, padding: 22, minHeight: 140, alignItems: 'center', justifyContent: 'center' },
  questionText: { color: Colors.textPrimary, fontSize: 22, lineHeight: 30, fontWeight: '800', textAlign: 'center' },
  instruction: { color: Colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  center: { alignItems: 'center', gap: 10 },
  countdown: { color: Colors.accentGold, fontSize: 88, fontWeight: '900', lineHeight: 100 },
  point: { fontSize: 60 },
  pointTitle: { color: Colors.accentGreen, fontSize: 25, fontWeight: '900', letterSpacing: 1 },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center' },
  secondary: { backgroundColor: '#484288' },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 14, textAlign: 'center' },
});
