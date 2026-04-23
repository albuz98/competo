import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, NavigationEnum } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { ButtonBack } from "../../components/core/Button/Button";
import { InputBox } from "../../components/core/InputBox/InputBox";
import { styles } from "./TwoFactorAuth.styles";

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function TwoFactorAuth() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [mockCode, setMockCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const phoneIsValid = phone.replace(/\s/g, "").length >= 9;

  const handleSend = () => {
    const code = generateCode();
    setMockCode(code);
    setCodeSent(true);
    setCodeInput("");
  };

  const handleVerify = () => {
    if (codeInput.trim() === mockCode) {
      Alert.alert(
        "Autenticazione a due fattori aggiunta",
        "Il tuo numero è stato verificato con successo.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate(NavigationEnum.SETTINGS),
          },
        ],
      );
    } else {
      Alert.alert("Codice non corrispondente", "Riprova con il codice corretto.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.header}>
          <ButtonBack
            handleBtn={() => navigation.navigate(NavigationEnum.SETTINGS)}
            isArrowBack={false}
          />
          <Text style={styles.headerTitle}>Autenticazione a 2 fattori</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Verifica il numero di cellulare</Text>
            <Text style={styles.cardSub}>
              Inserisci il tuo numero di cellulare. Ti invieremo un codice
              univoco per attivare la verifica in due passaggi.
            </Text>

            <Text style={styles.label}>Numero di cellulare</Text>
            <InputBox
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                if (codeSent) {
                  setCodeSent(false);
                  setMockCode("");
                  setCodeInput("");
                }
              }}
              placeholder="+39 333 000 0000"
              isDark={false}
              keyboardType="phone-pad"
            />

            <Pressable
              style={[styles.sendBtn, !phoneIsValid && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!phoneIsValid}
            >
              <Text
                style={[
                  styles.sendBtnText,
                  !phoneIsValid && styles.sendBtnTextDisabled,
                ]}
              >
                {codeSent ? "Rinvia codice" : "Invia codice"}
              </Text>
            </Pressable>
          </View>

          {codeSent && (
            <View style={styles.card}>
              <View style={styles.mockSmsBox}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={colors.darkBlue}
                />
                <Text style={styles.mockSmsText}>
                  {"SMS simulato inviato a "}
                  <Text style={{ fontWeight: "700" }}>{phone}</Text>
                  {"\nIl tuo codice Competo è: "}
                  <Text style={styles.mockSmsCode}>{mockCode}</Text>
                </Text>
              </View>

              <Text style={styles.label}>Inserisci il codice ricevuto</Text>
              <InputBox
                value={codeInput}
                onChangeText={setCodeInput}
                placeholder="000000"
                isDark={false}
                keyboardType="number-pad"
              />

              <Pressable
                style={[
                  styles.verifyBtn,
                  codeInput.length < 6 && styles.verifyBtnDisabled,
                ]}
                onPress={handleVerify}
                disabled={codeInput.length < 6}
              >
                <Text style={styles.verifyBtnText}>Verifica</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
