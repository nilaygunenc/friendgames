import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch } from 'react-native';
import { Text, TextInput, TouchableOpacity, View } from '../ui';
import { buildRoleDeck } from '../utils/gameEngine';
import { VampirRole } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type Phase = 'setup' | 'deal' | 'vampire' | 'doctor' | 'death' | 'vote-decision' | 'vote' | 'finished';

export const VampirEngine: React.FC = () => {
  const groupSize = useAppStore(s => s.groupSize);
  const playerNames = useAppStore(s => s.playerNames);
  const setPlayerNames = useAppStore(s => s.setPlayerNames);
  const recordMatch = useAppStore(s => s.recordMatch);
  const [playerCount, setPlayerCount] = useState(() => Math.max(5, Math.min(20, groupSize)));
  const [names, setNames] = useState(() => Array.from({ length: Math.max(5, Math.min(20, groupSize)) }, (_, i) => playerNames[i] || `Oyuncu ${i + 1}`));
  const [includeDoctor, setIncludeDoctor] = useState(true);
  const [revealRole, setRevealRole] = useState(false);
  const [roles, setRoles] = useState<VampirRole[]>([]);
  const [alive, setAlive] = useState<boolean[]>([]);
  const [dealIndex, setDealIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [turn, setTurn] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [vampireTarget, setVampireTarget] = useState<number | null>(null);
  const [doctorTarget, setDoctorTarget] = useState<number | null>(null);
  const [lastDeath, setLastDeath] = useState<number | null>(null);
  const [deathReason, setDeathReason] = useState<'night' | 'vote'>('night');
  const [voteOrder, setVoteOrder] = useState<number[]>([]);
  const [voteIndex, setVoteIndex] = useState(0);
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({});
  const [voteCandidates, setVoteCandidates] = useState<number[]>([]);
  const [isRunoff, setIsRunoff] = useState(false);
  const [phase, setPhase] = useState<Phase>('setup');

  const name = (index: number) => names[index]?.trim() || `Oyuncu ${index + 1}`;
  const survivors = alive.filter(Boolean).length;
  const current = order[turn];
  const currentRole = current === undefined ? undefined : roles[current];
  const currentIsVampire = currentRole?.colorKey === 'vampir';
  const currentIsDoctor = currentRole?.colorKey === 'doktor';
  const candidates = alive.map((isAlive, index) => isAlive && (phase === 'doctor' || index !== current) ? index : -1).filter(index => index >= 0);
  const roleName = (role?: VampirRole) => role?.colorKey === 'vampir' ? 'Vampir' : role?.colorKey === 'koylu' ? 'Köylü' : role?.name || '';

  const startPass = (next: 'vampire' | 'doctor') => {
    setOrder(alive.map((isAlive, index) => isAlive ? index : -1).filter(index => index >= 0));
    setTurn(0); setSeconds(10); setPhase(next);
  };
  const resolveNight = (target: number | null = vampireTarget, saved: number | null = doctorTarget) => {
    if (target === null || target === saved) { setLastDeath(null); setDeathReason('night'); setPhase('death'); return; }
    setAlive(old => old.map((value, index) => index === target ? false : value));
    setLastDeath(target); setDeathReason('night'); setPhase('death');
  };
  const nextTurn = (kind: 'vampire' | 'doctor', selected?: number) => {
    if (kind === 'vampire' && selected !== undefined) setVampireTarget(selected);
    if (kind === 'doctor' && selected !== undefined) setDoctorTarget(selected);
    if (turn + 1 < order.length) { setTurn(value => value + 1); setSeconds(10); return; }
    const target = kind === 'vampire' ? (selected ?? vampireTarget) : vampireTarget;
    const saved = kind === 'doctor' ? (selected ?? doctorTarget) : null;
    if (kind === 'vampire' && includeDoctor) { setDoctorTarget(null); startPass('doctor'); }
    else resolveNight(target, saved);
  };
  useEffect(() => {
    if (phase !== 'vampire' && phase !== 'doctor') return;
    if (seconds <= 0) { nextTurn(phase); return; }
    const timer = setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, seconds, turn]);

  const startGame = () => {
    const savedNames = names.slice(0, playerCount).map((value, index) => value.trim() || `Oyuncu ${index + 1}`);
    setPlayerNames(savedNames); setNames(savedNames);
    setRoles(buildRoleDeck(playerCount, { includeDoctor })); setAlive(Array(playerCount).fill(true));
    setDealIndex(0); setShowRole(false); setLastDeath(null); setVampireTarget(null); setDoctorTarget(null); setPhase('deal');
  };
  const startNight = () => { setVampireTarget(null); setDoctorTarget(null); startPass('vampire'); };
  const beginVote = (candidates = alive.map((isAlive, index) => isAlive ? index : -1).filter(index => index >= 0), runoff = false) => {
    setVoteOrder(alive.map((isAlive, index) => isAlive ? index : -1).filter(index => index >= 0));
    setVoteCandidates(candidates); setVoteCounts({}); setVoteIndex(0); setIsRunoff(runoff); setPhase('vote');
  };
  const castVote = (target: number) => {
    const nextCounts = { ...voteCounts, [target]: (voteCounts[target] || 0) + 1 };
    if (voteIndex + 1 < voteOrder.length) { setVoteCounts(nextCounts); setVoteIndex(index => index + 1); return; }
    const highest = Math.max(...voteCandidates.map(candidate => nextCounts[candidate] || 0));
    const leaders = voteCandidates.filter(candidate => (nextCounts[candidate] || 0) === highest);
    if (leaders.length > 1) { beginVote(leaders, true); return; }
    const eliminated = leaders[0];
    setAlive(old => old.map((value, index) => index === eliminated ? false : value));
    setLastDeath(eliminated); setDeathReason('vote'); setPhase('death');
  };
  const afterDeath = () => { if (survivors <= 3) setPhase('finished'); else setPhase('vote-decision'); };
  const finish = () => { const vampireAlive = roles.some((role, index) => role.colorKey === 'vampir' && alive[index]); recordMatch({ gameId: 'vampir-koylu', gameName: 'Vampir-Köylü', participants: names.slice(0, playerCount).map((_, index) => name(index)), winner: vampireAlive ? 'Vampirler' : 'Köylüler' }); setPhase('setup'); };
  const button = (label: string, onPress: () => void, secondary = false) => <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.secondary]}><Text style={styles.buttonText}>{label}</Text></TouchableOpacity>;
  const setCount = (value: number) => { const count = Math.max(5, Math.min(20, value)); setPlayerCount(count); setNames(old => Array.from({ length: count }, (_, index) => old[index] || playerNames[index] || `Oyuncu ${index + 1}`)); };

  if (phase === 'setup') return <View style={styles.card}>
    <Text style={styles.eyebrow}>🧛 VAMPİR-KÖYLÜ · KURULUM</Text><Text style={styles.title}>Oyuncular ve kurallar</Text>
    <View style={styles.picker}><TouchableOpacity onPress={() => setCount(playerCount - 1)} style={styles.circle}><Text style={styles.circleText}>−</Text></TouchableOpacity><Text style={styles.value}>{playerCount}</Text><TouchableOpacity onPress={() => setCount(playerCount + 1)} style={styles.circle}><Text style={styles.circleText}>+</Text></TouchableOpacity></View>
    <Text style={styles.label}>OYUNCU İSİMLERİ</Text>{names.slice(0, playerCount).map((value, index) => <TextInput key={index} value={value} onChangeText={text => setNames(old => old.map((item, i) => i === index ? text : item))} placeholder={`Oyuncu ${index + 1}`} placeholderTextColor={Colors.textMuted} style={styles.input} />)}
    <View style={styles.option}><View style={styles.optionText}><Text style={styles.optionTitle}>Doktor olsun mu?</Text><Text style={styles.note}>Doktor, vampirin seçtiği kişiyi kurtarabilir.</Text></View><Switch value={includeDoctor} onValueChange={setIncludeDoctor} trackColor={{ false: '#64748b', true: Colors.primary }} thumbColor={Colors.white} /></View>
    <View style={styles.option}><View style={styles.optionText}><Text style={styles.optionTitle}>Ölen kişinin rolü görünsün mü?</Text><Text style={styles.note}>Kapalıysa yalnızca kişinin öldüğü yazılır.</Text></View><Switch value={revealRole} onValueChange={setRevealRole} trackColor={{ false: '#64748b', true: Colors.primary }} thumbColor={Colors.white} /></View>
    <Text style={styles.note}>Her gece sonunda grup oylama yapıp yapmayacağına birlikte karar verir. Telefon herkesin elinde 10 saniye dolaşır.</Text>{button('Gizli rolleri dağıt', startGame)}
  </View>;

  if (phase === 'deal') { const role = roles[dealIndex]; return <View style={styles.card}><Text style={styles.eyebrow}>GİZLİ ROL DAĞITIMI · {dealIndex + 1}/{playerCount}</Text><Text style={styles.title}>{name(dealIndex)}</Text><View style={styles.secret}>{showRole ? <><Text style={styles.roleEmoji}>{role.emoji}</Text><Text style={styles.title}>{roleName(role)}</Text><Text style={styles.note}>{role.description}</Text></> : <Text style={styles.note}>Telefonu yalnızca {name(dealIndex)} alsın ve rolünü açsın.</Text>}</View>{button(showRole ? (dealIndex + 1 === playerCount ? 'Rolü gizle · geceyi başlat' : 'Rolü gizle · sonraki oyuncu') : 'Rolümü gör', () => { if (!showRole) setShowRole(true); else if (dealIndex + 1 === playerCount) startNight(); else { setShowRole(false); setDealIndex(index => index + 1); } })}</View>; }

  if (phase === 'vampire' || phase === 'doctor') { const doctorRound = phase === 'doctor'; const active = doctorRound ? currentIsDoctor : currentIsVampire; return <View style={styles.card}><Text style={styles.eyebrow}>{doctorRound ? '👨‍⚕️ DOKTOR TURU' : '🌙 VAMPİR TURU'} · {turn + 1}/{order.length}</Text><Text style={styles.timer}>{seconds}</Text><Text style={styles.title}>{name(current)}</Text>{active ? <><Text style={styles.activeRole}>{doctorRound ? '👨‍⚕️ Sen Doktorsun' : '🧛 Sen Vampirsin'}</Text><Text style={styles.note}>{doctorRound ? '10 saniye içinde korumak istediğin kişiyi seç. Vampirin hedefiyle aynı kişiyi seçersen kimse ölmez.' : 'Kendini belli etmeden bir hedef seç. Telefon sonraki oyuncuya geçince ekran değişir.'}</Text><View style={styles.players}>{candidates.map(target => <TouchableOpacity key={target} onPress={() => nextTurn(doctorRound ? 'doctor' : 'vampire', target)} style={styles.player}><Text style={styles.playerText}>{name(target)}</Text></TouchableOpacity>)}</View></> : <><Text style={styles.note}>Bu turda rolün için işlem yok. Süre bitince telefonu sessizce sıradaki kişiye ver; herkesin eşit süresi olması gizli rolleri korur.</Text><Text style={styles.wait}>🤫 Bekle ve telefonu dolaştır</Text></>}</View>; }

  if (phase === 'death') { const deathRole = lastDeath === null ? undefined : roles[lastDeath]; return <View style={styles.card}><Text style={styles.eyebrow}>{deathReason === 'night' ? 'GECE SONUCU' : 'OYLAMA SONUCU'}</Text>{lastDeath === null ? <><Text style={styles.title}>Bu gece kimse ölmedi.</Text><Text style={styles.note}>{includeDoctor ? 'Doktor doğru kişiyi korumuş olabilir.' : 'Vampir hedef seçmemiş olabilir.'}</Text></> : <><Text style={styles.death}>💀</Text><Text style={styles.title}>{name(lastDeath)} öldü.</Text>{revealRole ? <Text style={styles.reveal}>Rolü: {roleName(deathRole)}</Text> : <Text style={styles.note}>Rolü açıklanmaz.</Text>}<Text style={styles.note}>Kalan oyuncular: {survivors}</Text></>}{button(survivors <= 3 ? 'Oyunun sonucunu gör' : 'Oylama kararına geç', afterDeath)}</View>; }

  if (phase === 'vote-decision') return <View style={styles.card}><Text style={styles.eyebrow}>GECE BİTTİ</Text><Text style={styles.title}>Bu gece oylama yapılsın mı?</Text><Text style={styles.note}>Telefonu ortaya koyun, grupça konuşun ve birlikte karar verin.</Text><View style={styles.choiceRow}>{button('Evet · oylama yapalım', () => beginVote())}{button('Hayır · yeni geceye geçelim', startNight, true)}</View></View>;

  if (phase === 'vote') return <View style={styles.card}><Text style={styles.eyebrow}>{isRunoff ? '🔁 EŞİTLİK OYLAMASI' : '☀️ GÜNDÜZ OYLAMASI'} · {voteIndex + 1}/{voteOrder.length}</Text><Text style={styles.title}>{name(voteOrder[voteIndex])}, oyun kime?</Text><Text style={styles.note}>{isRunoff ? 'Oylar eşit çıktı. Yalnızca eşit oy alan adaylar arasında yeniden oy ver.' : 'Telefonu yalnızca sıradaki oyuncu alsın ve istediği adaya gizlice oy versin.'}</Text><View style={styles.players}>{voteCandidates.map(index => <TouchableOpacity key={index} onPress={() => castVote(index)} style={styles.player}><Text style={styles.playerText}>{name(index)}</Text></TouchableOpacity>)}</View></View>;

  return <View style={styles.card}><Text style={styles.eyebrow}>OYUN TAMAMLANDI</Text><Text style={styles.title}>3 kişi kaldı</Text><Text style={styles.note}>Aynı oyuncu grubu ve kurallarla yeniden oynayabilir veya sonucu geçmişe kaydedebilirsin.</Text>{button('Aynı grupla yeni oyun', startGame)}{button('Sonucu kaydet ve kurulum ekranına dön', finish, true)}</View>;
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 14, borderWidth: 1, borderColor: Colors.borderGlass }, eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 }, title: { color: Colors.textPrimary, fontSize: 23, fontWeight: '800', textAlign: 'center' }, note: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, textAlign: 'center' }, label: { color: Colors.textMuted, fontWeight: '800', fontSize: 11, letterSpacing: 1, marginTop: 4 }, picker: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22 }, circle: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.bgDeep, alignItems: 'center', justifyContent: 'center' }, circleText: { color: Colors.textPrimary, fontSize: 27, fontWeight: '800' }, value: { color: Colors.accentGold, fontSize: 42, fontWeight: '900' }, input: { color: Colors.textPrimary, backgroundColor: Colors.bgDeep, borderWidth: 1, borderColor: Colors.borderGlass, borderRadius: 11, padding: 11 }, option: { backgroundColor: Colors.bgDeep, padding: 13, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 10 }, optionText: { flex: 1 }, optionTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 14, marginBottom: 3 }, button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center', flex: 1 }, secondary: { backgroundColor: '#484288' }, buttonText: { color: Colors.white, fontWeight: '700', textAlign: 'center' }, secret: { minHeight: 165, justifyContent: 'center', alignItems: 'center', gap: 9, backgroundColor: Colors.bgDeep, borderRadius: 16, padding: 20 }, roleEmoji: { fontSize: 50 }, timer: { color: Colors.accentGold, fontSize: 74, fontWeight: '900', textAlign: 'center', lineHeight: 78 }, activeRole: { color: Colors.accentRed, fontSize: 21, fontWeight: '900', textAlign: 'center' }, wait: { color: Colors.primary, fontSize: 16, fontWeight: '800', textAlign: 'center' }, players: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }, player: { backgroundColor: 'rgba(99,102,241,0.20)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 }, playerText: { color: Colors.textPrimary, fontWeight: '700' }, death: { fontSize: 54, textAlign: 'center' }, reveal: { color: Colors.accentGold, fontSize: 17, fontWeight: '800', textAlign: 'center' }, choiceRow: { flexDirection: 'row', gap: 9 },
});
