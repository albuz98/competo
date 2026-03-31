import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { forgotPassword } from "../../api/auth";
import { styles } from "./ForgotPassword.styles";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import AuthErrorBox from "../../components/AuthErrorBox/AuthErrorBox";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";
import { ButtonEnum } from "../../types/components";
import { ButtonFullColored, ButtonLink } from "../../components/Button/Button";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

export default function ForgotPassword({ navigation }: Props) {
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
    <AuthLayout onClose={() => navigation.goBack()}>
      {sent ? (
        <View style={styles.successContainer}>
          <Ionicons
            name="mail-outline"
            size={64}
            color="rgba(255,255,255,0.9)"
            style={{ alignSelf: "center" }}
          />
          <Text style={styles.cardTitle}>Email inviata!</Text>
          <Text style={styles.successText}>
            Abbiamo inviato un link per reimpostare la password a{"\n"}
            <Text style={styles.successEmail}>{email}</Text>
          </Text>
          <Text style={styles.successHint}>
            Controlla la tua casella di posta e la cartella spam.
          </Text>
          <ButtonFullColored
            text="Torna al login"
            handleBtn={() => navigation.navigate("Login", {})}
          />
        </View>
      ) : (
        <>
          <Text style={styles.cardTitle}>Password dimenticata?</Text>
          <Text style={styles.cardSubtitle}>
            Inserisci la tua email e ti invieremo un link per reimpostare la
            password.
          </Text>

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
            returnKeyType="done"
            onSubmitEditing={handleSend}
          />

          <ButtonFullColored
            text="Invia link di reset"
            handleBtn={handleSend}
            isDisabled={!isValid || loading}
            loading={loading}
          />

          <ButtonLink
            text="Torna al login"
            handleBtn={() => navigation.goBack()}
          />
        </>
      )}

      <CompetoLogo />
    </AuthLayout>
  );
}
