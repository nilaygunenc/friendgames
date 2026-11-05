import React, { createContext, useContext, useMemo } from 'react';
import * as RN from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { translate } from '../i18n';
import { useAudioPlayer } from 'expo-audio';

const light: Record<string, string> = {
  '#0B0D17': '#F5F5FA', '#141829': '#FFFFFF',
  '#F1F5F9': '#172033', '#94A3B8': '#526078',
  'rgba(255,255,255,0.05)': 'rgba(20,24,41,0.04)',
  'rgba(255,255,255,0.08)': 'rgba(20,24,41,0.14)',
  'rgba(20,24,41,0.97)': 'rgba(255,255,255,0.97)',
};
const Sound = createContext<() => void>(() => {});
export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const player = useAudioPlayer(require('../../assets/tap.wav'));
  const enabled = useAppStore(s => s.soundEnabled);
  const play = () => {
    if (enabled) {
      void player.seekTo(0).then(() => player.play()).catch(() => {});
    }
  };
  return <Sound.Provider value={play}>{children}</Sound.Provider>;
}
function useStyle<T>(style: T): T {
  const dark = useAppStore(s => s.darkMode);
  return useMemo(() => {
    if (dark || !style) return style;
    const convert = (value: any): any => {
      if (Array.isArray(value)) return value.map(convert);
      if (value && typeof value === 'object')
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convert(v)]));
      return typeof value === 'string' ? light[value] ?? value : value;
    };
    return convert(RN.StyleSheet.flatten(style as any)) as T;
  }, [dark, style]);
}
export function Text({ children, style, ...props }: RN.TextProps) {
  const language = useAppStore(s => s.language);
  return <RN.Text {...props} style={useStyle(style)}>{React.Children.map(children, c =>
    typeof c === 'string' ? translate(c, language) : c)}</RN.Text>;
}
export function View({ style, ...props }: RN.ViewProps) {
  return <RN.View {...props} style={useStyle(style)} />;
}
export function ScrollView({ style, contentContainerStyle, ...props }: RN.ScrollViewProps) {
  return <RN.ScrollView {...props} style={useStyle(style)} contentContainerStyle={useStyle(contentContainerStyle)} />;
}
export function TextInput({ style, placeholder, placeholderTextColor, ...props }: RN.TextInputProps) {
  const language = useAppStore(s => s.language);
  const dark = useAppStore(s => s.darkMode);
  return <RN.TextInput {...props} style={useStyle(style)} placeholder={placeholder && translate(placeholder, language)}
    placeholderTextColor={!dark && placeholderTextColor === '#94A3B8' ? '#526078' : placeholderTextColor} />;
}
export function TouchableOpacity({ style, onPress, ...props }: RN.TouchableOpacityProps) {
  const play = useContext(Sound);
  const language = useAppStore(s => s.language);
  return <RN.TouchableOpacity {...props} accessibilityLabel={props.accessibilityLabel && translate(props.accessibilityLabel, language)} style={useStyle(style)} onPress={onPress ? e => { play(); onPress(e); } : undefined} />;
}
export function FlatList<T>({ style, contentContainerStyle, ...props }: RN.FlatListProps<T>) {
  return <RN.FlatList {...props} style={useStyle(style)} contentContainerStyle={useStyle(contentContainerStyle)} />;
}
export function useThemeStyle<T>(style: T): T { return useStyle(style); }
