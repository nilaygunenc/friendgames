import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from '../ui';
import { useAppStore } from '../store/useAppStore';
import { mysteryStories } from '../data/mysteries';
import { Colors } from '../theme';

export function MysteryEngine() {
  const language = useAppStore(s => s.language);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'manager' | 'playing' | 'confirm' | 'done'>('ready');
  const [peek, setPeek] = useState(false);
  const story = mysteryStories[index][language];
  const l = (tr: string, en: string) => language === 'tr' ? tr : en;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        setPeek(false);
        setPhase(p => p === 'manager' ? 'ready' : p);
      }
    });
    return () => subscription.remove();
  }, []);

  const button = (label: string, onPress: () => void, secondary = false) =>
    <TouchableOpacity accessibilityRole="button" onPress={onPress}
      style={[styles.button, secondary && styles.secondary]}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>;
  const next = () => {
    setPeek(false);
    setPhase('ready');
    setIndex(i => (i + 1) % mysteryStories.length);
  };

  return <View style={styles.card}>
    <Text style={styles.eyebrow}>{l('🔎 GİZEMLİ HİKÂYE', '🔎 MYSTERY STORY')}</Text>
    <Text style={styles.muted}>{index + 1} / {mysteryStories.length}</Text>
    <Text style={styles.title}>{story.title}</Text>
    {phase === 'ready' ? <>
      <Text style={styles.body}>{l('Telefonu yalnızca yönetici alsın. Bir sonraki ekranda başlangıç ve gizli çözüm gösterilecek; diğer oyuncular bakmasın.', 'Only the moderator should hold the phone. The next screen contains the opening and secret solution; other players must look away.')}</Text>
      {button(l('Yöneticiyim · Hikâyeyi oku', 'I am the moderator · Read story'), () => setPhase('manager'))}
    </> : <>
      <Text style={styles.eyebrow}>{l('HİKÂYENİN BAŞLANGICI', 'STORY OPENING')}</Text>
      <Text style={styles.body}>{story.opening}</Text>
      {(phase === 'manager' || phase === 'done' || peek) && <View style={styles.secret}>
        <Text style={styles.eyebrow}>{phase === 'done' ? l('TAM ÇÖZÜM', 'FULL SOLUTION') : l('🔐 YALNIZCA YÖNETİCİ', '🔐 MODERATOR ONLY')}</Text>
        <Text style={styles.body}>{story.solution}</Text>
      </View>}
      {phase === 'manager' && <>
        <Text style={styles.muted}>{l('Çözümü aklında tut. Telefonu gruba vermeden önce aşağıdaki butonla gizle.', 'Remember the solution. Hide it with the button below before sharing the phone.')}</Text>
        {button(l('Çözümü gizle · Oyunu başlat', 'Hide solution · Start game'), () => setPhase('playing'))}
      </>}
      {phase === 'playing' && <>
        <Text style={styles.body}>{l('Evet / hayır soruları sorun ve birlikte çıkarım yapın. Yönetici yalnızca “Evet”, “Hayır” veya “İlgisiz” yanıtı verir.', 'Ask yes/no questions and reason together. The moderator answers only “Yes”, “No”, or “Irrelevant”.')}</Text>
        {button(peek ? l('Çözümü tekrar gizle', 'Hide solution again') : l('Yönetici · Gizli çözüme bak', 'Moderator · View secret solution'), () => setPeek(p => !p), true)}
        {!peek && button(l('Grup çözdü / Çözümü aç', 'Group solved it / Reveal solution'), () => setPhase('confirm'))}
      </>}
      {phase === 'confirm' && <>
        <Text style={styles.body}>{l('Yönetici: Grup gerçekten çözdü mü veya herkes çözümü görmeyi kabul ediyor mu? Açtığınızda bu hikâyenin gizemi sona erer.', 'Moderator: Has the group solved it, or has everyone agreed to see the answer? Revealing ends this mystery.')}</Text>
        {button(l('Onayla · Tam çözümü göster', 'Confirm · Reveal full solution'), () => setPhase('done'))}
        {button(l('Sorulara devam et', 'Keep asking questions'), () => setPhase('playing'), true)}
      </>}
      {phase === 'done' && <>
        <Text style={styles.body}>{l('Hikâye tamamlandı! Çözümünüzü yöneticiyle karşılaştırın. Bu oyunda amaç birlikte sonuca ulaşmaktır.', 'Story complete! Compare your explanation with the moderator. The goal is to solve it together.')}</Text>
        {button(index === mysteryStories.length - 1 ? l('Destenin başına dön', 'Restart story deck') : l('Sonraki hikâye · Yeni yönetici', 'Next story · New moderator'), next)}
      </>}
    </>}
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 14, borderWidth: 1, borderColor: Colors.borderGlass },
  eyebrow: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: Colors.textPrimary, fontSize: 23, fontWeight: '800' },
  body: { color: Colors.textPrimary, fontSize: 16, lineHeight: 25 },
  muted: { color: Colors.textMuted, fontSize: 13, lineHeight: 21 },
  secret: { backgroundColor: Colors.bgDeep, padding: 16, borderRadius: 14, gap: 10 },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center' },
  secondary: { backgroundColor: '#484288' },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 14, textAlign: 'center' },
});
