import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./AuthLayout.styles";
import { colors } from "../../theme/colors";

type Props = {
  children: React.ReactNode;
  onClose?: () => void;
};

export default function AuthLayout({ children, onClose }: Props) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topArea}>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <LinearGradient
            colors={[colors.primaryGradientEnd, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.card}
          >
            <ScrollView
              contentContainerStyle={styles.cardContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
