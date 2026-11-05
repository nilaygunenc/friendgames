import { View, Text, ScrollView, TouchableOpacity } from '../ui';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../store/useAppStore';
import { Colors, Spacing, Radius, FontSize } from '../theme';

type Plan = 'monthly' | 'yearly';

const FEATURES = [
  { icon: '🔓', text: 'Tüm VIP oyunlara erişim' },
  { icon: '🚫', text: 'Reklamsız deneyim' },
  { icon: '🃏', text: '500+ ekstra kart & soru' },
  { icon: '⚡', text: 'Yeni oyunlara öncelikli erişim' },
  { icon: '👥', text: 'Grup profili & istatistikler' },
  { icon: '🎨', text: 'Özel tema seçenekleri' },
];

const VIP_PREVIEW = [
  { icon: '🔮', name: 'Sır Dedektifi' },
  { icon: '🌋', name: 'Afet Adası' },
  { icon: '🎭', name: 'Manipülatör' },
  { icon: '🧬', name: 'Genetik Dedektif' },
];

export const VIPScreen: React.FC = () => {
  const { isVip, toggleVip } = useAppStore();
  const [plan, setPlan] = useState<Plan>('monthly');

  const price = plan === 'monthly' ? '₺79/ay' : '₺47/ay · ₺564/yıl';
  const priceDesc =
    plan === 'monthly' ? 'İstediğin zaman iptal et' : 'Yıllık faturalama ile %40 tasarruf';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <LinearGradient
        colors={['rgba(121,40,202,0.25)', 'rgba(239,68,68,0.05)']}
        style={styles.hero}
      >
        <Text style={styles.crown}>👑</Text>
        <Text style={styles.heroTitle}>FriendGames Plus</Text>
        <Text style={styles.heroTagline}>Daha fazla oyun, daha az reklam, sınırsız eğlence</Text>
      </LinearGradient>

      {/* Plan toggle */}
      <View style={styles.planToggle}>
        <TouchableOpacity
          style={[styles.planBtn, plan === 'monthly' && styles.planBtnActive]}
          onPress={() => setPlan('monthly')}
        >
          <Text style={[styles.planBtnText, plan === 'monthly' && styles.planBtnTextActive]}>
            Aylık
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.planBtn, plan === 'yearly' && styles.planBtnActive]}
          onPress={() => setPlan('yearly')}
        >
          <Text style={[styles.planBtnText, plan === 'yearly' && styles.planBtnTextActive]}>
            Yıllık
          </Text>
          {plan !== 'yearly' && (
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>%40</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Price card */}
      <LinearGradient
        colors={['rgba(245,158,11,0.1)', 'rgba(249,115,22,0.1)']}
        style={styles.priceCard}
      >
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.priceDesc}>{priceDesc}</Text>
      </LinearGradient>

      {/* Features */}
      <View style={styles.featureList}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      {/* Subscribe button */}
      <LinearGradient
        colors={isVip ? ['#10B981', '#059669'] : ['#F59E0B', '#F97316']}
        style={styles.subscribeBtn}
      >
        <TouchableOpacity onPress={toggleVip} style={styles.subscribeBtnInner}>
          <Text style={[styles.subscribeBtnText, isVip && { color: Colors.white }]}>
            {isVip ? 'VIP demosunu kapat' : 'VIP demosunu aç'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <Text style={styles.trialNote}>
        {isVip
          ? 'Demo açık. Bu oturumda VIP oyunları deneyebilirsin.'
          : 'Ücretsiz prototip demosu. Ödeme alınmaz; fiyatlar ve avantajlar taslaktır.'}
      </Text>

      {/* VIP Preview */}
      <Text style={styles.previewTitle}>🔒 VIP Oyunlar Önizleme</Text>
      {VIP_PREVIEW.map((item, i) => (
        <View key={i} style={[styles.previewRow, !isVip && styles.previewLocked]}>
          <Text style={styles.previewIcon}>{item.icon}</Text>
          <Text style={styles.previewName}>{item.name}</Text>
          <Text style={styles.previewLockIcon}>{isVip ? '🔓' : '🔒'}</Text>
        </View>
      ))}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },
  content: { paddingBottom: 40 },

  hero: {
    padding: Spacing.xxl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  crown: { fontSize: 44, marginBottom: Spacing.sm },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.accentGold,
    marginBottom: 4,
  },
  heroTagline: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center' },

  planToggle: {
    flexDirection: 'row',
    margin: Spacing.xl,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.pill,
    padding: 4,
  },
  planBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    alignItems: 'center',
    position: 'relative',
  },
  planBtnActive: { backgroundColor: Colors.accentGold },
  planBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textMuted },
  planBtnTextActive: { color: '#000' },
  saveBadge: {
    position: 'absolute',
    top: -8, right: -2,
    backgroundColor: Colors.accentGreen,
    borderRadius: Radius.pill,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  saveBadgeText: { fontSize: 8, fontWeight: '800', color: Colors.white },

  priceCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  price: { fontSize: 28, fontWeight: '900', color: Colors.accentGold, marginBottom: 4 },
  priceDesc: { fontSize: FontSize.sm, color: Colors.textMuted },

  featureList: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  featureIcon: { fontSize: 16, width: 22, textAlign: 'center' },
  featureText: { fontSize: FontSize.md, color: Colors.textPrimary },

  subscribeBtn: { marginHorizontal: Spacing.xl, borderRadius: 16, marginBottom: Spacing.sm },
  subscribeBtnInner: { paddingVertical: 16, alignItems: 'center' },
  subscribeBtnText: { fontSize: FontSize.lg, fontWeight: '800', color: '#000' },

  trialNote: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },

  previewTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  previewLocked: { opacity: 0.5 },
  previewIcon: { fontSize: 20 },
  previewName: { flex: 1, fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  previewLockIcon: { fontSize: 16 },
});

