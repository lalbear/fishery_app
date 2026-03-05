import 'react-native-get-random-values';
/**
 * Fishing God Mobile App - Entry Point
 * React Native with Expo and WatermelonDB
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
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
import { theme } from './src/theme';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SpeciesScreen from './src/screens/SpeciesScreen';
import SpeciesDetailScreen from './src/screens/SpeciesDetailScreen';
import EconomicsScreen from './src/screens/EconomicsScreen';
import EconomicsResultScreen from './src/screens/EconomicsResultScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WaterQualityScreen from './src/screens/WaterQualityScreen';
import MarketPricesScreen from './src/screens/MarketPricesScreen';
import EquipmentCatalogScreen from './src/screens/EquipmentCatalogScreen';

// Types
export type RootStackParamList = {
  Main: undefined;
  SpeciesDetail: { speciesId: string };
  EconomicsResult: { simulationData: any };
  WaterQuality: undefined;
  MarketPrices: undefined;
  EquipmentCatalog: undefined;
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
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          elevation: 8,
          height: 60,
          paddingVertical: 8,
        },
        headerShown: false,
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

function App() {
  return (
    <DatabaseProvider database={database}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SpeciesDetail"
              component={SpeciesDetailScreen}
              options={{ title: 'Species Details' }}
            />
            <Stack.Screen
              name="EconomicsResult"
              component={EconomicsResultScreen}
              options={{ title: 'Simulation Results' }}
            />
            <Stack.Screen
              name="WaterQuality"
              component={WaterQualityScreen}
              options={{ title: 'Water Quality Log' }}
            />
            <Stack.Screen
              name="MarketPrices"
              component={MarketPricesScreen}
              options={{ title: 'Market Prices' }}
            />
            <Stack.Screen
              name="EquipmentCatalog"
              component={EquipmentCatalogScreen}
              options={{ title: 'Equipment Catalog' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}

export default App;