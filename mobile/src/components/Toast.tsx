import { Text } from '../ui';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme';

interface Props {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<Props> = ({ message, visible }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -10, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(30,35,60,0.96)',
    borderRadius: Radius.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    zIndex: 999,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
});

