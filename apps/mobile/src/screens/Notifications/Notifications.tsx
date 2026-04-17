import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AppNotification,
  useNotifications,
} from "../../context/NotificationsContext";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { styles } from "./Notifications.styles";
import { ButtonGeneric, ButtonLink } from "../../components/core/Button/Button";
import { colors } from "../../theme/colors";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function NotifItem({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: () => void;
}) {
  return (
    <ButtonGeneric
      handleBtn={onPress}
      style={[styles.item, !item.read && styles.itemUnread]}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.dot, item.read && styles.dotRead]} />
      </View>
      <View style={styles.itemBody}>
        <Text
          style={[styles.itemTitle, !item.read && styles.itemTitleUnread]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.itemText} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.itemDate}>{formatDate(item.timestamp)}</Text>
      </View>
    </ButtonGeneric>
  );
}

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Notifiche</Text>
        {unreadCount > 0 && (
          <ButtonLink
            text="Segna tutte come lette"
            handleBtn={markAllAsRead}
            isColored
            isBold
            style={{ marginTop: 10 }}
          />
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          return (
            <NotifItem
              item={item}
              onPress={() => {
                markAsRead(item.id);
                if (item.tournamentId) {
                  navigation.navigate(NavigationEnum.TOURNAMENT_DETAIL, {
                    tournamentId: item.tournamentId,
                  });
                } else if (item.teamId) {
                  navigation.navigate(NavigationEnum.TEAMS);
                }
              }}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="notifications-off-outline"
              size={52}
              color={colors.grayDark}
            />
            <Text style={styles.emptyText}>Nessuna notifica</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
