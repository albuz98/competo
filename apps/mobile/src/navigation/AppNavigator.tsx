import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { navigationRef } from "./navigationRef";
import { useNotificationSetup } from "../hooks/useNotificationSetup";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import TournamentDetailScreen from "../screens/TournamentDetailScreen";
import MyTournamentDetailScreen from "../screens/MyTournamentDetailScreen";
import PaymentScreen from "../screens/PaymentScreen";
import TeamSelectScreen from "../screens/TeamSelectScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import NotificheScreen from "../screens/NotificheScreen";
import TeamsScreen from "../screens/TeamsScreen";
import CreateTeamScreen from "../screens/CreateTeamScreen";
import TeamDetailScreen from "../screens/TeamDetailScreen";
import InvitePlayersScreen from "../screens/InvitePlayersScreen";
import OrganizerTournamentDetailScreen from "../screens/OrganizerTournamentDetailScreen";
import PlayerProfileScreen from "../screens/PlayerProfileScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavigationSetup() {
  useNotificationSetup();
  return null;
}

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <NavigationSetup />
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: { backgroundColor: "#4f46e5" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#f8fafc" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TournamentDetail"
          component={TournamentDetailScreen}
          options={{ title: "Dettagli Torneo" }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifiche"
          component={NotificheScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyTournamentDetail"
          component={MyTournamentDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamSelect"
          component={TeamSelectScreen}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="Teams"
          component={TeamsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateTeam"
          component={CreateTeamScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamDetail"
          component={TeamDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InvitePlayers"
          component={InvitePlayersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrganizerTournamentDetail"
          component={OrganizerTournamentDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlayerProfile"
          component={PlayerProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
