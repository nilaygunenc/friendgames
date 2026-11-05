import { View, Text } from '../ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<Props> = ({ icon = '🔍', title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 10,
  },
  icon: { fontSize: 40, opacity: 0.35 },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

