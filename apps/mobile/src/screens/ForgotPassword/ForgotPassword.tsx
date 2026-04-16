import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api/auth";
import { styles } from "./ForgotPassword.styles";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import AuthErrorBox from "../../components/AuthErrorBox/AuthErrorBox";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";
import { ButtonFullColored, ButtonLink } from "../../components/Button/Button";
import { colors } from "../../theme/colors";
import { InputBox } from "../../components/InputBox/InputBox";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

export default function ForgotPassword({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValid = email.includes("@") && email.includes(".");

  const sendMutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onError: (e) => {
      setError(e instanceof Error ? e.message : "Errore durante l'invio");
    },
  });

  const handleSend = useCallback(() => {
    if (!isValid) return;
    setError(null);
    sendMutation.mutate();
  }, [isValid, email, sendMutation]);

  return (
    <AuthLayout onClose={() => navigation.goBack()}>
      {sendMutation.isSuccess ? (
        <View style={styles.successContainer}>
          <Ionicons
            name="mail-outline"
            size={64}
            color={colors.grayOpacized}
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
            handleBtn={() => navigation.navigate(NavigationEnum.LOGIN, {})}
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
          <InputBox
            value={email}
            onChangeText={setEmail}
            placeholder="hello@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={handleSend}
          />

          <ButtonFullColored
            text="Invia link di reset"
            handleBtn={handleSend}
            isDisabled={!isValid || sendMutation.isPending}
            loading={sendMutation.isPending}
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
