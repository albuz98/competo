import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { ChatMessage } from "../../types/chat";
import { fetchChatMessages, sendChatMessage } from "../../api/chats";
import { queryKeys } from "../../lib/queryKeys";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import { cd } from "./ChatDetail.styled";

type ChatDetailRouteProp = RouteProp<
  RootStackParamList,
  NavigationEnum.CHAT_DETAIL
>;

export default function ChatDetail() {
  const navigation = useNavigation();
  const route = useRoute<ChatDetailRouteProp>();
  const { chatId, chatName, tournamentName } = route.params;
  const { user } = useAuth();
  const qc = useQueryClient();

  const [inputText, setInputText] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: queryKeys.chatMessages(chatId),
    queryFn: () => fetchChatMessages(chatId, user?.token ?? ""),
    enabled: !!user,
  });

  const { mutate: doSend, isPending: sending } = useMutation({
    mutationFn: (text: string) =>
      sendChatMessage(chatId, text, user?.token ?? ""),
    onSuccess: (newMsg) => {
      qc.setQueryData<ChatMessage[]>(queryKeys.chatMessages(chatId), (prev) => [
        ...(prev ?? []),
        newMsg,
      ]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    },
  });

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || sending) return;
    setInputText("");
    doSend(text);
  }, [inputText, sending, doSend]);

  return (
    <SafeAreaView style={cd.root} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={cd.header}>
        <Pressable style={cd.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.dark} />
        </Pressable>
        <View style={cd.headerInfo}>
          <Text style={cd.headerName}>{chatName}</Text>
          <Text style={cd.headerSub}>{tournamentName}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            style={cd.messageList}
            contentContainerStyle={cd.messageListContent}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: false })
            }
            renderItem={({ item }) => (
              <View style={item.fromMe ? cd.bubbleWrapMe : cd.bubbleWrap}>
                <View style={item.fromMe ? cd.bubbleMe : cd.bubble}>
                  <Text style={item.fromMe ? cd.bubbleTextMe : cd.bubbleText}>
                    {item.text}
                  </Text>
                  <Text style={item.fromMe ? cd.bubbleTimeMe : cd.bubbleTime}>
                    {item.time}
                  </Text>
                </View>
              </View>
            )}
          />
        )}

        {/* Input bar */}
        <View style={cd.inputBar}>
          <TextInput
            style={cd.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Scrivi un messaggio..."
            placeholderTextColor={colors.placeholder}
            multiline
            returnKeyType="default"
            editable={!sending}
          />
          <Pressable
            style={
              inputText.trim() && !sending ? cd.sendBtn : cd.sendBtnDisabled
            }
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={colors.grayDark} />
            ) : (
              <Ionicons
                name="send"
                size={18}
                color={inputText.trim() ? colors.white : colors.grayDark}
              />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
