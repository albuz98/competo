import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { signUpForTournament } from "../../api/tournaments";
import { styles } from "./Payment.styles";
import { ButtonFullColored } from "../../components/Button/Button";
import { colorGradient } from "../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Payment">;

function formatCardNumber(raw: string) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

export default function PaymentScreen({ navigation, route }: Props) {
  const { tournamentId, entryFee, tournamentName, teamId, teamName } =
    route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const isCardValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    name.trim().length > 0;

  const handlePay = async () => {
    if (!isCardValid || !user) return;
    setLoading(true);
    setError(null);
    try {
      await signUpForTournament(tournamentId, user.token, teamId);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: "MainTabs" },
            {
              name: "TournamentDetail",
              params: { tournamentId, justRegistered: true },
            },
          ],
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Pagamento fallito. Riprova.");
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
            colors={colorGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.card}
          >
            <ScrollView
              contentContainerStyle={[
                styles.cardContent,
                { paddingBottom: insets.bottom + 24 },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.cardTitle}>Pagamento</Text>
              <Text style={styles.cardSubtitle} numberOfLines={2}>
                {tournamentName}
              </Text>
              {teamName && (
                <View style={styles.teamBadge}>
                  <Ionicons name="people-outline" size={13} color="#E8601A" />
                  <Text style={styles.teamBadgeText}>{teamName}</Text>
                </View>
              )}

              <View style={styles.feeBadge}>
                <Ionicons name="trophy-outline" size={14} color="#E8601A" />
                <Text style={styles.feeText}>{entryFee}</Text>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Text style={styles.label}>NOME SULLA CARTA</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Mario Rossi"
                autoCapitalize="words"
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

              <Text style={styles.label}>NUMERO CARTA</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                placeholderTextColor="rgba(255,255,255,0.5)"
                returnKeyType="next"
              />

              <View style={styles.splitRow}>
                <View style={styles.half}>
                  <Text style={styles.label}>SCADENZA</Text>
                  <TextInput
                    style={styles.input}
                    value={expiry}
                    onChangeText={(t) => setExpiry(formatExpiry(t))}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={(t) =>
                      setCvv(t.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    keyboardType="numeric"
                    secureTextEntry
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    returnKeyType="done"
                    onSubmitEditing={handlePay}
                  />
                </View>
              </View>

              <ButtonFullColored
                text={`Paga  ${entryFee}`}
                handleBtn={handlePay}
                isDisabled={!isCardValid || loading}
                loading={loading}
              />

              <View style={styles.secureRow}>
                <Ionicons
                  name="lock-closed"
                  size={12}
                  color="rgba(255,255,255,0.6)"
                />
                <Text style={styles.secureText}>
                  Pagamento sicuro e crittografato
                </Text>
              </View>

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
