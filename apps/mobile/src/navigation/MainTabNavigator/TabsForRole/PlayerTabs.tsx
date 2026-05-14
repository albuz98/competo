import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  MainTabPlayerParamList,
  NavigationEnum,
} from "../../../types/navigation";
import Favorites from "../../../screens/Favorites/Favorites";
import { useNotifications } from "../../../context/NotificationsContext";
import Profile from "../../../screens/Profile/Profile";
import { colors } from "../../../theme/colors";
import { View } from "react-native";
import { styles } from "../MainTabNavigator.styles";
import Notifications from "../../../screens/Notifications/Notifications";
import Home from "../../../screens/Home/Home";
import Explore from "../../../screens/Explore/Explore";
import { TAB_ICONS } from "../../../constants/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator<MainTabPlayerParamList>();

export const PlayerTabs = () => {
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
};
