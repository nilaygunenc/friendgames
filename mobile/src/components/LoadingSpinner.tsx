import { View, Text } from '../ui';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface Props {
  label?: string;
}

export const LoadingSpinner: React.FC<Props> = ({ label }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={Colors.primary} />
    {label && <Text style={styles.label}>{label}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgDeep,
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});

