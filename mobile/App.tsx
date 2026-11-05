import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation';
import { Colors } from './src/theme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import { useAppStore } from './src/store/useAppStore';
import { FeedbackProvider, useThemeStyle } from './src/ui';

function KeepScreenAwake() {
  useKeepAwake();
  return null;
}

export default function App() {
  const keepScreenOn = useAppStore(s => s.keepScreenOn);
  const dark = useAppStore(s => s.darkMode);
  const background = useThemeStyle({ flex: 1, backgroundColor: Colors.bgDeep });
  return (
    <GestureHandlerRootView style={background}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          {keepScreenOn && <KeepScreenAwake />}
          <FeedbackProvider><AppNavigator /></FeedbackProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

