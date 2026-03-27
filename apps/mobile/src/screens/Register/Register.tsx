import React, { useState, useLayoutEffect } from "react";
import { Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types";
import { useAuth } from "../../context/AuthContext";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";
import AuthErrorBox from "../../components/AuthErrorBox/AuthErrorBox";
import { styles } from "./Register.styles";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Button from "../../components/Button/Button";
import { ButtonEnum } from "../../types/components";
import { DividerAccess } from "../../components/DividerAccess/DividerAccess";
import InputBox from "../../components/InputBox/InputBox";
import LinkButton from "../../components/LinkButton/LinkButton";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function Register({ navigation }: Props) {
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
    if (digits.length > 4)
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2)
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDateOfBirth(formatted);
  };

  const isDobValid = /^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth);
  const passwordMismatch =
    confirmPassword.length > 5 && password !== confirmPassword;

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
      navigation.replace("MainTabs");
    } catch {
      // error displayed from context
    }
  };

  return (
    <AuthLayout onClose={() => navigation.replace("ChoseAccess")}>
      <Text style={styles.cardTitle}>Crea account</Text>

      {error && <AuthErrorBox message={error} />}

      <Button
        text={"Continua con Google"}
        variant={ButtonEnum.THIRD}
        handleBtn={() => {}}
      />

      <DividerAccess />

      <Text style={styles.label}>NOME</Text>
      <InputBox
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Mario"
        autoCapitalize="words"
        returnKeyType="next"
        autoCorrect={false}
      />

      <Text style={styles.label}>COGNOME</Text>
      <InputBox
        value={lastName}
        onChangeText={setLastName}
        placeholder="Rossi"
        autoCapitalize="words"
        returnKeyType="next"
        autoCorrect={false}
      />

      <Text style={styles.label}>USERNAME</Text>
      <InputBox
        value={username}
        onChangeText={setUsername}
        placeholder="mariorossi99"
        returnKeyType="next"
        autoCorrect={false}
      />

      <Text style={styles.label}>EMAIL</Text>
      <InputBox
        value={email}
        onChangeText={setEmail}
        placeholder="hello@gmail.com"
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="next"
      />

      <Text style={styles.label}>DATA DI NASCITA</Text>
      <InputBox
        value={dateOfBirth}
        onChangeText={handleDateChange}
        placeholder="GG/MM/AAAA"
        returnKeyType="next"
        autoCorrect={false}
        keyboardType="number-pad"
        maxLength={10}
      />

      <Text style={styles.label}>PASSWORD</Text>
      <InputBox
        value={password}
        onChangeText={setPassword}
        placeholder="Minimo 6 caratteri"
        returnKeyType="next"
        secureTextEntry
        textContentType="oneTimeCode"
      />
      {password.length < 6 && (
        <Text style={styles.fieldError}>La password è troppo corta</Text>
      )}

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

      <Button
        text={"Registrati"}
        handleBtn={handleRegister}
        isDisabled={!isValid || loading}
        loading={loading}
      />

      <LinkButton
        text="Hai già un account? Accedi"
        handleBtn={() => navigation.navigate("Login", {})}
      />

      <CompetoLogo />
    </AuthLayout>
  );
}
