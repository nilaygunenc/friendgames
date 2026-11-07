import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Switch } from 'react-native';
import { Text, TextInput, TouchableOpacity, View } from '../ui';
import { buildRoleDeck } from '../utils/gameEngine';
import { VampirRole } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type VoteMode = 'secret' | 'open';
type Phase = 'setup' | 'role-handoff' | 'role-reveal' | 'intro-handoff' | 'intro-active' | 'night-ready' | 'night-handoff' | 'night-active' | 'night-result' | 'day-ready' | 'secret-vote-handoff' | 'secret-vote' | 'open-countdown' | 'open-select' | 'finished';

const PASS_SECONDS = 10;
const MIN_ACTION_SECONDS = 8;

export function VampirEngine() {
  const groupSize = useAppStore(s => s.groupSize);
  const storedNames = useAppStore(s => s.playerNames);
  const setPlayerNames = useAppStore(s => s.setPlayerNames);
  const recordMatch = useAppStore(s => s.recordMatch);
  const [count, setCount] = useState(() => Math.max(5, Math.min(20, groupSize)));
  const [names, setNames] = useState(() => Array.from({ length: Math.max(5, Math.min(20, groupSize)) }, (_, i) => storedNames[i] || `Oyuncu ${i + 1}`));
  const [doctorEnabled, setDoctorEnabled] = useState(true);
  const [revealDeadRole, setRevealDeadRole] = useState(false);
  const [voteMode, setVoteMode] = useState<VoteMode>('secret');
  const [roles, setRoles] = useState<VampirRole[]>([]);
  const [alive, setAlive] = useState<boolean[]>([]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [introIndex, setIntroIndex] = useState(0);
  const [nightOrder, setNightOrder] = useState<number[]>([]);
  const [nightIndex, setNightIndex] = useState(0);
  const [seconds, setSeconds] = useState(PASS_SECONDS);
  const [vampireTarget, setVampireTarget] = useState<number | null>(null);
  const [doctorTarget, setDoctorTarget] = useState<number | null>(null);
  const [lastDoctorSelfSave, setLastDoctorSelfSave] = useState(false);
  const [nightMessage, setNightMessage] = useState('');
  const [lastEliminated, setLastEliminated] = useState<number | null>(null);
  const [resultSource, setResultSource] = useState<'night' | 'vote'>('night');
  const [voteOrder, setVoteOrder] = useState<number[]>([]);
  const [voteIndex, setVoteIndex] = useState(0);
  const [voteCandidates, setVoteCandidates] = useState<number[]>([]);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [runoff, setRunoff] = useState(false);
  const [openCountdown, setOpenCountdown] = useState(3);
  const [phase, setPhase] = useState<Phase>('setup');

  const name = (i: number) => names[i]?.trim() || `Oyuncu ${i + 1}`;
  const survivors = alive.map((isAlive, index) => isAlive ? index : -1).filter(i => i >= 0);
  const activePlayer = nightOrder[nightIndex];
  const activeRole = activePlayer === undefined ? undefined : roles[activePlayer];
  const isVampire = activeRole?.colorKey === 'vampir';
  const isDoctor = activeRole?.colorKey === 'doktor';
  const vampireIndices = roles.map((role, index) => role.colorKey === 'vampir' ? index : -1).filter(index => index >= 0);
  const vampireAllies = activePlayer === undefined ? [] : vampireIndices.filter(index => index !== activePlayer);
  const secretCandidates = survivors.filter(i => !vampireIndices.includes(i));
  const doctorCandidates = survivors.filter(i => !(i === activePlayer && lastDoctorSelfSave));
  const roleLabel = (role?: VampirRole) => role?.colorKey === 'vampir' ? 'Vampir' : role?.colorKey === 'koylu' ? 'Köylü' : role?.name || '';
  const winner = useMemo(() => {
    if (!roles.length) return null;
    const vampires = roles.filter((r, i) => alive[i] && r.colorKey === 'vampir').length;
    const villagers = survivors.length - vampires;
    if (vampires === 0) return 'Köylüler';
    if (vampires >= villagers) return 'Vampirler';
    return null;
  }, [alive, roles, survivors.length]);

  useEffect(() => {
    if (phase !== 'role-reveal' && phase !== 'night-active') return;
    if (seconds <= 0) {
      if (phase === 'role-reveal') {
        if (roleIndex + 1 === count) { setIntroIndex(0); setPhase('intro-handoff'); }
        else { setRoleIndex(i => i + 1); setPhase('role-handoff'); }
      } else finishNightTurn();
      return;
    }
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, seconds, roleIndex, count, nightIndex]);

  useEffect(() => {
    if (phase !== 'intro-active') return;
    if (seconds <= 0) {
      if (introIndex + 1 === count) setPhase('night-ready');
      else { setIntroIndex(i => i + 1); setPhase('intro-handoff'); }
      return;
    }
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, seconds, introIndex, count]);

  useEffect(() => {
    if (phase !== 'open-countdown') return;
    if (openCountdown <= 0) { setPhase('open-select'); return; }
    const timer = setTimeout(() => setOpenCountdown(s => s - 1), 900);
    return () => clearTimeout(timer);
  }, [phase, openCountdown]);

  const startGame = () => {
    const clean = names.slice(0, count).map((value, i) => value.trim() || `Oyuncu ${i + 1}`);
    setNames(clean); setPlayerNames(clean); setRoles(buildRoleDeck(count, { includeDoctor: doctorEnabled }));
    setAlive(Array(count).fill(true)); setRoleIndex(0); setVampireTarget(null); setDoctorTarget(null); setLastDoctorSelfSave(false); setLastEliminated(null); setPhase('role-handoff');
  };
  const startNight = () => {
    setNightOrder(survivors); setNightIndex(0); setVampireTarget(null); setDoctorTarget(null); setNightMessage(''); setPhase('night-handoff');
  };
  const finishNightTurn = () => {
    if (nightIndex + 1 < nightOrder.length) { setNightIndex(i => i + 1); setPhase('night-handoff'); return; }
    const saved = doctorEnabled && vampireTarget !== null && vampireTarget === doctorTarget;
    if (doctorEnabled) setLastDoctorSelfSave(doctorTarget !== null && doctorTarget === roles.findIndex(r => r.colorKey === 'doktor'));
    if (vampireTarget === null || saved) { setResultSource('night'); setNightMessage(saved ? 'Doktor doğru kişiyi korudu. Bu gece kimse ölmedi.' : 'Bu gece kimse ölmedi.'); setLastEliminated(null); setPhase('night-result'); return; }
    setResultSource('night'); setAlive(old => old.map((value, i) => i === vampireTarget ? false : value)); setLastEliminated(vampireTarget); setNightMessage(`${name(vampireTarget)} öldü.`); setPhase('night-result');
  };
  const selectNightTarget = (target: number) => {
    if (isVampire) setVampireTarget(target);
    if (isDoctor) setDoctorTarget(target);
  };
  const startSecretVote = (candidates = survivors, isRunoff = false) => { setVoteOrder(survivors); setVoteCandidates(candidates); setVotes({}); setVoteIndex(0); setRunoff(isRunoff); setPhase('secret-vote-handoff'); };
  const castVote = (target: number) => {
    const next = { ...votes, [target]: (votes[target] || 0) + 1 };
    if (voteIndex + 1 < voteOrder.length) { setVotes(next); setVoteIndex(i => i + 1); setPhase('secret-vote-handoff'); return; }
    const best = Math.max(...voteCandidates.map(i => next[i] || 0));
    const leaders = voteCandidates.filter(i => (next[i] || 0) === best);
    if (leaders.length > 1) { startSecretVote(leaders, true); return; }
    eliminate(leaders[0]);
  };
  const eliminate = (target: number) => { setResultSource('vote'); setAlive(old => old.map((value, i) => i === target ? false : value)); setLastEliminated(target); setNightMessage(`${name(target)} elendi.`); setPhase('night-result'); };
  const afterResult = () => { if (winner) setPhase('finished'); else setPhase(resultSource === 'vote' ? 'night-ready' : 'day-ready'); };
  const saveResult = () => { recordMatch({ gameId: 'vampir-koylu', gameName: 'Vampir-Köylü', participants: Array.from({ length: count }, (_, i) => name(i)), winner: winner || '' }); setPhase('setup'); };
  const button = (label: string, action: () => void, secondary = false) => <TouchableOpacity onPress={action} style={[styles.button, secondary && styles.secondary]}><Text style={styles.buttonText}>{label}</Text></TouchableOpacity>;
  const adjustCount = (next: number) => { const value = Math.max(5, Math.min(20, next)); setCount(value); setNames(old => Array.from({ length: value }, (_, i) => old[i] || storedNames[i] || `Oyuncu ${i + 1}`)); };

  if (phase === 'setup') return <View style={styles.card}><Text style={styles.eyebrow}>🧛 VAMPİR-KÖYLÜ · KURULUM</Text><View style={styles.picker}><TouchableOpacity onPress={() => adjustCount(count - 1)} style={styles.circle}><Text style={styles.circleText}>−</Text></TouchableOpacity><Text style={styles.value}>{count}</Text><TouchableOpacity onPress={() => adjustCount(count + 1)} style={styles.circle}><Text style={styles.circleText}>+</Text></TouchableOpacity></View><Text style={styles.label}>OYUNCU İSİMLERİ</Text>{names.slice(0, count).map((value, i) => <TextInput key={i} value={value} onChangeText={text => setNames(old => old.map((item, index) => index === i ? text : item))} placeholder={`Oyuncu ${i + 1}`} placeholderTextColor={Colors.textMuted} style={styles.input} />)}<Option title="Doktor modu" sub="Doktor vampirin hedefini koruyabilir." value={doctorEnabled} onChange={setDoctorEnabled}/><Option title="Ölenin rolünü göster" sub="Kapalıysa yalnızca elendiği duyurulur." value={revealDeadRole} onChange={setRevealDeadRole}/><Text style={styles.label}>GÜNDÜZ OYLAMA MODU</Text><View style={styles.modeRow}>{button(`📱 Gizli ${voteMode === 'secret' ? '✓' : ''}`, () => setVoteMode('secret'), voteMode !== 'secret')}{button(`🗣️ Açık ${voteMode === 'open' ? '✓' : ''}`, () => setVoteMode('open'), voteMode !== 'open')}</View>{button('Gizli rolleri dağıt', startGame)}</View>;

  if (phase === 'role-handoff') return <Handoff title={`Telefonu ${name(roleIndex)}'ye ver.`} sub="Bu ekranda rol bilgisi yoktur. Telefon teslim edilince yalnız bu oyuncu başlatmalıdır." onStart={() => { setSeconds(PASS_SECONDS); setPhase('role-reveal'); }}/>;
  if (phase === 'role-reveal') { const role = roles[roleIndex]; return <View style={styles.card}><Text style={styles.eyebrow}>GİZLİ ROL · {roleIndex + 1}/{count}</Text><Text style={styles.timer}>{seconds}</Text><View style={styles.secret}><Text style={styles.roleEmoji}>{role.emoji}</Text><Text style={styles.title}>{roleLabel(role)}</Text><Text style={styles.note}>{role.description}</Text></View></View>; }
  if (phase === 'intro-handoff') return <Handoff title={`Telefonu ${name(introIndex)}'ye ver.`} sub="Gece 0 tanışma turu. Telefon teslim edildikten sonra yalnız bu oyuncu başlatmalıdır." onStart={() => { setSeconds(7); setPhase('intro-active'); }}/>;
  if (phase === 'intro-active') { const introRole = roles[introIndex]; const introIsVampire = introRole?.colorKey === 'vampir'; const allies = vampireIndices.filter(index => index !== introIndex); return <View style={styles.card}><Text style={styles.eyebrow}>🌙 GECE 0 · {introIndex + 1}/{count}</Text><Text style={styles.timer}>{seconds}</Text><View style={styles.secret}>{introIsVampire ? <><Text style={styles.activeRole}>🧛 SEN BİR VAMPİRSİN!</Text><Text style={styles.note}>Diğer vampirler:</Text>{allies.length ? allies.map(index => <Text key={index} style={styles.ally}>{name(index)}</Text>) : <Text style={styles.note}>Bu oyunda tek vampirsin.</Text>}</> : <><Text style={styles.wait}>🌙 Herkes uyuyor…</Text><Text style={styles.note}>Gece bekleniyor. Süre bitene kadar ekranla ilgileniyor gibi yap.</Text></>}</View></View>; }
  if (phase === 'night-ready') return <View style={styles.card}><Text style={styles.eyebrow}>🌙 GECE ÖNCESİ</Text><Text style={styles.title}>Sohbet edin, sonra geceyi başlatın</Text><Text style={styles.note}>Gece boyunca telefon yalnızca bir kez dolaşır. Her oyuncuda maskeleme için 10 saniye kalır.</Text>{button('Gece turunu başlat', startNight)}</View>;
  if (phase === 'night-handoff') return <Handoff title={`Telefonu ${name(activePlayer)}'ye ver.`} sub="Rol, seçim paneli ve sayaç sadece Hazırım butonuna basıldıktan sonra görünür." onStart={() => { setSeconds(PASS_SECONDS); setPhase('night-active'); }}/>;
  if (phase === 'night-active') return <View style={styles.card}><Text style={styles.eyebrow}>🌙 GECE TURU · {nightIndex + 1}/{nightOrder.length}</Text><Text style={styles.timer}>{seconds}</Text><Text style={styles.title}>{name(activePlayer)}</Text>{isVampire || isDoctor ? <><Text style={styles.activeRole}>{isVampire ? '🧛 Sen Vampirsin' : '👨‍⚕️ Sen Doktorsun'}</Text><Text style={styles.note}>{isVampire ? vampireAllies.length ? `Ortak hedef: ${vampireTarget === null ? 'henüz seçilmedi' : name(vampireTarget)}. Aynı hedefte mutabık kalın veya değiştir.` : 'Bir kurban seç. Seçimin kayıt olur; maskeleme süresi dolana kadar ekran değişmez.' : 'Koruyacağın kişiyi seç. Kendini üst üste iki gece koruyamazsın.'}</Text><View style={styles.players}>{(isVampire ? secretCandidates : doctorCandidates).map(i => <TouchableOpacity key={i} onPress={() => selectNightTarget(i)} style={[styles.player, (isVampire ? vampireTarget : doctorTarget) === i && styles.selected]}><Text style={styles.playerText}>{name(i)}</Text></TouchableOpacity>)}</View>{seconds > MIN_ACTION_SECONDS && (isVampire ? vampireTarget : doctorTarget) !== null ? <Text style={styles.mask}>Seçim kaydedildi · maskeleme sürüyor</Text> : null}</> : <><Text style={styles.wait}>🌙 Geceyi bekliyorsun…</Text><Text style={styles.note}>Süren bitene kadar ekranla ilgileniyor gibi yap. Bu, gizli rolleri maskeler.</Text><View style={styles.fake}><Text style={styles.note}>••• gece devam ediyor •••</Text></View></>}</View>;
  if (phase === 'night-result') { const deadRole = lastEliminated === null ? undefined : roles[lastEliminated]; return <View style={styles.card}><Text style={styles.eyebrow}>{resultSource === 'vote' ? 'OYLAMA SONUCU' : 'GECE SONUCU'}</Text><Text style={styles.title}>{nightMessage}</Text>{lastEliminated !== null && revealDeadRole ? <Text style={styles.reveal}>Rolü: {roleLabel(deadRole)}</Text> : null}{winner ? <><Text style={styles.winner}>{winner} kazandı!</Text>{button('Sonucu kaydet', saveResult)}</> : button(resultSource === 'vote' ? 'Yeni geceye hazırlan' : 'Gündüz tartışmasına geç', afterResult)}</View>; }
  if (phase === 'day-ready') return <View style={styles.card}><Text style={styles.eyebrow}>☀️ GÜNDÜZ TARTIŞMASI</Text><Text style={styles.title}>Herkes fikrini söylesin</Text><Text style={styles.note}>Hazır olduğunuzda {voteMode === 'secret' ? 'gizli oylamayı' : 'açık oylamayı'} başlatın veya yeni geceye geçin.</Text>{button('Oylamayı başlat', () => voteMode === 'secret' ? startSecretVote() : (setOpenCountdown(3), setPhase('open-countdown')))}{button('Oylama yapmadan geceye geç', startNight, true)}</View>;
  if (phase === 'secret-vote-handoff') return <Handoff title={`Telefonu ${name(voteOrder[voteIndex])}'ye ver.`} sub={runoff ? 'Eşitlik turu: yalnız ekrandaki adaylardan birini seç.' : 'Oyunu gizlice ver; seçimin ardından telefon sonraki oyuncuya geçecek.'} onStart={() => setPhase('secret-vote')}/>;
  if (phase === 'secret-vote') return <View style={styles.card}><Text style={styles.eyebrow}>{runoff ? '🔁 EŞİTLİK TURU' : '🗳️ GİZLİ OYLAMA'} · {voteIndex + 1}/{voteOrder.length}</Text><Text style={styles.title}>{name(voteOrder[voteIndex])}, oyun kime?</Text><View style={styles.players}>{voteCandidates.map(i => <TouchableOpacity key={i} onPress={() => castVote(i)} style={styles.player}><Text style={styles.playerText}>{name(i)}</Text></TouchableOpacity>)}</View></View>;
  if (phase === 'open-countdown') return <View style={styles.card}><Text style={styles.eyebrow}>🗣️ AÇIK OYLAMA</Text><Text style={styles.timer}>{openCountdown}</Text><Text style={styles.title}>Herkes aynı anda şüphelendiği kişiyi göstersin!</Text></View>;
  if (phase === 'open-select') return <View style={styles.card}><Text style={styles.eyebrow}>🗣️ AÇIK OYLAMA SONUCU</Text><Text style={styles.title}>Grup kimi eleyecek?</Text><Text style={styles.note}>Herkes gösterdikten sonra ortak kararla bir isme basın.</Text><View style={styles.players}>{survivors.map(i => <TouchableOpacity key={i} onPress={() => eliminate(i)} style={styles.player}><Text style={styles.playerText}>{name(i)}</Text></TouchableOpacity>)}</View></View>;
  return <View style={styles.card}><Text style={styles.winner}>{winner || 'Oyun tamamlandı'}</Text>{button('Sonucu kaydet', saveResult)}</View>;
}

function Handoff({ title, sub, onStart }: { title: string; sub: string; onStart: () => void }) { return <View style={styles.card}><Text style={styles.eyebrow}>GİZLİ GEÇİŞ</Text><Text style={styles.handoff}>📱</Text><Text style={styles.title}>{title}</Text><Text style={styles.note}>{sub}</Text><TouchableOpacity onPress={onStart} style={styles.button}><Text style={styles.buttonText}>Hazırım · sayacı başlat</Text></TouchableOpacity></View>; }
function Option({ title, sub, value, onChange }: { title: string; sub: string; value: boolean; onChange: (value: boolean) => void }) { return <View style={styles.option}><View style={styles.optionText}><Text style={styles.optionTitle}>{title}</Text><Text style={styles.note}>{sub}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{ false: '#64748b', true: Colors.primary }} thumbColor={Colors.white}/></View>; }

const styles = StyleSheet.create({ card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 14, borderWidth: 1, borderColor: Colors.borderGlass }, eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 }, title: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800', textAlign: 'center' }, note: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, textAlign: 'center' }, label: { color: Colors.textMuted, fontWeight: '800', fontSize: 11, letterSpacing: 1 }, picker: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22 }, circle: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.bgDeep, alignItems: 'center', justifyContent: 'center' }, circleText: { color: Colors.textPrimary, fontSize: 27, fontWeight: '800' }, value: { color: Colors.accentGold, fontSize: 42, fontWeight: '900' }, input: { color: Colors.textPrimary, backgroundColor: Colors.bgDeep, borderWidth: 1, borderColor: Colors.borderGlass, borderRadius: 11, padding: 11 }, option: { backgroundColor: Colors.bgDeep, padding: 13, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 10 }, optionText: { flex: 1 }, optionTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 14, marginBottom: 3 }, button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center', flex: 1 }, secondary: { backgroundColor: '#484288' }, buttonText: { color: Colors.white, fontWeight: '700', textAlign: 'center' }, modeRow: { flexDirection: 'row', gap: 8 }, secret: { minHeight: 165, justifyContent: 'center', alignItems: 'center', gap: 9, backgroundColor: Colors.bgDeep, borderRadius: 16, padding: 20 }, roleEmoji: { fontSize: 50 }, timer: { color: Colors.accentGold, fontSize: 74, fontWeight: '900', textAlign: 'center', lineHeight: 78 }, handoff: { fontSize: 58, textAlign: 'center' }, activeRole: { color: Colors.accentRed, fontSize: 21, fontWeight: '900', textAlign: 'center' }, ally: { color: Colors.accentGold, fontSize: 18, fontWeight: '800', textAlign: 'center' }, wait: { color: Colors.primary, fontSize: 21, fontWeight: '900', textAlign: 'center' }, fake: { minHeight: 76, borderRadius: 12, backgroundColor: Colors.bgDeep, alignItems: 'center', justifyContent: 'center' }, players: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }, player: { backgroundColor: 'rgba(99,102,241,0.20)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 }, selected: { borderWidth: 2, borderColor: Colors.accentGold }, playerText: { color: Colors.textPrimary, fontWeight: '700' }, mask: { color: Colors.accentGold, textAlign: 'center', fontWeight: '700' }, reveal: { color: Colors.accentGold, fontSize: 17, fontWeight: '800', textAlign: 'center' }, winner: { color: Colors.accentGold, fontSize: 26, fontWeight: '900', textAlign: 'center' } });
