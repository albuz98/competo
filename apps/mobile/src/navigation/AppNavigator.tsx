import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationEnum, type RootStackParamList } from "../types";
import { navigationRef } from "./navigationRef";
import { useNotificationSetup } from "../hooks/useNotificationSetup";
import TeamsScreen from "../screens/Teams/Teams";
import MainTabNavigator from "./MainTabNavigator/MainTabNavigator";
import { useAuth } from "../context/AuthContext";
import CreateTeam from "../screens/CreateTeam/CreateTeam";
import CreateTournamentSchedule from "../screens/CreateTournamentSchedule/CreateTournamentSchedule";
import CreateOrganizerProfile from "../screens/CreateOrganizerProfile/CreateOrganizerProfile";
import TournamentScheduleResult from "../screens/TournamentScheduleResult/TournamentScheduleResult";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import InviteCollaborators from "../screens/InviteCollaborators/InviteCollaborators";
import InvitePlayers from "../screens/InvitePlayers/InvitePlayers";
import Login from "../screens/Login/Login";
import MyTournamentDetail from "../screens/MyTournamentDetail/MyTournamentDetail";
import Payment from "../screens/Payment/Payment";
import Register from "../screens/Register/Register";
import TeamDetail from "../screens/TeamDetail/TeamDetail";
import TeamSelect from "../screens/TeamSelect/TeamSelect";
import ChoseAccess from "../screens/ChoseAccess/ChoseAccess";
import TournamentDetail from "../screens/TournamentDetail/TournamentDetail";
import TournamentHistoryScreen from "../screens/TournamentHistory/TournamentHistory";
import Settings from "../screens/Settings/Settings";
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
        initialRouteName={
          user ? NavigationEnum.MAIN_TABS : NavigationEnum.CHOSE_ACCESS
        }
        screenOptions={{
          headerStyle: { backgroundColor: colors.purpleBlue },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: colors.gray },
        }}
      >
        <Stack.Screen
          name={NavigationEnum.CHOSE_ACCESS}
          component={ChoseAccess}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.LOGIN}
          component={Login}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.black },
          }}
        />
        <Stack.Screen
          name={NavigationEnum.REGISTER}
          component={Register}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.black },
          }}
        />
        <Stack.Screen
          name={NavigationEnum.MAIN_TABS}
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.TOURNAMENT_DETAIL}
          component={TournamentDetail}
          options={{ title: "Dettagli Torneo" }}
        />
        <Stack.Screen
          name={NavigationEnum.PAYMENT}
          component={Payment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.FORGOT_PASSWORD}
          component={ForgotPassword}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.black },
          }}
        />
        <Stack.Screen
          name={NavigationEnum.MY_TOURNAMENT_DETAIL}
          component={MyTournamentDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.TEAM_SELECT}
          component={TeamSelect}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name={NavigationEnum.TEAMS}
          component={TeamsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.CREATE_TEAM}
          component={CreateTeam}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.TEAM_DETAIL}
          component={TeamDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.INVITE_PLAYERS}
          component={InvitePlayers}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.INVITE_COLLABORATORS}
          component={InviteCollaborators}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.CREATE_TOURNAMENT_SCHEDULE}
          component={CreateTournamentSchedule}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.TOURNAMENT_SCHEDULE_RESULT}
          component={TournamentScheduleResult}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.TOURNAMENT_HISTORY}
          component={TournamentHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.SETTINGS}
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NavigationEnum.CREATE_ORGANIZER_PROFILE}
          component={CreateOrganizerProfile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
