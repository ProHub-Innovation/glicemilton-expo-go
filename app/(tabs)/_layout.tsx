import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF4B4B',
        headerShown: false,
      }}
    >
      {/* 1. Tela Inicial (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
        }}
      />

      {/* 2. Tela de Login (two) - Oculta da barra inferior */}
      <Tabs.Screen
        name="two"
        options={{
          href: null, // Isso esconde o botão da barra, mas permite navegar até ela!
        }}
      />

      {/* 3. Tela de Jogos (Onboarding / Dashboard) */}
      <Tabs.Screen
        name="onboarding"
        options={{
          title: 'Jogos',
          tabBarIcon: ({ color }) => <Ionicons name="game-controller" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
