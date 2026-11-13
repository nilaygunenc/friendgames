import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from '../ui';
import { Game } from '../types';

interface Props {
  game: Game;
  size?: number;
  textStyle?: object;
}

export function GameIcon({ game, size = 32, textStyle }: Props) {
  if (game.id === 'ne-yapiyorum') return <ShushLogo size={size} />;
  return <Text style={[{ fontSize: size * 0.82, lineHeight: size }, textStyle]}>{game.icon}</Text>;
}

function ShushLogo({ size }: { size: number }) {
  const face = size * 0.72;
  const eye = Math.max(3, size * 0.075);
  return (
    <View style={[styles.shushLogo, { width: size, height: size, borderRadius: size * 0.3 }]}>
      <View style={[styles.face, { width: face, height: face, left: size * 0.14, top: size * 0.14, borderRadius: face / 2 }]} />
      <View style={[styles.eye, { width: eye, height: eye, left: size * 0.34, top: size * 0.35, borderRadius: eye / 2 }]} />
      <View style={[styles.eye, { width: eye, height: eye, left: size * 0.58, top: size * 0.35, borderRadius: eye / 2 }]} />
      <View style={[styles.mouth, { width: size * 0.12, height: Math.max(3, size * 0.045), left: size * 0.44, top: size * 0.56, borderRadius: size }]} />
      <View style={[styles.finger, { width: size * 0.14, height: size * 0.43, left: size * 0.43, top: size * 0.39, borderRadius: size * 0.12 }]} />
      <View style={[styles.fingerTip, { width: size * 0.18, height: size * 0.18, left: size * 0.41, top: size * 0.33, borderRadius: size }]} />
      <View style={[styles.spark, { width: eye * 0.75, height: eye * 0.75, right: size * 0.13, top: size * 0.19, borderRadius: size }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  shushLogo: { overflow: 'hidden', backgroundColor: '#DCE8EC', alignItems: 'center', justifyContent: 'center' },
  face: { position: 'absolute', backgroundColor: '#F4C78F', borderWidth: 1, borderColor: 'rgba(118,88,62,0.16)', shadowColor: '#66513B', shadowOpacity: 0.16, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  eye: { position: 'absolute', backgroundColor: '#39424A', zIndex: 1 },
  mouth: { position: 'absolute', backgroundColor: '#A96D63', zIndex: 1 },
  finger: { position: 'absolute', backgroundColor: '#F7E2C8', borderWidth: 1, borderColor: '#D4B18F', zIndex: 2 },
  fingerTip: { position: 'absolute', backgroundColor: '#F7E2C8', borderWidth: 1, borderColor: '#D4B18F', zIndex: 3 },
  spark: { position: 'absolute', backgroundColor: '#A7BAC3' },
});
