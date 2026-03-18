import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  topArea: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backArrow: { color: "#fff", fontSize: 20, lineHeight: 24 },
  backText: { color: "#fff", fontSize: 15, fontWeight: "500" },
  card: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  cardContent: { padding: 28, paddingBottom: 40, flexGrow: 1 },
  cardTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    marginTop: 8,
  },
  cardSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#fff", fontSize: 13, textAlign: "center" },
  label: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#fff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  sendBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    elevation: 4,
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendBtnText: { color: "#E8601A", fontSize: 16, fontWeight: "800" },
  linkBtn: { alignItems: "center", marginBottom: 8 },
  linkText: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  // Success state
  successContainer: { alignItems: "center", paddingTop: 16 },
  successText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
  successEmail: { fontWeight: "800", color: "#fff" },
  successHint: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
  backToLoginBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 28,
    elevation: 4,
  },
  backToLoginText: { color: "#E8601A", fontSize: 16, fontWeight: "800" },
  logoArea: { alignItems: "center", marginTop: 32 },
  logoText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
    fontStyle: "italic",
  },
  logoTagline: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "600",
    marginTop: 2,
  },
});
