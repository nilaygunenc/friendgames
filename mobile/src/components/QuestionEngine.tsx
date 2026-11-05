import { View, Text, TouchableOpacity } from '../ui';
import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuestion } from '../hooks/useQuestion';
import { Colors, Spacing, Radius, FontSize } from '../theme';

interface Props {
  gameId: string;
}

export const QuestionEngine: React.FC<Props> = ({ gameId }) => {
  const { question, isLoading, draw } = useQuestion(gameId);

  return (
    <View style={styles.card}>
      <Text style={styles.engineTitle}>💡 Soru Kartı</Text>

      <View style={styles.questionCard}>
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : question ? (
          <Text style={styles.questionText}>{question}</Text>
        ) : (
          <Text style={styles.placeholder}>
            Kart çekmek için aşağıdaki butona bas
          </Text>
        )}
      </View>

      <LinearGradient
        colors={['#7928CA', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.drawBtn}
      >
        <TouchableOpacity
          onPress={draw}
          style={styles.drawBtnInner}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.drawBtnText}>🔀 Kart Çek</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
  engineTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  questionCard: {
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    borderRadius: 14,
    padding: Spacing.lg,
    minHeight: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  questionText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
  },
  placeholder: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  drawBtn: { borderRadius: Radius.md },
  drawBtnInner: { paddingVertical: 13, alignItems: 'center' },
  drawBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
});

