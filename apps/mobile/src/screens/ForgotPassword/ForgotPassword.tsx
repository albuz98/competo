import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { forgotPassword } from "../../api/auth";
import { styles } from "./ForgotPassword.styles";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import AuthErrorBox from "../../components/AuthErrorBox/AuthErrorBox";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";

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
    <AuthLayout onBack={() => navigation.goBack()}>
      {sent ? (
        <View style={styles.successContainer}>
          <Ionicons
            name="mail-outline"
            size={64}
            color="rgba(255,255,255,0.9)"
          />
          <Text style={styles.cardTitle}>Email inviata!</Text>
          <Text style={styles.successText}>
            Abbiamo inviato un link per reimpostare la password a{"\n"}
            <Text style={styles.successEmail}>{email}</Text>
          </Text>
          <Text style={styles.successHint}>
            Controlla la tua casella di posta e la cartella spam.
          </Text>
          <TouchableOpacity
            style={styles.backToLoginBtn}
            onPress={() => navigation.navigate("Login", {})}
            activeOpacity={0.85}
          >
            <Text style={styles.backToLoginText}>Torna al login</Text>
          </TouchableOpacity>
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

          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!isValid || loading) && styles.sendBtnDisabled,
            ]}
            onPress={handleSend}
            disabled={!isValid || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#E8601A" />
            ) : (
              <Text style={styles.sendBtnText}>Invia link di reset</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>Torna al login</Text>
          </TouchableOpacity>
        </>
      )}

      <CompetoLogo />
    </AuthLayout>
  );
}
