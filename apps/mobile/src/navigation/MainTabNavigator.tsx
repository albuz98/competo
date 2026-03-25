import React from "react";
import { styles } from "../styles/MainTabNavigator.styles";
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

