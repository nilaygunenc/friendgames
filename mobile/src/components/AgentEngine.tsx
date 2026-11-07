import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from '../ui';
import { shuffleArray } from '../utils/gameEngine';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type Phase = 'setup' | 'deal' | 'talk' | 'vote' | 'guess' | 'finished';
const locations = [
  { tr: 'Havaalanı', en: 'Airport' }, { tr: 'Kütüphane', en: 'Library' }, { tr: 'Lunapark', en: 'Amusement park' },
  { tr: 'Hastane', en: 'Hospital' }, { tr: 'Stadyum', en: 'Stadium' }, { tr: 'Uzay istasyonu', en: 'Space station' },
];

export function AgentEngine() {
  const groupSize = useAppStore(s => s.groupSize);
  const language = useAppStore(s => s.language);
  const playerNames = useAppStore(s => s.playerNames);
  const recordMatch = useAppStore(s => s.recordMatch);
  const [playerCount, setPlayerCount] = useState(() => Math.max(4, Math.min(12, groupSize)));
  const [agent, setAgent] = useState(0);
  const [location, setLocation] = useState(locations[0]);
  const [current, setCurrent] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [phase, setPhase] = useState<Phase>('setup');
  const [result, setResult] = useState('');
  const [agentWon, setAgentWon] = useState<boolean | null>(null);
  const l = (tr: string, en: string) => language === 'tr' ? tr : en;
  const player = (index: number) => playerNames[index] || l(`Oyuncu ${index + 1}`, `Player ${index + 1}`);
  const locationName = language === 'tr' ? location.tr : location.en;
  const choices = useMemo(() => shuffleArray(locations.filter(item => item !== location)).slice(0, 3).concat(location), [location]);
  const begin = () => { setAgent(Math.floor(Math.random() * playerCount)); setLocation(locations[Math.floor(Math.random() * locations.length)]); setCurrent(0); setReveal(false); setResult(''); setAgentWon(null); setPhase('deal'); };
  const next = () => { if (reveal) { setReveal(false); if (current + 1 === playerCount) setPhase('talk'); else setCurrent(c => c + 1); } else setReveal(true); };
  const reset = () => { setPhase('setup'); setReveal(false); setResult(''); setAgentWon(null); };
  const saveAndReset = () => { recordMatch({ gameId: 'ajan-mi', gameName: 'Ajan Mı?', participants: Array.from({ length: playerCount }, (_, i) => player(i)), winner: agentWon ? player(agent) : l('Grup', 'Group') }); reset(); };
  const button = (label: string, onPress: () => void, secondary = false) => <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.secondary]}><Text style={styles.buttonText}>{label}</Text></TouchableOpacity>;

  if (phase === 'setup') return <View style={styles.card}><Text style={styles.eyebrow}>{l('🕶️ AJAN MI?', '🕶️ THE SPY?')}</Text><Text style={styles.title}>{l('Oyuncu sayısı', 'Player count')}</Text><View style={styles.picker}><TouchableOpacity onPress={() => setPlayerCount(n => Math.max(4, n - 1))} style={styles.circle}><Text style={styles.circleText}>−</Text></TouchableOpacity><Text style={styles.value}>{playerCount}</Text><TouchableOpacity onPress={() => setPlayerCount(n => Math.min(12, n + 1))} style={styles.circle}><Text style={styles.circleText}>+</Text></TouchableOpacity></View><Text style={styles.note}>{l('Bir ajan konumu bilmez. Diğerleri konumu açık etmeden sorularla ajanı bulur.', 'One spy does not know the location. Others ask questions without revealing it.')}</Text>{button(l('Gizli bilgileri dağıt', 'Deal secret information'), begin)}</View>;

  if (phase === 'deal') return <View style={styles.card}><Text style={styles.eyebrow}>{l('GİZLİ BİLGİ DAĞITIMI', 'SECRET INFORMATION DEAL')}</Text><Text style={styles.title}>{player(current)}</Text><View style={styles.secret}>{reveal ? current === agent ? <><Text style={styles.secretEmoji}>🕶️</Text><Text style={styles.title}>{l('SEN AJANSIN', 'YOU ARE THE SPY')}</Text><Text style={styles.note}>{l('Konumu bilmiyorsun. Sorularla ipucu topla ve tahmin etmeye çalış.', 'You do not know the location. Gather clues and try to guess it.')}</Text></> : <><Text style={styles.secretEmoji}>📍</Text><Text style={styles.title}>{locationName}</Text><Text style={styles.note}>{l('Konumu doğrudan söyleme. Ajanı bulmak için dikkatli sorular sor.', 'Do not say the location directly. Ask careful questions to find the spy.')}</Text></> : <Text style={styles.note}>{l('Telefonu yalnızca bu oyuncu alsın.', 'Only this player takes the phone.')}</Text>}</View>{button(reveal ? (current + 1 === playerCount ? l('Gizle ve tartışmayı başlat', 'Hide and start discussion') : l('Gizle ve sonraki oyuncu', 'Hide and next player')) : l('Bilgimi gör', 'View my information'), next)}</View>;

  if (phase === 'talk') return <View style={styles.card}><Text style={styles.eyebrow}>{l('💬 SORU TURU', '💬 QUESTION ROUND')}</Text><Text style={styles.title}>{l('Sırayla şüphe uyandırmayan sorular sorun', 'Take turns asking non-revealing questions')}</Text><Text style={styles.note}>{l('Örnek: “Burada çalışır mıydın?” Konumu doğrudan söylemeyin. Hazır olduğunuzda oylamaya geçin.', 'Example: “Would you work here?” Do not reveal the location. Vote when ready.')}</Text>{button(l('Ajanı oylayın', 'Vote for the spy'), () => setPhase('vote'))}</View>;

  const chooseSuspect = (index: number) => {
    if (index === agent) {
      setResult(l('🎉 Grup ajanı buldu! Ama ajan son bir tahmin yapabilir.', '🎉 The group found the spy! The spy gets one final guess.'));
      setPhase('guess');
    } else {
      setResult(l('🕶️ Yanlış kişi seçildi. Ajan kazandı!', '🕶️ The wrong person was selected. The spy wins!'));
      setAgentWon(true);
      setPhase('finished');
    }
  };

  if (phase === 'vote') return <View style={styles.card}><Text style={styles.eyebrow}>{l('🗳️ AJAN OYLAMASI', '🗳️ SPY VOTE')}</Text><Text style={styles.title}>{l('Grup kimi ajan seçti?', 'Who did the group choose as the spy?')}</Text><View style={styles.players}>{Array.from({ length: playerCount }, (_, index) => <TouchableOpacity key={index} onPress={() => chooseSuspect(index)} style={styles.player}><Text style={styles.playerText}>{player(index)}</Text></TouchableOpacity>)}</View></View>;

  if (phase === 'guess') return <View style={styles.card}><Text style={styles.eyebrow}>{l('AJANIN SON TAHMİNİ', 'SPY FINAL GUESS')}</Text><Text style={styles.title}>{l('Ajan hangi konumu seçiyor?', 'Which location does the spy choose?')}</Text><View style={styles.players}>{choices.map(choice => <TouchableOpacity key={choice.tr} onPress={() => { const guessedRight = choice === location; setAgentWon(guessedRight); setResult(guessedRight ? l('🕶️ Ajan konumu doğru tahmin etti ve kazandı!', '🕶️ The spy guessed the location and wins!') : l(`🎉 Grup kazandı! Doğru konum: ${locationName}`, `🎉 The group wins! The location was: ${locationName}`)); setPhase('finished'); }} style={styles.player}><Text style={styles.playerText}>{language === 'tr' ? choice.tr : choice.en}</Text></TouchableOpacity>)}</View></View>;

  return <View style={styles.card}><Text style={styles.eyebrow}>{l('OYUN BİTTİ', 'GAME OVER')}</Text><Text style={styles.winner}>{result}</Text>{button(l('Sonucu kaydet ve yeni oyun', 'Save result and new game'), saveAndReset)}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 14, borderWidth: 1, borderColor: Colors.borderGlass }, eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 }, title: { color: Colors.textPrimary, fontSize: 23, fontWeight: '800', textAlign: 'center' }, note: { color: Colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' }, picker: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22 }, circle: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.bgDeep, alignItems: 'center', justifyContent: 'center' }, circleText: { color: Colors.textPrimary, fontSize: 27, fontWeight: '800' }, value: { color: Colors.accentGold, fontSize: 42, fontWeight: '900' }, button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center' }, secondary: { backgroundColor: '#484288' }, buttonText: { color: Colors.white, fontWeight: '700' }, secret: { minHeight: 175, justifyContent: 'center', alignItems: 'center', gap: 9, backgroundColor: Colors.bgDeep, borderRadius: 16, padding: 20 }, secretEmoji: { fontSize: 50 }, players: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }, player: { backgroundColor: 'rgba(99,102,241,0.20)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 }, playerText: { color: Colors.textPrimary, fontWeight: '700' }, winner: { color: Colors.accentGold, fontSize: 24, fontWeight: '900', textAlign: 'center', lineHeight: 34 },
});
