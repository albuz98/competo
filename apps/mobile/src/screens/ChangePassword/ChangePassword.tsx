import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ButtonBack, ButtonLink } from "../../components/core/Button/Button";
import { InputBoxRow } from "../../components/core/InputBoxRow/InputBoxRow";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./ChangePassword.styled";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export const ChangePassword = () => {
  const navigation = useNavigation();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const { updateProfile } = useAuth();

  const handleSave = async () => {
    if (form.password.length === 0) {
      navigation.goBack();
      return;
    }
    if (form.password.length < 6) {
      Alert.alert(
        "Password troppo corta",
        "La password deve essere almeno 6 caratteri.",
      );
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert(
        "Password non coincidono",
        "Le password inserite non corrispondono.",
      );
      return;
    }

    setSaving(true);
    await updateProfile({ password: form.password });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cambia password</Text>
          <ButtonLink
            text={saving ? "..." : "FATTO"}
            handleBtn={handleSave}
            color={colors.primary}
            fontSize={16}
            isBold
            isColored
          />
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <InputBoxRow
              label="Nuova password"
              placeholder="Minimo 6 caratteri"
              value={form.password}
              onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
              secureTextEntry
              isLast={form.password.length === 0}
              error={
                form.password.length > 0 && form.password.length < 6
                  ? "La password è troppo corta"
                  : undefined
              }
            />
            {form.password.length > 0 && (
              <InputBoxRow
                label="Conferma password"
                value={form.confirmPassword}
                onChangeText={(v) =>
                  setForm((f) => ({ ...f, confirmPassword: v }))
                }
                secureTextEntry
                isLast
                error={
                  form.confirmPassword.length > 0 &&
                  form.password !== form.confirmPassword
                    ? "Le password non coincidono"
                    : undefined
                }
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
