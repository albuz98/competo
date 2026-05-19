import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { RootStackParamList, NavigationEnum } from "../../types/navigation";
import { Chat } from "../../types/chat";
import { fetchChats } from "../../api/chats";
import { queryKeys } from "../../lib/queryKeys";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import { mg } from "./Messaggi.styled";

export default function Messaggi() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const { data: chats = [], isLoading } = useQuery<Chat[]>({
    queryKey: queryKeys.chats(),
    queryFn: () => fetchChats(user?.token ?? ""),
    enabled: !!user,
  });

  return (
    <SafeAreaView style={mg.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={mg.header}>
        <Text style={mg.headerTitle}>Messaggi</Text>
      </View>

      {isLoading ? (
        <View style={mg.empty}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          style={mg.list}
          data={chats}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Pressable
              style={mg.row}
              onPress={() =>
                navigation.navigate(NavigationEnum.CHAT_DETAIL, {
                  chatId: item.id,
                  chatName: item.name,
                  tournamentName: item.tournamentName,
                })
              }
            >
              <View style={mg.avatarWrap}>
                <View style={[mg.avatar, { backgroundColor: item.avatarBg }]}>
                  <Text style={mg.avatarText}>{item.avatar}</Text>
                </View>
                <View
                  style={[
                    mg.dot,
                    {
                      backgroundColor: item.unread
                        ? colors.success
                        : colors.grayDark,
                    },
                  ]}
                />
              </View>
              <View style={mg.info}>
                <Text style={mg.chatName}>{item.name}</Text>
                <Text
                  style={item.unread ? mg.lastMsg : mg.lastMsgRead}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
              </View>
              <Text style={mg.time}>{item.time}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={mg.empty}>
              <Text style={{ fontSize: 32 }}>💬</Text>
              <Text style={mg.emptyText}>Nessun messaggio ancora</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
