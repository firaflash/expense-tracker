// app/navigation/AppNavigator.tsx
// This is the TRAFFIC CONTROLLER of the entire app.
// It decides which stack of screens to show based on whether the user is logged in.

import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  ArrowLeftRight,
  PiggyBank,
  BarChart,
} from "lucide-react-native";

import useTheme from "../../hooks/useTheme";
import useMoniVoStore from "../../store/useMoniVoStore";

// Import all screens
import OnboardingScreen from "../(auth)/OnboardinScree";
import LoginScreen from "../(auth)/LoginScreen";
import RegisterScreen from "../(auth)/RegisterScreen";

import HomeScreen from "../(app)/HomeScreen";
import TransactionScreen from "../(app)/TransactionScreen";
import BudgetsScreen from "../(app)/BudgetsScreen";
import AnalyticsScreen from "../(app)/AnalyticsScreen";

// TypeScript: Define what screens exist in each navigator
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budgets: undefined;
  Analytics: undefined;
};

// Create navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabParamList>();

// AUTH STACK — shown when user is NOT logged in
function AuthNavigator() {
  const colors = useTheme();

  return (
    <AuthStack.Navigator
      id="AuthStack"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <AuthStack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </AuthStack.Navigator>
  );
}

// APP TABS — shown when user IS logged in
function AppTabNavigator() {
  const colors = useTheme();

  return (
    <AppTabs.Navigator
      id="AppTabs"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 61,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: colors.champagne,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },

        tabBarIcon: ({ color }) => {
          if (route.name === "Home") {
            return <Home size={22} color={color} />;
          }

          if (route.name === "Transactions") {
            return <ArrowLeftRight size={22} color={color} />;
          }

          if (route.name === "Budgets") {
            return <PiggyBank size={22} color={color} />;
          }

          if (route.name === "Analytics") {
            return <BarChart size={22} color={color} />;
          }

          return null;
        },
      })}
    >
      <AppTabs.Screen
        name="Home"
        component={HomeScreen}
      />

      <AppTabs.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{ tabBarLabel: "Transactions" }}
      />

      <AppTabs.Screen
        name="Budgets"
        component={BudgetsScreen}
        options={{ tabBarLabel: "Budgets" }}
      />

      <AppTabs.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ tabBarLabel: "Analytics" }}
      />
    </AppTabs.Navigator>
  );
}

// ROOT NAVIGATOR — The main export, decides Auth vs App
export default function AppNavigator() {
  // Read the user from Zustand — if null = not logged in
  const user = useMoniVoStore((state) => state.user);

  // Read loading state — true while checking for existing token
  const isLoadingAuth = useMoniVoStore(
    (state) => state.isLoadingAuth
  );

  // Get the checkAuth function to verify token on app start
  const checkAuth = useMoniVoStore((state) => state.checkAuth);

  // Get theme colors for loading screen
  const colors = useTheme();

  // Check for existing token when app first loads
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking authentication
  if (isLoadingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={colors.champagne}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppTabNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}