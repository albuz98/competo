import React, { useState, useLayoutEffect } from "react";
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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register, loading, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const isValid =
    username.length >= 3 && email.includes("@") && password.length >= 6;

  const handleRegister = async () => {
    if (!isValid) return;
    clearError();
    try {
      await register({ username, email, password });
      navigation.navigate("TournamentList");
    } catch {
      // error displayed from context
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea}>
        {/* Black top area */}
        <View style={styles.topArea}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Sign Up</Text>
        </View>

        {/* Orange gradient card */}
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
              <Text style={styles.cardTitle}>Create new{"\n"}Account</Text>
              <Text style={styles.cardSubtitle}>
                Already Registered? Log in here.
              </Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Text style={styles.label}>NAME</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Alessio Trovato"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

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
                returnKeyType="next"
              />

              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                secureTextEntry
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <TouchableOpacity
                style={[
                  styles.signUpBtn,
                  (!isValid || loading) && styles.signUpBtnDisabled,
                ]}
                onPress={handleRegister}
                disabled={!isValid || loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#E8601A" />
                ) : (
                  <Text style={styles.signUpBtnText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkBtn}>
                <Text style={styles.linkText}>Already Have Account?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.replace("Login", {})}
                style={styles.linkBtn}
              >
                <Text style={styles.linkText}>Login !</Text>
              </TouchableOpacity>

              {/* Competo logo */}
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

  // Top black section
  topArea: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 80,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  backArrow: { color: "#fff", fontSize: 20, lineHeight: 24 },
  backText: { color: "#fff", fontSize: 15, fontWeight: "500" },
  topTitle: { color: "#fff", fontSize: 28, fontWeight: "800" },

  // Orange card
  card: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  cardContent: {
    padding: 28,
    paddingBottom: 40,
    flexGrow: 1,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 42,
  },
  cardSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
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

  signUpBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    elevation: 4,
  },
  signUpBtnDisabled: { opacity: 0.6 },
  signUpBtnText: {
    color: "#E8601A",
    fontSize: 16,
    fontWeight: "800",
  },

  linkBtn: { alignItems: "center", marginBottom: 8 },
  linkText: { color: "rgba(255,255,255,0.85)", fontSize: 14 },

  // Competo footer
  logoArea: { alignItems: "center", marginTop: 16 },
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
