import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { navigationRef } from "./navigationRef";
import { useNotificationSetup } from "../hooks/useNotificationSetup";
import TeamsScreen from "../screens/Teams/Teams";
import MainTabNavigator from "./MainTabNavigator/MainTabNavigator";
import { useAuth } from "../context/AuthContext";
import CreateTeam from "../screens/CreateTeam/CreateTeam";
import EditProfile from "../screens/EditProfile/EditProfile";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import InvitePlayers from "../screens/InvitePlayers/InvitePlayers";
import Login from "../screens/Login/Login";
import MyTournamentDetail from "../screens/MyTournamentDetail/MyTournamentDetail";
import Notifications from "../screens/Notifications/Notifications";
import OrganizerTournamentDetail from "../screens/OrganizerTournamentDetail/OrganizerTournamentDetail";
import Payment from "../screens/Payment/Payment";
import PlayerProfile from "../screens/PlayerProfile/PlayerProfile";
import Register from "../screens/Register/Register";
import TeamDetail from "../screens/TeamDetail/TeamDetail";
import TeamSelect from "../screens/TeamSelect/TeamSelect";
import ChoseAccess from "../screens/ChoseAccess/ChoseAccess";
import TournamentDetail from "../screens/TournamentDetail/TournamentDetail";

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavigationSetup() {
  useNotificationSetup();
  return null;
}

export default function AppNavigator() {
  const { user, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <ActivityIndicator size="large" color="#E8601A" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <NavigationSetup />
      <Stack.Navigator
        initialRouteName={user ? "MainTabs" : "ChoseAccess"}
        screenOptions={{
          headerStyle: { backgroundColor: "#4f46e5" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#f8fafc" },
        }}
      >
        <Stack.Screen
          name="ChoseAccess"
          component={ChoseAccess}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TournamentDetail"
          component={TournamentDetail}
          options={{ title: "Dettagli Torneo" }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifiche"
          component={Notifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyTournamentDetail"
          component={MyTournamentDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamSelect"
          component={TeamSelect}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="Teams"
          component={TeamsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateTeam"
          component={CreateTeam}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamDetail"
          component={TeamDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InvitePlayers"
          component={InvitePlayers}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrganizerTournamentDetail"
          component={OrganizerTournamentDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlayerProfile"
          component={PlayerProfile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
