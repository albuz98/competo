import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import {
  useNotifications,
  type AppNotification,
} from "../context/NotificationsContext";
import { styles } from "../styles/NotificheScreen.styles";

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
    <TouchableOpacity
      style={[styles.item, !item.read && styles.itemUnread]}
      onPress={onPress}
      activeOpacity={0.75}
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
    </TouchableOpacity>
  );
}

export default function NotificheScreen() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.header}>Notifiche</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7}>
            <Text style={styles.readAll}>Segna tutte come lette</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <NotifItem
            item={item}
            onPress={() => {
              markAsRead(item.id);
              if (item.tournamentId) {
                navigation.navigate("TournamentDetail", { tournamentId: item.tournamentId });
              }
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="notifications-off-outline"
              size={52}
              color="#e2e8f0"
            />
            <Text style={styles.emptyText}>Nessuna notifica</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

