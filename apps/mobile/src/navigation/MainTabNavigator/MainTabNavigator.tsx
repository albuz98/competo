import React from "react";
import { View } from "react-native";
import { styles } from "./MainTabNavigator.styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MainTabParamList } from "../../types";
import Explore from "../../screens/Explore/Explore";
import Home from "../../screens/Home/Home";
import Favorites from "../../screens/Favorites/Favorites";
import Notifications from "../../screens/Notifications/Notifications";
import Profile from "../../screens/Profile/Profile";
import { colors } from "../../theme/colors";
import { useNotifications } from "../../context/NotificationsContext";

const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<string, [IoniconsName, IoniconsName]> = {
  Home: ["home", "home-outline"],
  Esplora: ["compass", "compass-outline"],
  Preferiti: ["bookmark", "bookmark-outline"],
  Notifiche: ["notifications", "notifications-outline"],
  Profilo: ["person", "person-outline"],
};

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryGradientEnd,
        tabBarInactiveTintColor: colors.placeholder,
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
      <Tab.Screen name="Home" component={Home} options={{ title: "Home" }} />
      <Tab.Screen
        name="Esplora"
        component={Explore}
        options={{ title: "Esplora" }}
      />
      <Tab.Screen
        name="Preferiti"
        component={Favorites}
        options={{ title: "Preferiti" }}
      />
      <Tab.Screen
        name="Notifiche"
        component={Notifications}
        options={{
          title: "Notifiche",
          tabBarIcon: ({ focused, size }) => (
            <View>
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={size - 1}
                color={focused ? styles.iconActive.color : colors.placeholder}
              />
              {unreadCount > 0 && <View style={styles.badge} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profilo"
        component={Profile}
        options={{ title: "Profilo" }}
      />
    </Tab.Navigator>
  );
}
