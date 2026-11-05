import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from '../ui';
import { Switch, StyleSheet, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Colors, Spacing, Radius, FontSize } from '../theme';

export const SettingsScreen: React.FC = () => {
  const s = useAppStore();
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const [panel, setPanel] = useState<'language' | 'privacy' | 'about' | null>(null);
  const toggle = (value: boolean, action: () => void, label: string) => <Switch accessibilityLabel={label} value={value}
    onValueChange={action} trackColor={{ false: '#64748b', true: Colors.primary }} thumbColor={Colors.white} />;
  const row = (icon: string, title: string, subtitle: string, right?: React.ReactNode, onPress?: () => void) => (
    <View style={styles.row}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={title} disabled={!onPress} onPress={onPress} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={styles.rowIconText}>{icon}</Text>
        <View style={styles.rowInfo}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowSub}>{subtitle}</Text></View>
        {onPress && <Text style={styles.chevron}>›</Text>}
      </TouchableOpacity>
      {right}
    </View>
  );
  return <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}><Text style={styles.title}>⚙️ Ayarlar</Text><Text style={styles.subtitle}>Grup modunu ve tercihleri ayarla</Text></View>
      <Text style={styles.groupLabel}>GRUP MODU</Text>
      {row('👥', 'Grup Büyüklüğü', 'Kaç kişiyle oynuyorsunuz?', <View style={styles.picker}>
        <TouchableOpacity accessibilityLabel="Grubu küçült" disabled={s.groupSize <= 1} onPress={() => s.setGroupSize(s.groupSize - 1)} style={styles.pickerBtn}><Text style={styles.pickerBtnText}>−</Text></TouchableOpacity>
        <Text style={styles.pickerVal}>{s.groupSize}</Text>
        <TouchableOpacity accessibilityLabel="Grubu büyüt" disabled={s.groupSize >= 30} onPress={() => s.setGroupSize(s.groupSize + 1)} style={styles.pickerBtn}><Text style={styles.pickerBtnText}>+</Text></TouchableOpacity>
      </View>)}
      {row('☀️', 'Ekranı Uyanık Tut', 'Oyun sırasında ekran kapanmaz', toggle(s.keepScreenOn, s.toggleKeepScreen, 'Ekranı Uyanık Tut'))}
      <Text style={styles.groupLabel}>SES VE GÖRSEL</Text>
      {row('🔊', 'Ses Efektleri', 'Oyun içi sesler', toggle(s.soundEnabled, s.toggleSound, 'Ses Efektleri'))}
      {row('🌙', 'Karanlık Mod', 'Loş ortamlarda rahat görünüm', toggle(s.darkMode, s.toggleDarkMode, 'Karanlık Mod'))}
      {row('🌐', 'Dil', s.language === 'tr' ? 'Türkçe' : 'English', undefined, () => setPanel('language'))}
      <Text style={styles.groupLabel}>HESAP</Text>
      {row('👑', 'VIP Durum', s.isVip ? 'FriendGames Plus aktif' : 'Ücretsiz plan', undefined, () => navigation.navigate('VIP'))}
      {row('🛡️', 'Gizlilik Politikası', 'Verileriniz nasıl kullanılır', undefined, () => setPanel('privacy'))}
      {row('ℹ️', 'Hakkında', 'FriendGames v1.0.0', undefined, () => setPanel('about'))}
      <Text style={styles.version}>FriendGames v1.0.0 · Built with ❤️ for friends</Text>
    </ScrollView>
    <Modal visible={panel !== null} transparent animationType="fade" onRequestClose={() => setPanel(null)}>
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 24 }}>
        <View style={{ backgroundColor: Colors.bgCard, borderRadius: 24, padding: 24, maxHeight: '85%' }}>
          <ScrollView>
            <Text style={styles.title}>{panel === 'language' ? 'Dil' : panel === 'privacy' ? 'Gizlilik Politikası' : 'Hakkında'}</Text>
            {panel === 'language' ? <View>
              {(['tr', 'en'] as const).map(language => <TouchableOpacity key={language} accessibilityRole="radio" accessibilityState={{ checked: s.language === language }}
                onPress={() => { s.setLanguage(language); setPanel(null); }} style={{ paddingVertical: 20 }}>
                <Text style={styles.rowTitle}>{language === 'tr' ? 'Türkçe' : 'English'} {s.language === language ? '✓' : ''}</Text>
              </TouchableOpacity>)}
            </View> : <Text style={[styles.rowSub, { lineHeight: 24, marginVertical: 20 }]}>{panel === 'privacy'
              ? 'Bu sürümde hesap açmadan oynayabilirsiniz. Favoriler, dil, tema, grup büyüklüğü ve tercihler cihazınızda saklanır. Rol dağıtımı ve kart çekimi cihazda yapılır. Uygulama bu oyun verilerini bir sunucuya göndermez. VIP yalnızca oturumluk demodur ve ödeme alınmaz. Uygulama verilerini cihaz ayarlarından silebilirsiniz. Geliştirme önizlemesi Expo araçlarını kullanır. İsteğe bağlı sunucu bağlantısı veya gerçek ödeme eklendiğinde bu metin güncellenecektir.'
              : `FriendGames
Sürüm 1.0.0

Arkadaşlarınla tek telefon üzerinden parti oyunları oyna. Oyunları keşfet, favorilerini kaydet ve telefonu sırayla paylaş.

Bu sürüm geliştirme aşamasındadır. VIP bir demodur; gerçek abonelik veya ödeme içermez.`}</Text>}
          </ScrollView>
          <TouchableOpacity accessibilityRole="button" onPress={() => setPanel(null)} style={{ backgroundColor: Colors.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },
  content: { paddingBottom: 90 },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
  },
  title: { fontSize: FontSize.title, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted },

  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.xl,
    marginBottom: 6,
  },
  rowIcon: {
    width: 34, height: 34,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconText: { fontSize: 16 },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  rowSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  chevron: { fontSize: 18, color: Colors.textMuted },

  picker: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pickerBtn: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerBtnText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  pickerVal: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, minWidth: 24, textAlign: 'center' },

  version: {
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    fontSize: 11,
    color: Colors.textMuted,
  },
});


