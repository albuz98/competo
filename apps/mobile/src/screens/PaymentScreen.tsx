import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { signUpForTournament } from "../api/tournaments";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Payment">;
type Method = "card" | "paypal";

function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

export default function PaymentScreen({ navigation, route }: Props) {
  const { tournamentId, entryFee, tournamentName, teamId, teamName } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [method, setMethod] = useState<Method>("card");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  // PayPal field
  const [ppEmail, setPpEmail] = useState("");

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

  const isPayPalValid = ppEmail.includes("@") && ppEmail.includes(".");

  const isValid = method === "card" ? isCardValid : isPayPalValid;

  const handlePay = async () => {
    if (!isValid || !user) return;
    setLoading(true);
    setError(null);
    try {
      await signUpForTournament(tournamentId, user.token, teamId);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: "MainTabs" },
            { name: "TournamentDetail", params: { tournamentId, justRegistered: true } },
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
            colors={["#E8601A", "#F5A020"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.card}
          >
            <ScrollView
              contentContainerStyle={[styles.cardContent, { paddingBottom: insets.bottom + 24 }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.cardTitle}>Pagamento</Text>
              <Text style={styles.cardSubtitle} numberOfLines={2}>{tournamentName}</Text>
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

              {/* ── Method selector ── */}
              <View style={styles.methodRow}>
                <TouchableOpacity
                  style={[styles.methodBtn, method === "card" && styles.methodBtnActive]}
                  onPress={() => { setMethod("card"); setError(null); }}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="card-outline"
                    size={16}
                    color={method === "card" ? "#E8601A" : "rgba(255,255,255,0.7)"}
                  />
                  <Text style={[styles.methodBtnText, method === "card" && styles.methodBtnTextActive]}>
                    Carta
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.methodBtn, method === "paypal" && styles.methodBtnActive]}
                  onPress={() => { setMethod("paypal"); setError(null); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.paypalP, method === "paypal" && styles.paypalPActive]}>
                    P
                  </Text>
                  <Text style={[styles.methodBtnText, method === "paypal" && styles.methodBtnTextActive]}>
                    PayPal
                  </Text>
                </TouchableOpacity>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* ── Card form ── */}
              {method === "card" && (
                <>
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
                        onChangeText={(t) => setCvv(t.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        keyboardType="numeric"
                        secureTextEntry
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        returnKeyType="done"
                        onSubmitEditing={handlePay}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* ── PayPal form ── */}
              {method === "paypal" && (
                <>
                  <View style={styles.paypalBox}>
                    <Text style={styles.paypalBoxTitle}>
                      <Text style={styles.paypalBlue}>Pay</Text>
                      <Text style={styles.paypalDark}>Pal</Text>
                    </Text>
                    <Text style={styles.paypalBoxSub}>
                      Inserisci l'email del tuo account PayPal
                    </Text>
                  </View>

                  <Text style={styles.label}>EMAIL PAYPAL</Text>
                  <TextInput
                    style={styles.input}
                    value={ppEmail}
                    onChangeText={setPpEmail}
                    placeholder="mario@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    returnKeyType="done"
                    onSubmitEditing={handlePay}
                  />
                </>
              )}

              <TouchableOpacity
                style={[styles.payBtn, (!isValid || loading) && styles.payBtnDisabled]}
                onPress={handlePay}
                disabled={!isValid || loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#E8601A" />
                ) : (
                  <Text style={styles.payBtnText}>
                    {method === "paypal" ? `Paga con PayPal  ${entryFee}` : `Paga  ${entryFee}`}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.secureRow}>
                <Ionicons name="lock-closed" size={12} color="rgba(255,255,255,0.6)" />
                <Text style={styles.secureText}>Pagamento sicuro e crittografato</Text>
              </View>

              <View style={styles.logoArea}>
                <Text style={styles.logoText}>Competo</Text>
                <Text style={styles.logoTagline}>ORGANIZZA. COMPETI. VINCI.</Text>
              </View>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },
  flex: { flex: 1 },

  topArea: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backArrow: { color: "#fff", fontSize: 20, lineHeight: 24 },
  backText: { color: "#fff", fontSize: 15, fontWeight: "500" },

  card: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: "hidden" },
  cardContent: { padding: 28, flexGrow: 1 },

  cardTitle: { color: "#fff", fontSize: 34, fontWeight: "800", textAlign: "center", marginBottom: 6 },
  cardSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 14, textAlign: "center", marginBottom: 12 },

  teamBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "center",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 8,
  },
  teamBadgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  feeBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#fff", alignSelf: "center",
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginBottom: 20,
  },
  feeText: { color: "#E8601A", fontWeight: "800", fontSize: 16 },

  // Method selector
  methodRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  methodBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 12,
  },
  methodBtnActive: { backgroundColor: "#fff" },
  methodBtnText: { fontSize: 14, fontWeight: "700", color: "rgba(255,255,255,0.75)" },
  methodBtnTextActive: { color: "#E8601A" },
  paypalP: { fontSize: 15, fontWeight: "900", color: "rgba(255,255,255,0.75)", fontStyle: "italic" },
  paypalPActive: { color: "#003087" },

  // PayPal box
  paypalBox: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  paypalBoxTitle: { fontSize: 28, fontWeight: "900", marginBottom: 6 },
  paypalBlue: { color: "#009CDE" },
  paypalDark: { color: "#003087" },
  paypalBoxSub: { color: "rgba(255,255,255,0.7)", fontSize: 13, textAlign: "center" },

  errorBox: { backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: "#fff", fontSize: 13, textAlign: "center" },

  label: {
    color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: "700",
    letterSpacing: 1, marginBottom: 6, marginTop: 4,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.18)", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: "#fff", marginBottom: 16,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
  },
  splitRow: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },

  payBtn: {
    backgroundColor: "#fff", borderRadius: 50,
    paddingVertical: 16, alignItems: "center",
    marginTop: 8, marginBottom: 16, elevation: 4,
  },
  payBtnDisabled: { opacity: 0.6 },
  payBtnText: { color: "#E8601A", fontSize: 16, fontWeight: "800" },

  secureRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 5, marginBottom: 20,
  },
  secureText: { color: "rgba(255,255,255,0.6)", fontSize: 12 },

  logoArea: { alignItems: "center", marginTop: 8 },
  logoText: { color: "#fff", fontSize: 26, fontWeight: "900", letterSpacing: 1, fontStyle: "italic" },
  logoTagline: { color: "rgba(255,255,255,0.7)", fontSize: 9, letterSpacing: 2, fontWeight: "600", marginTop: 2 },
});
