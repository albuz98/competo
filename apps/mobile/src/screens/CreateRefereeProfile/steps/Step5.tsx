import React from "react";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s } from "../CreateRefereeProfile.styles";
import { colors } from "../../../theme/colors";
import type { RefereeAssociationKey } from "../../../constants/referee";

type Props = {
  firstName: string;
  lastName: string;
  association: RefereeAssociationKey;
  memberNumber: string;
  memberSection: string;
  sports: string[];
  categories: string[];
  refereeRoles: string[];
  baseRate: number;
  rateType: "partita" | "ora";
  travelAvailable: boolean;
  travelRatePerKm: number | undefined;
  maxTravelKm: number | undefined;
  consecutiveHoursRange: string | null;
  acceptTerms: boolean;
  setAcceptTerms: (v: boolean) => void;
  acceptPrivacy: boolean;
  setAcceptPrivacy: (v: boolean) => void;
};

export function Step5({
  firstName,
  lastName,
  association,
  memberNumber,
  memberSection,
  sports,
  categories,
  refereeRoles,
  baseRate,
  rateType,
  travelAvailable,
  travelRatePerKm,
  maxTravelKm,
  consecutiveHoursRange,
  acceptTerms,
  setAcceptTerms,
  acceptPrivacy,
  setAcceptPrivacy,
}: Props) {
  function travelLabel() {
    if (!travelAvailable) return "No";
    const parts: string[] = [];
    if (travelRatePerKm != null) parts.push(`€${travelRatePerKm}/km`);
    if (maxTravelKm === 0) parts.push("distanza illimitata");
    else if (maxTravelKm != null) parts.push(`max ${maxTravelKm} km`);
    return parts.length > 0 ? parts.join(" · ") : "Sì";
  }

  return (
    <>
      <Text style={s.sectionTitle}>Consensi</Text>
      <Text style={s.sectionSub}>
        Leggi e accetta i documenti prima di inviare la richiesta.
      </Text>

      <View style={s.summaryCard}>
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Nome</Text>
          <Text style={s.summaryVal}>
            {firstName} {lastName}
          </Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Associazione</Text>
          <Text style={s.summaryVal}>{association}</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Numero {association}</Text>
          <Text style={s.summaryVal}>{memberNumber}</Text>
        </View>
        {memberSection.trim().length > 0 && (
          <>
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text style={s.summaryKey}>
                {association === "AIA" ? "Sezione" : "Comitato"}
              </Text>
              <Text style={s.summaryVal}>{memberSection}</Text>
            </View>
          </>
        )}
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Sport</Text>
          <Text style={s.summaryVal}>{sports.join(", ")}</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Categorie</Text>
          <Text style={s.summaryVal}>{categories.join(", ")}</Text>
        </View>
        {refereeRoles.length > 0 && (
          <>
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text style={s.summaryKey}>Ruoli</Text>
              <Text style={s.summaryVal}>{refereeRoles.join(", ")}</Text>
            </View>
          </>
        )}
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Tariffa base</Text>
          <Text style={s.summaryVal}>
            €{baseRate}/{rateType}
          </Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Trasferta</Text>
          <Text style={s.summaryVal}>{travelLabel()}</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Ore consecutive</Text>
          <Text style={s.summaryVal}>{consecutiveHoursRange ?? "—"}</Text>
        </View>
      </View>

      <Pressable
        style={s.checkRow}
        onPress={() => setAcceptTerms(!acceptTerms)}
      >
        <View style={[s.checkBox, acceptTerms && s.checkBoxChecked]}>
          {acceptTerms && (
            <Ionicons name="checkmark" size={14} color={colors.white} />
          )}
        </View>
        <Text style={s.checkText}>
          Accetto i <Text style={s.checkLink}>Termini e condizioni</Text> del
          servizio arbitri Competo.
        </Text>
      </Pressable>

      <Pressable
        style={s.checkRow}
        onPress={() => setAcceptPrivacy(!acceptPrivacy)}
      >
        <View style={[s.checkBox, acceptPrivacy && s.checkBoxChecked]}>
          {acceptPrivacy && (
            <Ionicons name="checkmark" size={14} color={colors.white} />
          )}
        </View>
        <Text style={s.checkText}>
          Accetto il trattamento dei dati personali ai sensi della{" "}
          <Text style={s.checkLink}>Privacy Policy</Text>.
        </Text>
      </Pressable>

      <View style={s.infoBox}>
        <Ionicons name="time-outline" size={18} color={colors.darkBlue} />
        <Text style={s.infoBoxText}>
          Il tuo profilo verrà verificato con il registro {association} entro
          24–48 ore. Riceverai una notifica con l'esito della revisione.
        </Text>
      </View>
    </>
  );
}
