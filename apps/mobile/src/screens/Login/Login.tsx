import React, { useState, useLayoutEffect } from "react";
import { Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigationEnum, type RootStackParamList } from "../../types";
import { useAuth } from "../../context/AuthContext";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";
import AuthErrorBox from "../../components/AuthErrorBox/AuthErrorBox";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import { styles } from "./Login.styles";
import InputBox from "../../components/InputBox/InputBox";
import { DividerAccess } from "../../components/DividerAccess/DividerAccess";
import {
  ButtonBorderColored,
  ButtonFullColored,
  ButtonLink,
} from "../../components/Button/Button";

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
        navigation.replace(NavigationEnum.TOURNAMENT_DETAIL, { tournamentId });
      } else {
        navigation.replace(NavigationEnum.MAIN_TABS);
      }
    } catch {
      // error displayed from context
    }
  };

  return (
    <AuthLayout onClose={() => navigation.replace(NavigationEnum.CHOSE_ACCESS)}>
      <Text style={styles.cardTitle}>Accedi</Text>

      {error && <AuthErrorBox message={error} />}

      <ButtonBorderColored text={"Continua con Google"} handleBtn={() => {}} />

      <DividerAccess />

      <Text style={styles.label}>EMAIL</Text>
      <InputBox
        value={email}
        onChangeText={setEmail}
        placeholder="hello@gmail.com"
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="next"
      />

      <Text style={styles.label}>PASSWORD</Text>
      <InputBox
        value={password}
        onChangeText={setPassword}
        placeholder="••••••"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
        secureTextEntry
      />

      <ButtonFullColored
        text={"Accedi"}
        handleBtn={handleLogin}
        isDisabled={!isValid || loading}
        loading={loading}
      />

      <ButtonLink
        text={"Forgot Password?"}
        handleBtn={() => navigation.navigate(NavigationEnum.FORGOT_PASSWORD)}
      />

      <ButtonLink
        text={"Signup!"}
        handleBtn={() => navigation.replace(NavigationEnum.REGISTER)}
      />

      <CompetoLogo />
    </AuthLayout>
  );
}
