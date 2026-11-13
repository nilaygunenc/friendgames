import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from '../ui';
import { TabuCard, TabuCategory, TabuDeck } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';
import { apiEnabled, TabuDecksAPI } from '../utils/api';
import { loadTabuDecks, removeTabuDeck, saveTabuDeck } from '../services/TabuDeckStore';
import { useAuth } from '../hooks/useAuth';

const categories: { id: TabuCategory; label: string }[] = [
  { id: 'sinema', label: 'Sinema' }, { id: 'teknoloji', label: 'Teknoloji' }, { id: 'günlük-yaşam', label: 'Günlük yaşam' },
  { id: '90lar', label: '90’lar' }, { id: 'doğa', label: 'Doğa' }, { id: 'spor', label: 'Spor' }, { id: 'kültür', label: 'Kültür' },
  { id: 'yemek', label: 'Yemek' }, { id: 'hayvanlar', label: 'Hayvanlar' }, { id: 'diğer', label: 'Diğer' },
];
const coverColors = ['#547386', '#806E91', '#BC826B', '#6C8A72', '#A28A50', '#8C6674'];
const labelFor = (category: TabuCategory) => categories.find(c => c.id === category)?.label ?? 'Diğer';
const makeCode = () => `VIP-${Math.floor(1000 + Math.random() * 9000)}`;

export function TabuDeckManager({ onClose, onUpgrade, onDeckSaved }: { onClose: () => void; onUpgrade: () => void; onDeckSaved: (deck: TabuDeck) => void }) {
  const isVip = useAppStore(s => s.isVip);
  const auth = useAuth();
  const [decks, setDecks] = useState<TabuDeck[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TabuCategory>('diğer');
  const [coverColor, setCoverColor] = useState(coverColors[0]);
  const [main, setMain] = useState('');
  const [banned, setBanned] = useState('');
  const [cards, setCards] = useState<TabuCard[]>([]);
  const [topic, setTopic] = useState('');
  const [shareCode, setShareCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const cloudReady = apiEnabled && auth.isLoggedIn && isVip;

  useEffect(() => { void loadTabuDecks().then(setDecks); void auth.restoreSession(); }, []);
  useEffect(() => {
    if (!cloudReady) return;
    void TabuDecksAPI.list().then(async response => {
      const remoteDecks = (response.data.decks ?? []).map((remote: any): TabuDeck => ({
        id: remote.id, name: remote.name, category: remote.category, coverColor: remote.coverColor ?? remote.cover_color ?? coverColors[0],
        shareCode: remote.shareCode ?? remote.share_code, cards: remote.cards, createdAt: remote.createdAt ?? remote.created_at,
      }));
      for (const deck of remoteDecks) await saveTabuDeck(deck);
      setDecks(await loadTabuDecks());
    }).catch(() => { /* Keep local decks available when the cloud is offline. */ });
  }, [cloudReady]);

  const addManualCard = () => {
    const word = main.trim();
    const bannedWords = banned.split(',').map(value => value.trim()).filter(Boolean);
    if (!word || bannedWords.length !== 5) { setMessage('Ana kelimeyi ve virgülle ayrılmış tam 5 yasaklı kelimeyi gir.'); return; }
    setCards(list => [...list, { id: `manual-${Date.now()}`, main: word, banned: bannedWords, category, difficulty: 'orta' }]);
    setMain(''); setBanned(''); setMessage('Kart desteye eklendi.');
  };

  const save = async (nextCards = cards) => {
    if (!isVip) return;
    if (!name.trim() || !nextCards.length) { setMessage('Kaydetmek için deste adı ve en az bir kart gerekli.'); return; }
    setBusy(true); setMessage('');
    const draft: TabuDeck = { id: `deck-${Date.now()}`, name: name.trim(), category, coverColor, shareCode: makeCode(), cards: nextCards, createdAt: new Date().toISOString() };
    let saved = draft;
    let cloudMessage = 'Cihaza kaydedildi.';
    try {
      if (cloudReady) {
        try {
          const response = await TabuDecksAPI.create({ name: draft.name, category, coverColor, cards: nextCards });
          const remote = response.data.deck;
          saved = { ...draft, id: remote.id, shareCode: remote.shareCode ?? remote.share_code ?? draft.shareCode };
          cloudMessage = 'Buluta kaydedildi.';
        } catch (error: any) {
          cloudMessage = `Cihaza kaydedildi; bulut kaydı başarısız: ${error?.response?.data?.error ?? 'oturum/API bağlantısını kontrol et.'}`;
        }
      }
      const updated = await saveTabuDeck(saved);
      setDecks(updated); setCards([]); setName(''); setMessage(`${cloudMessage} Paylaşım kodu: ${saved.shareCode}${!cloudReady ? ' · bulut paylaşımı için API, VIP hesabı ve oturum gerekli.' : ''}`);
      onDeckSaved(saved);
    } catch (error: any) {
      setMessage(error?.response?.data?.error ?? 'Deste kaydedilemedi. Oturum ve VIP durumunu kontrol et.');
    } finally { setBusy(false); }
  };

  const generate = async () => {
    if (!topic.trim()) { setMessage('AI deste üretmek için bir konu yaz.'); return; }
    setBusy(true); setMessage('AI kartları hazırlıyor…');
    try {
      if (!cloudReady) throw new Error('AI üretimi için API bağlantısı ve VIP hesabıyla açık oturum gerekli.');
      const response = await TabuDecksAPI.generate(topic.trim(), category);
      const generated = (response.data.cards as TabuCard[]).map((card, index) => ({ ...card, id: card.id || `ai-${Date.now()}-${index}`, category, difficulty: card.difficulty || 'orta' }));
      setCards(current => [...current, ...generated]);
      if (!name.trim()) setName(`${topic.trim()} Tabu`);
      setMessage(`${generated.length} kart üretildi. Deste adına ve kaydetmeye hazırsın.`);
    } catch (error: any) {
      setMessage(error?.response?.data?.error ?? error?.message ?? 'AI deste üretilemedi.');
    } finally { setBusy(false); }
  };

  const importDeck = async () => {
    const code = shareCode.trim().toUpperCase();
    if (!code) return;
    setBusy(true); setMessage('');
    try {
      if (!cloudReady) throw new Error('Kodla indirmek için API bağlantısı ve VIP hesabıyla açık oturum gerekli.');
      const response = await TabuDecksAPI.getByCode(code);
      const remote = response.data.deck;
      const deck: TabuDeck = { id: `import-${remote.id}`, name: remote.name, category: remote.category, coverColor: remote.coverColor ?? remote.cover_color, shareCode: remote.shareCode ?? remote.share_code, cards: remote.cards, createdAt: remote.createdAt ?? remote.created_at };
      setDecks(await saveTabuDeck(deck)); setShareCode(''); setMessage(`“${deck.name}” indirildi.`);
    } catch (error: any) { setMessage(error?.response?.data?.error ?? error?.message ?? 'Deste indirilemedi.'); }
    finally { setBusy(false); }
  };

  if (!isVip) return <View style={styles.panel}>
    <Text style={styles.title}>👑 VIP Özel Deste</Text>
    <Text style={styles.note}>Kendi Tabu kartlarını oluşturmak, AI ile deste üretmek ve kodla paylaşmak VIP üyeliğe dahildir.</Text>
    <TouchableOpacity onPress={onUpgrade} style={styles.primary}><Text style={styles.primaryText}>VIP’ye yükselt</Text></TouchableOpacity>
    <TouchableOpacity onPress={onClose} style={styles.secondary}><Text style={styles.secondaryText}>Geri dön</Text></TouchableOpacity>
  </View>;

  return <View style={styles.panel}>
    <View style={styles.header}><Text style={styles.title}>🃏 VIP Deste Atölyesi</Text><TouchableOpacity onPress={onClose}><Text style={styles.close}>Kapat ✕</Text></TouchableOpacity></View>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.section}>YENİ DESTE</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Deste adı" placeholderTextColor={Colors.textMuted} style={styles.input} />
      <Text style={styles.label}>Kategori</Text>
      <View style={styles.chips}>{categories.map(option => <TouchableOpacity key={option.id} onPress={() => setCategory(option.id)} style={[styles.chip, category === option.id && styles.chipActive]}><Text style={[styles.chipText, category === option.id && styles.chipTextActive]}>{option.label}</Text></TouchableOpacity>)}</View>
      <Text style={styles.label}>Kapak rengi</Text>
      <View style={styles.chips}>{coverColors.map(color => <TouchableOpacity accessibilityLabel={`Kapak rengi ${color}`} key={color} onPress={() => setCoverColor(color)} style={[styles.colorDot, { backgroundColor: color }, coverColor === color && styles.colorSelected]} />)}</View>
      <View style={[styles.preview, { backgroundColor: coverColor }]}><Text style={styles.previewText}>{name || 'Deste önizleme'} · {labelFor(category)} · {cards.length} kart</Text></View>

      <Text style={styles.section}>MANUEL KART EKLE</Text>
      <TextInput value={main} onChangeText={setMain} placeholder="Ana kelime" placeholderTextColor={Colors.textMuted} style={styles.input} />
      <TextInput value={banned} onChangeText={setBanned} placeholder="5 yasaklı kelime, virgülle ayır" placeholderTextColor={Colors.textMuted} style={[styles.input, styles.multiline]} multiline />
      <TouchableOpacity onPress={addManualCard} style={styles.secondary}><Text style={styles.secondaryText}>＋ Kart ekle{cards.length ? ` (${cards.length})` : ''}</Text></TouchableOpacity>

      <Text style={styles.section}>AI İLE OTOMATİK DESTE</Text>
      <TextInput value={topic} onChangeText={setTopic} placeholder="Örn. 90’lar Türk pop müziği" placeholderTextColor={Colors.textMuted} style={styles.input} />
      <TouchableOpacity disabled={busy} onPress={() => void generate()} style={styles.primary}><Text style={styles.primaryText}>{busy ? 'Hazırlanıyor…' : '✨ 24 kart üret'}</Text></TouchableOpacity>
      {cards.length > 0 && <View style={styles.savedCard}><Text style={styles.savedTitle}>{cards.length} kart hazır</Text><Text style={styles.note}>{cards.slice(0, 4).map(c => c.main).join(' · ')}{cards.length > 4 ? ' …' : ''}</Text></View>}
      <TouchableOpacity disabled={busy} onPress={() => void save()} style={styles.save}><Text style={styles.primaryText}>{busy ? 'Kaydediliyor…' : 'Desteği kaydet'}</Text></TouchableOpacity>

      {apiEnabled && <>
        <Text style={styles.section}>VIP HESABI · {auth.isLoggedIn ? (auth.displayName ?? 'Oturum açık') : 'Oturum gerekli'}</Text>
        {!auth.isLoggedIn && <>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="E-posta" placeholderTextColor={Colors.textMuted} style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Şifre" placeholderTextColor={Colors.textMuted} style={styles.input} />
          <View style={styles.inline}>
            <TouchableOpacity disabled={busy} onPress={async () => { setBusy(true); const ok = await auth.login(email.trim(), password); setBusy(false); setMessage(ok ? 'VIP hesabıyla giriş yapıldı.' : auth.error ?? 'Giriş başarısız.'); }} style={[styles.secondary, styles.flex]}><Text style={styles.secondaryText}>Giriş yap</Text></TouchableOpacity>
            <TouchableOpacity disabled={busy} onPress={async () => { setBusy(true); const ok = await auth.register(email.trim(), password, displayName.trim() || 'FriendGames oyuncusu'); setBusy(false); setMessage(ok ? 'Hesap oluşturuldu. Bulut/VIP özellikleri VIP hesaplarda açılır.' : auth.error ?? 'Kayıt başarısız.'); }} style={[styles.secondary, styles.flex]}><Text style={styles.secondaryText}>Hesap aç</Text></TouchableOpacity>
          </View>
        </>}
        {!auth.isLoggedIn && <TextInput value={displayName} onChangeText={setDisplayName} placeholder="Hesap görünen adı (isteğe bağlı)" placeholderTextColor={Colors.textMuted} style={styles.input} />}
      </>}
      <Text style={styles.section}>KODLA PAYLAŞ</Text>
      <View style={styles.inline}><TextInput value={shareCode} onChangeText={setShareCode} autoCapitalize="characters" placeholder="VIP-8492" placeholderTextColor={Colors.textMuted} style={[styles.input, styles.codeInput]} /><TouchableOpacity disabled={busy} onPress={() => void importDeck()} style={styles.secondary}><Text style={styles.secondaryText}>İndir</Text></TouchableOpacity></View>

      <Text style={styles.section}>DESTE KÜTÜPHANEM · {decks.length}</Text>
      {decks.map(deck => <View key={deck.id} style={[styles.savedCard, { borderLeftColor: deck.coverColor }]}><TouchableOpacity onPress={() => onDeckSaved(deck)}><Text style={styles.savedTitle}>{deck.name} · {deck.cards.length} kart</Text><Text style={styles.note}>{labelFor(deck.category)} · {deck.shareCode}</Text></TouchableOpacity><TouchableOpacity onPress={() => void removeTabuDeck(deck.id).then(setDecks)}><Text style={styles.delete}>Sil</Text></TouchableOpacity></View>)}
      {!!message && <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  panel: { backgroundColor: Colors.bgCard, margin: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.borderGlass, gap: 12, maxHeight: '92%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, title: { color: Colors.textPrimary, fontSize: 21, fontWeight: '900' }, close: { color: Colors.primaryGlow, fontWeight: '700' },
  scroll: { flexGrow: 0 }, content: { gap: 10, paddingBottom: 12 }, section: { color: Colors.accentGold, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 12 }, label: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  input: { backgroundColor: Colors.bgDeep, borderColor: Colors.borderGlass, borderWidth: 1, borderRadius: 10, padding: 12, color: Colors.textPrimary, minHeight: 46 }, multiline: { minHeight: 72, textAlignVertical: 'top' }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, chip: { borderRadius: 16, borderWidth: 1, borderColor: Colors.borderGlass, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: Colors.bgDeep }, chipActive: { backgroundColor: 'rgba(143,168,184,0.18)', borderColor: Colors.primaryGlow }, chipText: { color: Colors.textMuted, fontSize: 11, fontWeight: '700' }, chipTextActive: { color: Colors.textPrimary },
  colorDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'transparent' }, colorSelected: { borderColor: Colors.white }, preview: { minHeight: 58, borderRadius: 12, padding: 14, justifyContent: 'center' }, previewText: { color: Colors.white, fontWeight: '800' },
  primary: { backgroundColor: Colors.primaryDark, borderRadius: 10, padding: 13, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary }, primaryText: { color: Colors.white, fontWeight: '800', textAlign: 'center' }, secondary: { backgroundColor: Colors.bgRaised, borderColor: Colors.borderGlass, borderWidth: 1, borderRadius: 10, padding: 12, alignItems: 'center', justifyContent: 'center' }, secondaryText: { color: Colors.textPrimary, fontWeight: '700' }, save: { backgroundColor: Colors.accentGreen, borderRadius: 10, padding: 14, alignItems: 'center' },
  inline: { flexDirection: 'row', gap: 8, alignItems: 'stretch' }, flex: { flex: 1 }, codeInput: { flex: 1 }, savedCard: { padding: 12, borderRadius: 10, backgroundColor: Colors.bgDeep, borderWidth: 1, borderColor: Colors.borderGlass, borderLeftWidth: 4, gap: 6 }, savedTitle: { color: Colors.textPrimary, fontWeight: '800' }, note: { color: Colors.textMuted, fontSize: 13, lineHeight: 19 }, message: { color: Colors.accentGold, fontSize: 12, lineHeight: 18 }, delete: { color: Colors.accentRed, fontWeight: '700', paddingTop: 4 },
});
