import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from '../ui';
import { shuffleArray } from '../utils/gameEngine';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type Role = 'mafia' | 'citizen';
type Phase = 'setup' | 'deal' | 'night' | 'day' | 'finished';

export function MafiaLiteEngine() {
  const groupSize = useAppStore(s => s.groupSize);
  const language = useAppStore(s => s.language);
  const playerNames = useAppStore(s => s.playerNames);
  const recordMatch = useAppStore(s => s.recordMatch);
  const [playerCount, setPlayerCount] = useState(() => Math.max(5, Math.min(15, groupSize)));
  const [roles, setRoles] = useState<Role[]>([]);
  const [alive, setAlive] = useState<boolean[]>([]);
  const [reveal, setReveal] = useState(false);
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>('setup');
  const [message, setMessage] = useState('');
  const l = (tr: string, en: string) => language === 'tr' ? tr : en;
  const player = (index: number) => playerNames[index] || l(`Oyuncu ${index + 1}`, `Player ${index + 1}`);

  const winner = useMemo(() => {
    if (!roles.length) return null;
    const mafia = roles.filter((role, index) => alive[index] && role === 'mafia').length;
    const citizens = alive.filter((isAlive, index) => isAlive && roles[index] === 'citizen').length;
    if (mafia === 0) return 'citizens';
    if (mafia >= citizens) return 'mafia';
    return null;
  }, [alive, roles]);

  const start = () => {
    const mafiaCount = Math.max(1, Math.floor(playerCount / 4));
    setRoles(shuffleArray(Array.from({ length: playerCount }, (_, i) => i < mafiaCount ? 'mafia' : 'citizen')));
    setAlive(Array(playerCount).fill(true));
    setCurrent(0); setReveal(false); setMessage(''); setPhase('deal');
  };
  const nextRole = () => {
    if (reveal) {
      setReveal(false);
      if (current + 1 === playerCount) setPhase('night'); else setCurrent(c => c + 1);
    } else setReveal(true);
  };
  const eliminate = (index: number, reason: 'night' | 'day') => {
    setAlive(old => old.map((value, i) => i === index ? false : value));
    setMessage(l(`${player(index)} oyundan çıktı. Rolü: ${roles[index] === 'mafia' ? 'Mafya' : 'Vatandaş'}.`, `${player(index)} is out. Role: ${roles[index] === 'mafia' ? 'Mafia' : 'Citizen'}.`));
    const remainingMafia = roles.filter((role, i) => i !== index && alive[i] && role === 'mafia').length;
    const remainingCitizens = alive.filter((value, i) => i !== index && value && roles[i] === 'citizen').length;
    if (remainingMafia === 0 || remainingMafia >= remainingCitizens) setPhase('finished');
    else setPhase(reason === 'night' ? 'day' : 'night');
  };
  const reset = () => { setRoles([]); setAlive([]); setCurrent(0); setReveal(false); setMessage(''); setPhase('setup'); };
  const saveAndReset = () => { recordMatch({ gameId: 'mafya-lite', gameName: 'Mafya Lite', participants: Array.from({ length: playerCount }, (_, i) => player(i)), winner: winner === 'mafia' ? l('Mafya Takımı', 'Mafia Team') : l('Vatandaş Takımı', 'Citizen Team') }); reset(); };
  const button = (label: string, onPress: () => void, secondary = false) => <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.secondary]}><Text style={styles.buttonText}>{label}</Text></TouchableOpacity>;

  if (phase === 'setup') return <View style={styles.card}>
    <Text style={styles.eyebrow}>{l('🕵️ MAFYA LITE', '🕵️ MAFIA LITE')}</Text>
    <Text style={styles.title}>{l('Oyuncu sayısı', 'Player count')}</Text>
    <View style={styles.picker}><TouchableOpacity onPress={() => setPlayerCount(n => Math.max(5, n - 1))} style={styles.circle}><Text style={styles.circleText}>−</Text></TouchableOpacity><Text style={styles.value}>{playerCount}</Text><TouchableOpacity onPress={() => setPlayerCount(n => Math.min(15, n + 1))} style={styles.circle}><Text style={styles.circleText}>+</Text></TouchableOpacity></View>
    <Text style={styles.note}>{l('Roller gizlice dağıtılır. Gece mafya bir kişiyi seçer; gündüz grup oylama yapar.', 'Roles are dealt secretly. Mafia chooses at night; the group votes during the day.')}</Text>
    {button(l('Rolleri dağıt', 'Deal roles'), start)}
  </View>;

  if (phase === 'deal') return <View style={styles.card}>
    <Text style={styles.eyebrow}>{l('GİZLİ ROL DAĞITIMI', 'SECRET ROLE DEAL')}</Text><Text style={styles.title}>{player(current)}</Text>
    <View style={styles.roleCard}>{reveal ? <><Text style={styles.roleEmoji}>{roles[current] === 'mafia' ? '🕶️' : '🧑‍🤝‍🧑'}</Text><Text style={styles.title}>{roles[current] === 'mafia' ? l('MAFYA', 'MAFIA') : l('VATANDAŞ', 'CITIZEN')}</Text><Text style={styles.note}>{roles[current] === 'mafia' ? l('Geceleri ortak karar ver; kimliğini sakla.', 'Choose together at night; keep your identity secret.') : l('Gündüz mafyayı bulmak için tartış ve oy ver.', 'Discuss and vote to find the mafia during the day.')}</Text></> : <Text style={styles.note}>{l('Telefonu yalnızca bu oyuncu alsın ve rolünü açsın.', 'Only this player takes the phone and reveals their role.')}</Text>}</View>
    {button(reveal ? (current + 1 === playerCount ? l('Gizle ve geceyi başlat', 'Hide and start night') : l('Gizle ve sonraki oyuncu', 'Hide and next player')) : l('Rolümü gör', 'View my role'), nextRole)}
  </View>;

  if (phase === 'finished') return <View style={styles.card}><Text style={styles.eyebrow}>{l('OYUN BİTTİ', 'GAME OVER')}</Text><Text style={styles.winner}>{winner === 'mafia' ? l('🕶️ Mafya kazandı!', '🕶️ Mafia wins!') : l('🏘️ Vatandaşlar kazandı!', '🏘️ Citizens win!')}</Text><Text style={styles.note}>{message}</Text>{button(l('Sonucu kaydet ve yeni oyun', 'Save result and new game'), saveAndReset)}</View>;

  const isNight = phase === 'night';
  return <View style={styles.card}>
    <Text style={styles.eyebrow}>{isNight ? l('🌙 GECE', '🌙 NIGHT') : l('☀️ GÜNDÜZ', '☀️ DAY')}</Text>
    <Text style={styles.title}>{isNight ? l('Mafya gizlice bir kişiyi seçsin', 'Mafia secretly chooses a player') : l('Tartışın ve bir kişiyi oylayın', 'Discuss and vote for a player')}</Text>
    <Text style={styles.note}>{isNight ? l('Telefonu moderatör tutsun. Mafyanın seçtiği oyuncuya dokunun.', 'The moderator holds the phone. Tap the player chosen by mafia.') : l('Herkes oyunu verdikten sonra elenecek oyuncuya dokunun.', 'After everyone votes, tap the player to eliminate.')}</Text>
    <View style={styles.players}>{alive.map((isAlive, index) => isAlive && <TouchableOpacity key={index} onPress={() => eliminate(index, isNight ? 'night' : 'day')} style={styles.player}><Text style={styles.playerText}>{player(index)}</Text></TouchableOpacity>)}</View>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 14, borderWidth: 1, borderColor: Colors.borderGlass }, eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 }, title: { color: Colors.textPrimary, fontSize: 23, fontWeight: '800', textAlign: 'center' }, note: { color: Colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' }, picker: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22 }, circle: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.bgDeep, alignItems: 'center', justifyContent: 'center' }, circleText: { color: Colors.textPrimary, fontSize: 27, fontWeight: '800' }, value: { color: Colors.accentGold, fontSize: 42, fontWeight: '900' }, button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center' }, secondary: { backgroundColor: '#484288' }, buttonText: { color: Colors.white, fontWeight: '700' }, roleCard: { minHeight: 170, justifyContent: 'center', alignItems: 'center', gap: 9, backgroundColor: Colors.bgDeep, borderRadius: 16, padding: 20 }, roleEmoji: { fontSize: 50 }, players: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }, player: { backgroundColor: 'rgba(99,102,241,0.20)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 }, playerText: { color: Colors.textPrimary, fontWeight: '700' }, message: { color: Colors.accentGold, textAlign: 'center', fontWeight: '700' }, winner: { color: Colors.accentGold, fontSize: 25, fontWeight: '900', textAlign: 'center' },
});
