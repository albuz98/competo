import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { forgotPassword } from "../api/auth";
import { styles } from "../styles/ForgotPasswordScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = email.includes("@") && email.includes(".");

  const handleSend = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore durante l'invio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topArea}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <LinearGradient
            colors={["#E8601A", "#F5A020"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.card}
          >
            <ScrollView
              contentContainerStyle={styles.cardContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {sent ? (
                <View style={styles.successContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={64}
                    color="rgba(255,255,255,0.9)"
                  />
                  <Text style={styles.cardTitle}>Email inviata!</Text>
                  <Text style={styles.successText}>
                    Abbiamo inviato un link per reimpostare la password a{"\n"}
                    <Text style={styles.successEmail}>{email}</Text>
                  </Text>
                  <Text style={styles.successHint}>
                    Controlla la tua casella di posta e la cartella spam.
                  </Text>
                  <TouchableOpacity
                    style={styles.backToLoginBtn}
                    onPress={() => navigation.navigate("Login", {})}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.backToLoginText}>Torna al login</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={styles.cardTitle}>Password dimenticata?</Text>
                  <Text style={styles.cardSubtitle}>
                    Inserisci la tua email e ti invieremo un link per
                    reimpostare la password.
                  </Text>

                  {error && (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <Text style={styles.label}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="hello@gmail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    returnKeyType="done"
                    onSubmitEditing={handleSend}
                  />

                  <TouchableOpacity
                    style={[
                      styles.sendBtn,
                      (!isValid || loading) && styles.sendBtnDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!isValid || loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#E8601A" />
                    ) : (
                      <Text style={styles.sendBtnText}>Invia link di reset</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.linkBtn}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={styles.linkText}>Torna al login</Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.logoArea}>
                <Text style={styles.logoText}>Competo</Text>
                <Text style={styles.logoTagline}>
                  ORGANIZZA. COMPETI. VINCI.
                </Text>
              </View>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

