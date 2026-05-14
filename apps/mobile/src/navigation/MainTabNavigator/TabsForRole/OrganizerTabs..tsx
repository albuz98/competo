import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  MainTabOrganizerParamList,
  NavigationEnum,
} from "../../../types/navigation";
import { useNotifications } from "../../../context/NotificationsContext";
import Profile from "../../../screens/Profile/Profile";
import { colors } from "../../../theme/colors";
import { View } from "react-native";
import { styles } from "../MainTabNavigator.styles";
import Notifications from "../../../screens/Notifications/Notifications";
import Home from "../../../screens/Home/Home";
import { TAB_ICONS } from "../../../constants/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Wallet } from "../../../screens/Wallet/Wallet";
import { StatsOrganizer } from "../../../screens/StatsOrganizer/StatsOrganizer";

const Tab = createBottomTabNavigator<MainTabOrganizerParamList>();

export const OrganizerTabs = () => {
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
        name={NavigationEnum.WALLET}
        component={Wallet}
        options={{ title: NavigationEnum.WALLET }}
      />
      <Tab.Screen
        name={NavigationEnum.STATS_ORGANIZER}
        component={StatsOrganizer}
        options={{ title: NavigationEnum.STATS_ORGANIZER }}
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
