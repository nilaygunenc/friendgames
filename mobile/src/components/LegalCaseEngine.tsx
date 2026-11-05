import React, { useMemo, useState } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from '../ui';
import { legalCases } from '../data/legalCases';
import { shuffleArray } from '../utils/gameEngine';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type Phase = 'intro' | 'incident' | 'deliberate' | 'evidence' | 'outcome';

export function LegalCaseEngine() {
  const language = useAppStore(s => s.language);
  const [deck, setDeck] = useState(() => shuffleArray(legalCases));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const l = (tr: string, en: string) => language === 'tr' ? tr : en;
  const card = deck[index];
  const text = card[language];
  const next = () => {
    if (index + 1 === deck.length) {
      setDeck(shuffleArray(legalCases));
      setIndex(0);
    } else setIndex(i => i + 1);
    setPhase('intro');
  };
  const button = (label: string, onPress: () => void, secondary = false) => (
    <TouchableOpacity accessibilityRole="button" onPress={onPress}
      style={[styles.button, secondary && styles.secondary]}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{l('⚖️ GERÇEK DOSYALAR', '⚖️ REAL CASE FILES')}</Text>
      <Text style={styles.progress}>{index + 1}/{legalCases.length}</Text>
    </View>
    <Text style={styles.number}>{text.number} · {text.category}</Text>
    <Text style={styles.title}>{text.title}</Text>
    {phase === 'intro' && <>
      <Text style={styles.body}>{l('Bu kart, resmî ve açık kaynaklı bir kararın oyun için anonimleştirilmiş özetidir. Olayın ilk bölümünü okuyup ilk kararınızı verin.', 'This card is an anonymised game summary of an official, public decision. Read the first part and make your initial judgment.')}</Text>
      {button(l('Dosyayı aç', 'Open case file'), () => setPhase('incident'))}
    </>}
    {phase !== 'intro' && <>
      <Text style={styles.section}>{l('OLAY', 'INCIDENT')}</Text>
      <Text style={styles.body}>{text.incident}</Text>
    </>}
    {phase === 'incident' && <>
      <Text style={styles.question}>{text.question}</Text>
      {button(l('İlk görüşleri tartışın', 'Discuss first views'), () => setPhase('deliberate'))}
    </>}
    {phase === 'deliberate' && <>
      <Text style={styles.section}>{l('İKİ FARKLI GÖRÜŞ', 'TWO POSSIBLE VIEWS')}</Text>
      {text.views.map((view, i) => <View key={view} style={styles.view}><Text style={styles.viewNumber}>{i + 1}</Text><Text style={styles.viewText}>{view}</Text></View>)}
      <Text style={styles.note}>{l('Herkes ilk kararını söylesin. Sonra yeni delili açın; fikrini değiştirmek serbest.', 'Let everyone state their first view. Then open the new evidence; changing your mind is allowed.')}</Text>
      {button(l('🔓 Yeni delil açılıyor', '🔓 New evidence is revealed'), () => setPhase('evidence'))}
    </>}
    {phase === 'evidence' && <>
      <View style={styles.evidence}><Text style={styles.section}>{l('YENİ DELİL', 'NEW EVIDENCE')}</Text><Text style={styles.body}>{text.evidence}</Text></View>
      <Text style={styles.note}>{l('Herkes kararını yeniden değerlendirsin. Bu ayrıntı sonucu değiştirdi mi?', 'Everyone should reassess. Did this detail change the outcome?')}</Text>
      {button(l('Hukuki sonucu aç', 'Reveal legal outcome'), () => setPhase('outcome'))}
    </>}
    {phase === 'outcome' && <>
      <View style={styles.outcome}><Text style={styles.section}>{l('HUKUKİ SONUÇ', 'LEGAL OUTCOME')}</Text><Text style={styles.body}>{text.outcome}</Text></View>
      <Text style={styles.section}>{l('TARTIŞMANIN PÜF NOKTASI', 'KEY DISCUSSION POINT')}</Text>
      <Text style={styles.body}>{text.takeaway}</Text>
      <TouchableOpacity accessibilityRole="link" onPress={() => { void Linking.openURL(card.source.url); }} style={styles.source}>
        <Text style={styles.sourceText}>{l('Kaynağı aç: ', 'Open source: ')}{card.source.label}</Text>
      </TouchableOpacity>
      <Text style={styles.disclaimer}>{l('Oyun özeti hukukî tavsiye değildir. Tam karar ve güncel mevzuat için resmî kaynağı inceleyin.', 'This game summary is not legal advice. Check the official source for the full decision and current law.')}</Text>
      {button(index === deck.length - 1 ? l('Desteyi yeniden karıştır', 'Shuffle deck again') : l('Sonraki gerçek dosya', 'Next real case file'), next)}
    </>}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 14, borderWidth: 1, borderColor: Colors.borderGlass },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: .8, flex: 1 },
  progress: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  number: { color: Colors.accentGold, fontSize: 13, fontWeight: '700' },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800' },
  section: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: .8 },
  body: { color: Colors.textPrimary, fontSize: 16, lineHeight: 25 },
  question: { color: Colors.textPrimary, fontSize: 18, lineHeight: 27, fontWeight: '800', backgroundColor: 'rgba(99,102,241,0.16)', padding: 16, borderRadius: 14 },
  view: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  viewNumber: { color: Colors.white, backgroundColor: Colors.primary, width: 22, height: 22, borderRadius: 11, textAlign: 'center', lineHeight: 22, fontWeight: '700' },
  viewText: { color: Colors.textPrimary, flex: 1, fontSize: 15, lineHeight: 23 },
  note: { color: Colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  evidence: { backgroundColor: 'rgba(245,158,11,0.12)', padding: 16, borderRadius: 14, gap: 9 },
  outcome: { backgroundColor: 'rgba(16,185,129,0.11)', padding: 16, borderRadius: 14, gap: 9 },
  source: { padding: 12, borderRadius: 12, backgroundColor: Colors.bgDeep },
  sourceText: { color: '#a5b4fc', fontSize: 13, lineHeight: 19, fontWeight: '600' },
  disclaimer: { color: Colors.textMuted, fontSize: 12, lineHeight: 18 },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center' },
  secondary: { backgroundColor: '#484288' },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 14, textAlign: 'center' },
});
