import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
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
import { RootStackParamList } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { signUpForTournament } from "../../api/tournaments";
import { styles } from "./Payment.styles";
import { ButtonFullColored, ButtonIcon } from "../../components/Button/Button";
import { colorGradient, colors } from "../../theme/colors";
import { InputBox } from "../../components/InputBox/InputBox";

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
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topArea}>
          <ButtonIcon
            handleBtn={() => navigation.goBack()}
            icon={<Ionicons name="close" size={26} color={colors.white} />}
            style={styles.closeBtn}
          />
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
                  <Ionicons
                    name="people-outline"
                    size={13}
                    color={colors.primaryGradientMid}
                  />
                  <Text style={styles.teamBadgeText}>{teamName}</Text>
                </View>
              )}

              <View style={styles.feeBadge}>
                <Ionicons
                  name="trophy-outline"
                  size={14}
                  color={colors.primaryGradientMid}
                />
                <Text style={styles.feeText}>{entryFee}</Text>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Text style={styles.label}>NOME SULLA CARTA</Text>
              <InputBox
                value={name}
                onChangeText={setName}
                placeholder="Mario Rossi"
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Text style={styles.label}>NUMERO CARTA</Text>
              <InputBox
                value={cardNumber}
                onChangeText={(t: string) => setCardNumber(formatCardNumber(t))}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                returnKeyType="next"
              />

              <View style={styles.splitRow}>
                <View style={styles.half}>
                  <Text style={styles.label}>SCADENZA</Text>
                  <InputBox
                    value={expiry}
                    onChangeText={(t: string) => setExpiry(formatExpiry(t))}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>CVV</Text>
                  <InputBox
                    value={cvv}
                    onChangeText={(t: string) =>
                      setCvv(t.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    keyboardType="numeric"
                    secureTextEntry
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
                  color={colors.grayOpacized}
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
