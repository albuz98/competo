import React, { useState, useLayoutEffect } from "react";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types";
import { useAuth } from "../../context/AuthContext";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";
import AuthErrorBox from "../../components/AuthErrorBox/AuthErrorBox";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import { styles } from "./Login.styles";
import Button from "../../components/Button/Button";
import InputBox from "../../components/InputBox/InputBox";
import { ButtonEnum } from "../../types/components";
import { DividerAccess } from "../../components/DividerAccess/DividerAccess";

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
    <AuthLayout onClose={() => navigation.replace("ChoseAccess")}>
      <Text style={styles.cardTitle}>Accedi</Text>

      {error && <AuthErrorBox message={error} />}

      <Button
        text={"Continua con Google"}
        variant={ButtonEnum.THIRD}
        handleBtn={() => {}}
      />

      <DividerAccess />

      <Text style={styles.label}>EMAIL</Text>
      <InputBox
        value={email}
        setValue={setEmail}
        placeholder="hello@gmail.com"
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="next"
      />

      <Text style={styles.label}>PASSWORD</Text>
      <InputBox
        value={password}
        setValue={setPassword}
        placeholder="••••••"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
        secureTextEntry
      />

      <Button
        text={"Accedi"}
        handleBtn={handleLogin}
        isDisabled={!isValid || loading}
        loading={loading}
      />

      <Button
        text={"Forgot Password?"}
        handleBtn={() => navigation.navigate("ForgotPassword")}
        isLink
      />

      <Button
        text={"Signup!"}
        handleBtn={() => navigation.replace("Register")}
        isLink
      />

      <CompetoLogo />
    </AuthLayout>
  );
}
