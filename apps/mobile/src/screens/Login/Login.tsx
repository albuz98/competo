import React, { useState, useLayoutEffect } from "react";
import { Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  NavigationEnum,
  type RootStackParamList,
} from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import CompetoLogo from "../../components/core/CompetoLogo/CompetoLogo";
import AuthErrorBox from "../../components/core/AuthErrorBox/AuthErrorBox";
import AuthLayout from "../../components/core/AuthLayout/AuthLayout";
import { styles } from "./Login.styles";
import { DividerAccess } from "../../components/core/DividerAccess/DividerAccess";
import {
  ButtonBorderColored,
  ButtonFullColored,
  ButtonLink,
} from "../../components/core/Button/Button";
import { InputBox } from "../../components/core/InputBox/InputBox";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation, route }: Props) {
  const { redirect, tournamentId } = route.params ?? {};
  const { login, loading, error, clearError } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const isValid = identifier.length >= 1 && password.length >= 1;

  const handleLogin = async () => {
    if (!isValid) return;
    clearError();
    try {
      await login({ identifier, password });
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

      <ButtonBorderColored text={"Continua con Google"} handleBtn={() => {}} />

      <DividerAccess />

      <Text style={styles.label}>EMAIL O USERNAME</Text>
      <InputBox
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="hello@gmail.com o mariorossi99"
        autoCapitalize="none"
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

      {error && <AuthErrorBox message={error} />}

      <ButtonLink
        text={"Forgot Password?"}
        handleBtn={() => navigation.navigate(NavigationEnum.FORGOT_PASSWORD)}
      />

      <ButtonLink
        text={"Non hai l'utenza? Registrati!"}
        handleBtn={() => {
          navigation.replace(NavigationEnum.REGISTER);
          clearError();
        }}
      />

      <CompetoLogo />
    </AuthLayout>
  );
}
