import 'react-native-get-random-values';
/**
 * Fishing God Mobile App - Entry Point
 * React Native with Expo and WatermelonDB
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import './src/i18n';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import database from './src/database';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import { AuthProvider, useAuth } from './src/AuthContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SpeciesScreen from './src/screens/SpeciesScreen';
import SpeciesDetailScreen from './src/screens/SpeciesDetailScreen';
import EconomicsScreen from './src/screens/EconomicsScreen';
import EconomicsResultScreen from './src/screens/EconomicsResultScreen';
import PolicyGuidanceScreen from './src/screens/PolicyGuidanceScreen';
import LearningCenterScreen from './src/screens/LearningCenterScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WaterQualityScreen from './src/screens/WaterQualityScreen';
import MarketPricesScreen from './src/screens/MarketPricesScreen';
import EquipmentCatalogScreen from './src/screens/EquipmentCatalogScreen';
import FeedCatalogScreen from './src/screens/FeedCatalogScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import PondsListScreen from './src/screens/PondsListScreen';
import AddEditPondScreen from './src/screens/AddEditPondScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import AuthScreen from './src/screens/AuthScreen';

// Types
export type RootStackParamList = {
  Main: undefined;
  SpeciesDetail: { speciesId: string };
  EconomicsResult: { simulationData: any };
  PolicyGuidance: { knowledgeInsights?: any; stateCode?: string; farmerCategory?: string };
  LearningCenter: { knowledgeInsights?: any; stateCode?: string; farmerCategory?: string } | undefined;
  WaterQuality: { pondId?: string; initialTab?: 'log' | 'history' } | undefined;
  MarketPrices: undefined;
  EquipmentCatalog: undefined;
  FeedCatalog: undefined;
  PersonalInfo: undefined;
  PondsList: undefined;
  AddEditPond: { pondId?: string };
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Species: undefined;
  Economics: undefined;
  Maps: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function MainTabs() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Species':
              iconName = focused ? 'fish' : 'fish-outline';
              break;
            case 'Economics':
              iconName = focused ? 'calculator' : 'calculator-outline';
              break;
            case 'Maps':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 2,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          elevation: 0,
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
        },
        headerShown: false,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border }} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t('navigation.home') || 'Home' }}
      />
      <Tab.Screen
        name="Species"
        component={SpeciesScreen}
        options={{ title: t('navigation.species') || 'Species' }}
      />
      <Tab.Screen
        name="Economics"
        component={EconomicsScreen}
        options={{ title: t('navigation.economics') || 'Economics' }}
      />
      <Tab.Screen
        name="Maps"
        component={MapScreen}
        options={{ title: t('navigation.maps') || 'Map' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('navigation.profile') || 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function MainApp() {
  const { isAuthenticated, login } = useAuth();
  const { theme, mode } = useTheme();

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={login} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="SpeciesDetail" component={SpeciesDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EconomicsResult" component={EconomicsResultScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PolicyGuidance" component={PolicyGuidanceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LearningCenter" component={LearningCenterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WaterQuality" component={WaterQualityScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MarketPrices" component={MarketPricesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EquipmentCatalog" component={EquipmentCatalogScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FeedCatalog" component={FeedCatalogScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PondsList" component={PondsListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddEditPond" component={AddEditPondScreen} options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider database={database}>
        <AuthProvider>
          <ThemeProvider>
            <SafeAreaProvider>
              <MainApp />
            </SafeAreaProvider>
          </ThemeProvider>
        </AuthProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}

export default App;
