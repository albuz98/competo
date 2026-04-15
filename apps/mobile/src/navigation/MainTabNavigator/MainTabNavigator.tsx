import React from "react";
import { View } from "react-native";
import { styles } from "./MainTabNavigator.styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationEnum, type MainTabParamList } from "../../types";
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
  Explore: ["compass", "compass-outline"],
  Favorites: ["bookmark", "bookmark-outline"],
  Notifications: ["notifications", "notifications-outline"],
  Profile: ["person", "person-outline"],
};

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();

  return (
    <Tab.Navigator
      initialRouteName="Home"
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
          if (route.name === "Home") {
            return (
              <View style={styles.homeIconContainer}>
                <Ionicons
                  name={focused ? active : inactive}
                  size={size + 4}
                  color={focused ? styles.iconActive.color : color}
                />
              </View>
            );
          }
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
        name={NavigationEnum.FAVORITES}
        component={Favorites}
        options={{ title: NavigationEnum.FAVORITES }}
      />
      <Tab.Screen
        name={NavigationEnum.EXPLORE}
        component={Explore}
        options={{ title: NavigationEnum.EXPLORE }}
      />
      <Tab.Screen
        name={NavigationEnum.HOME}
        component={Home}
        options={{ title: NavigationEnum.HOME }}
      />
      <Tab.Screen
        name={NavigationEnum.NOTIFICATION}
        component={Notifications}
        options={{
          title: NavigationEnum.NOTIFICATION,
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
        name={NavigationEnum.PROFILE}
        component={Profile}
        options={{ title: NavigationEnum.PROFILE }}
      />
    </Tab.Navigator>
  );
}
