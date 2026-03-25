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
import { styles } from "../styles/RegisterScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register, loading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Auto-format GG/MM/AAAA as the user types
  const handleDateChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDateOfBirth(formatted);
  };

  const isDobValid = /^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth);
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const isValid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    username.length >= 3 &&
    email.includes("@") &&
    isDobValid &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleRegister = async () => {
    if (!isValid) return;
    clearError();
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username,
        email,
        dateOfBirth,
        password,
      });
      navigation.replace("Onboarding");
    } catch {
      // error displayed from context
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
              <Text style={styles.cardTitle}>Crea account</Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Text style={styles.label}>NOME</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Mario"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

              <Text style={styles.label}>COGNOME</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Rossi"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="mariorossi99"
                autoCapitalize="none"
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

              <Text style={styles.label}>DATA DI NASCITA</Text>
              <TextInput
                style={styles.input}
                value={dateOfBirth}
                onChangeText={handleDateChange}
                placeholder="GG/MM/AAAA"
                keyboardType="number-pad"
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
                maxLength={10}
              />

              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Minimo 6 caratteri"
                secureTextEntry
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

              <Text style={styles.label}>CONFERMA PASSWORD</Text>
              <TextInput
                style={[styles.input, passwordMismatch && styles.inputError]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Ripeti la password"
                secureTextEntry
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              {passwordMismatch && (
                <Text style={styles.fieldError}>Le password non coincidono</Text>
              )}

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
                  <Text style={styles.signUpBtnText}>Registrati</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkBtn}>
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.replace("Login", {})}
                >
                  Hai già un account? Accedi
                </Text>
              </TouchableOpacity>

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

