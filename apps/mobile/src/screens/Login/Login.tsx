import React, { useState, useLayoutEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types";
import { useAuth } from "../../context/AuthContext";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";
import AuthErrorBox from "../../components/AuthErrorBox/AuthErrorBox";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import { styles } from "./Login.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation, route }: Props) {
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
    <AuthLayout
      onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
    >
      <Text style={styles.cardTitle}>Login</Text>
      <Text style={styles.cardSubtitle}>Sign in to continue.</Text>

      {error && <AuthErrorBox message={error} />}

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

      <CompetoLogo />
    </AuthLayout>
  );
}
