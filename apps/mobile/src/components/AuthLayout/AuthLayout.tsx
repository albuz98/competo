import React from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./AuthLayout.styles";
import { colorGradientReverse } from "../../theme/colors";
import { ButtonIcon } from "../Button/Button";

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
            <ButtonIcon
              handleBtn={onClose}
              icon={<Ionicons name="close" size={26} color="#fff" />}
              style={styles.closeBtn}
            />
          )}
        </View>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <LinearGradient
            colors={colorGradientReverse}
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
