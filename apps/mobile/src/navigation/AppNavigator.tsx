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
import CreateTournamentSchedule from "../screens/CreateTournamentSchedule/CreateTournamentSchedule";
import TournamentScheduleResult from "../screens/TournamentScheduleResult/TournamentScheduleResult";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import InvitePlayers from "../screens/InvitePlayers/InvitePlayers";
import Login from "../screens/Login/Login";
import MyTournamentDetail from "../screens/MyTournamentDetail/MyTournamentDetail";
import Notifications from "../screens/Notifications/Notifications";
import Payment from "../screens/Payment/Payment";
import Register from "../screens/Register/Register";
import TeamDetail from "../screens/TeamDetail/TeamDetail";
import TeamSelect from "../screens/TeamSelect/TeamSelect";
import ChoseAccess from "../screens/ChoseAccess/ChoseAccess";
import TournamentDetail from "../screens/TournamentDetail/TournamentDetail";
import { colors } from "../theme/colors";

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
          backgroundColor: colors.gray,
        }}
      >
        <ActivityIndicator size="large" color={colors.primaryGradientMid} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <NavigationSetup />
      <Stack.Navigator
        initialRouteName={user ? "MainTabs" : "ChoseAccess"}
        screenOptions={{
          headerStyle: { backgroundColor: colors.purpleBlue },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: colors.gray },
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
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.black },
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.black },
          }}
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
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.black },
          }}
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
          name="CreateTournamentSchedule"
          component={CreateTournamentSchedule}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TournamentScheduleResult"
          component={TournamentScheduleResult}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
