import { Text, View } from '../ui';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import { GamesScreen } from '../screens/GamesScreen';
import { GameDetailScreen } from '../screens/GameDetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { VIPScreen } from '../screens/VIPScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { GamePlayScreen } from '../screens/GamePlayScreen';
import { Colors } from '../theme';
import { RootStackParamList, BottomTabParamList } from '../types';
import { useThemeStyle } from '../ui';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Games:     { active: '🎮', inactive: '🎮' },
  Favorites: { active: '❤️', inactive: '🤍' },
  VIP:       { active: '👑', inactive: '♛' },
  Settings:  { active: '⚙️', inactive: '⚙️' },
};

const TAB_LABELS: Record<string, string> = {
  Games:     'Oyunlar',
  Favorites: 'Favoriler',
  VIP:       'VIP Pass',
  Settings:  'Ayarlar',
};

function TabNavigator() {
  const tabBarStyle = useThemeStyle(styles.tabBar);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: route.name === 'VIP' ? Colors.accentGold : Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ fontSize: 10, fontWeight: '600', color }}>
            {TAB_LABELS[route.name]}
          </Text>
        ),
        tabBarIcon: ({ focused, color }) => (
          <Text style={{ fontSize: 20 }}>
            {focused
              ? TAB_ICONS[route.name]?.active
              : TAB_ICONS[route.name]?.inactive}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="VIP" component={VIPScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="GameDetail"
          component={GameDetailScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="GamePlay" component={GamePlayScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(20,24,41,0.97)',
    borderTopColor: Colors.borderGlass,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
});

