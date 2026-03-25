import React, { useState, useLayoutEffect } from "react";
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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/LoginScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation, route }: Props) {
  const { redirect, tournamentId } = route.params ?? {};
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const isValid = email.includes("@") && password.length >= 1;

  const handleLogin = async () => {
    if (!isValid) return;
    clearError();
    try {
      await login({ email, password });
      if (redirect === "tournament" && tournamentId) {
        navigation.replace("TournamentDetail", { tournamentId });
      } else {
        navigation.replace("MainTabs");
      }
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
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
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
              <Text style={styles.cardTitle}>Login</Text>
              <Text style={styles.cardSubtitle}>Sign in to continue.</Text>

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
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                style={[
                  styles.signInBtn,
                  (!isValid || loading) && styles.signInBtnDisabled,
                ]}
                onPress={handleLogin}
                disabled={!isValid || loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#E8601A" />
                ) : (
                  <Text style={styles.signInBtnText}>Accedi</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkBtn}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.replace("Register")}
                style={styles.linkBtn}
              >
                <Text style={styles.linkText}>Signup!</Text>
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

