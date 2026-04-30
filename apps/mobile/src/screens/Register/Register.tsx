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
import { styles } from "./Register.styles";
import AuthLayout from "../../components/core/AuthLayout/AuthLayout";
import { DividerAccess } from "../../components/core/DividerAccess/DividerAccess";
import {
  ButtonBorderColored,
  ButtonFullColored,
  ButtonLink,
} from "../../components/core/Button/Button";
import { InputBox } from "../../components/core/InputBox/InputBox";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function Register({ navigation }: Props) {
  const { register, loading, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const passwordTooShort = password.length > 0 && password.length < 6;
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const isValid =
    username.length >= 3 &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleRegister = async () => {
    if (!isValid) return;
    clearError();
    try {
      await register({
        username,
        password,
      });
      navigation.replace(NavigationEnum.MAIN_TABS);
    } catch {
      // error displayed from context
    }
  };

  return (
    <AuthLayout onClose={() => navigation.replace(NavigationEnum.CHOSE_ACCESS)}>
      <Text style={styles.cardTitle}>Crea account</Text>

      <ButtonBorderColored text={"Continua con Google"} handleBtn={() => {}} />

      <DividerAccess />

      <Text style={styles.label}>USERNAME</Text>
      <InputBox
        value={username}
        onChangeText={setUsername}
        placeholder="mariorossi99"
        autoCapitalize="none"
        returnKeyType="next"
        autoCorrect={false}
      />

      <Text style={styles.label}>PASSWORD</Text>
      <InputBox
        value={password}
        onChangeText={setPassword}
        placeholder="Minimo 6 caratteri"
        returnKeyType="next"
        secureTextEntry
        textContentType="oneTimeCode"
        isError={passwordTooShort}
      />
      {passwordTooShort && (
        <Text style={styles.fieldError}>La password è troppo corta</Text>
      )}

      {password.length > 0 && (
        <>
          <Text style={styles.label}>CONFERMA PASSWORD</Text>
          <InputBox
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Ripeti la password"
            returnKeyType="done"
            secureTextEntry
            textContentType="oneTimeCode"
            onSubmitEditing={handleRegister}
            isError={passwordMismatch}
          />
          {passwordMismatch && (
            <Text style={styles.fieldError}>Le password non coincidono</Text>
          )}
        </>
      )}

      <ButtonFullColored
        text={"Registrati"}
        handleBtn={handleRegister}
        isDisabled={!isValid || loading}
        loading={loading}
      />

      {error && <AuthErrorBox message={error} />}

      <ButtonLink
        text="Hai già un account? Accedi"
        handleBtn={() => {
          navigation.navigate(NavigationEnum.LOGIN, {});
          clearError();
        }}
      />

      <CompetoLogo />
    </AuthLayout>
  );
}
