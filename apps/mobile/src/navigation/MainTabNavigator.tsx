import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MainTabParamList } from "../types";

import HomeScreen from "../screens/HomeScreen";
import EsploraScreen from "../screens/EsploraScreen";
import PreferitiScreen from "../screens/PreferitiScreen";
import ProfiloScreen from "../screens/ProfiloScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<string, [IoniconsName, IoniconsName]> = {
  Home: ["home", "home-outline"],
  Esplora: ["compass", "compass-outline"],
  Preferiti: ["bookmark", "bookmark-outline"],
  Profilo: ["person", "person-outline"],
};

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#E8601A",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { bottom: insets.bottom + 8 }],
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = TAB_ICONS[route.name] ?? [
            "ellipse",
            "ellipse-outline",
          ];
          return (
            <Ionicons
              name={focused ? active : inactive}
              size={size - 1}
              color={focused ? styles.iconActive.color : color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Esplora"
        component={EsploraScreen}
        options={{ title: "Esplora" }}
      />
      <Tab.Screen
        name="Preferiti"
        component={PreferitiScreen}
        options={{ title: "Preferiti" }}
      />
      <Tab.Screen
        name="Profilo"
        component={ProfiloScreen}
        options={{ title: "Profilo" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 0,
    paddingTop: 10,
    paddingHorizontal: 0,
    borderRadius: 30,
    left: 0,
    right: 0,
    marginLeft: 10,
    marginRight: 10,
    position: "absolute",
    elevation: 10,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
  },
  iconActive: {
    color: "#E8601A",
  },
});
