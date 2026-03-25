import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { styles } from "./EditProfile.styles";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

export default function EditProfile({ navigation }: Props) {
  const { user, location, updateProfile } = useAuth();

  const [username, setUsername] = useState(user?.username ?? "");
  const [locationVal, setLocationVal] = useState(location ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordMismatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword !== confirmPassword;

  const isValid =
    username.trim().length >= 2 &&
    (newPassword === "" ||
      (newPassword.length >= 6 && newPassword === confirmPassword));

  const handleSave = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      await updateProfile({
        username: username.trim(),
        location: locationVal.trim() || undefined,
        ...(newPassword ? { password: newPassword } : {}),
      });
      navigation.goBack();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Errore durante il salvataggio",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topArea}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <LinearGradient
            colors={["#E8601A", "#F5A020"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.card}
          >
            <ScrollView
              contentContainerStyle={styles.cardContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.cardTitle}>Modifica Profilo</Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="mariorossi99"
                autoCapitalize="none"
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputReadonly}>
                <Text style={styles.inputReadonlyText}>
                  {user?.email ?? ""}
                </Text>
              </View>

              <Text style={styles.label}>POSIZIONE</Text>
              <TextInput
                style={styles.input}
                value={locationVal}
                onChangeText={setLocationVal}
                placeholder="Es. Milano, Roma..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

              <Text style={styles.label}>NUOVA PASSWORD (opzionale)</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Lascia vuoto per non cambiare"
                secureTextEntry
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

              {newPassword.length > 0 && (
                <>
                  <Text style={styles.label}>CONFERMA PASSWORD</Text>
                  <TextInput
                    style={[
                      styles.input,
                      passwordMismatch && styles.inputError,
                    ]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Ripeti la password"
                    secureTextEntry
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                  />
                  {passwordMismatch && (
                    <Text style={styles.fieldError}>
                      Le password non coincidono
                    </Text>
                  )}
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  (!isValid || loading) && styles.saveBtnDisabled,
                ]}
                onPress={handleSave}
                disabled={!isValid || loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#E8601A" />
                ) : (
                  <Text style={styles.saveBtnText}>Salva modifiche</Text>
                )}
              </TouchableOpacity>

              <View style={styles.logoArea}>
                <Text style={styles.logoText}>Competo</Text>
                <Text style={styles.logoTagline}>
                  ORGANIZZA. COMPETI. VINCI.
                </Text>
              </View>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
