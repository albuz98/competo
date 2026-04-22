import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s } from "../CreateOrganizerProfile.styles";
import { colors } from "../../../theme/colors";
import { EntityType } from "../../../types/organizer";
import { ENTITY_LABELS, PDF_URLS } from "../../../constants/organizer";
import { openPdf } from "../../../functions/general";

interface Step6Props {
  orgName: string;
  entityType: EntityType | null;
  customEntityType: string;
  address: string;
  contactEmail: string;
  taxCode: string;
  legalRepName: string;
  legalRepSurname: string;
  idDocFileName: string | null;
  orgDocFileName: string | null;
  acceptTerms: boolean;
  setAcceptTerms: (v: boolean) => void;
  acceptPrivacy: boolean;
  setAcceptPrivacy: (v: boolean) => void;
  acceptConduct: boolean;
  setAcceptConduct: (v: boolean) => void;
}

export function renderStep6({
  orgName,
  entityType,
  customEntityType,
  address,
  contactEmail,
  taxCode,
  legalRepName,
  legalRepSurname,
  idDocFileName,
  orgDocFileName,
  acceptTerms,
  setAcceptTerms,
  acceptPrivacy,
  setAcceptPrivacy,
  acceptConduct,
  setAcceptConduct,
}: Step6Props) {
  const entityLabel = entityType
    ? entityType === "altro" && customEntityType.trim()
      ? customEntityType.trim()
      : ENTITY_LABELS[entityType]
    : "—";

  function CheckRow({
    checked,
    onToggle,
    children,
  }: {
    checked: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) {
    return (
      <View style={s.checkRow}>
        <TouchableOpacity
          style={[s.checkBox, checked && s.checkBoxChecked]}
          onPress={onToggle}
          activeOpacity={0.7}
          hitSlop={8}
        >
          {checked && (
            <Ionicons name="checkmark" size={14} color={colors.white} />
          )}
        </TouchableOpacity>
        <Text style={s.checkText}>{children}</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={s.sectionTitle}>Consensi e Riepilogo</Text>
      <Text style={s.sectionSub}>
        Verifica i dati inseriti e accetta i termini per completare la creazione
        del profilo organizzatore.
      </Text>

      <Text style={s.sectionLabel}>Riepilogo dati</Text>
      <View style={s.summaryCard}>
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Organizzazione</Text>
          <Text style={s.summaryVal}>{orgName || "—"}</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Tipo ente</Text>
          <Text style={s.summaryVal}>{entityLabel}</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Sede</Text>
          <Text style={s.summaryVal}>{address || "—"}</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Email</Text>
          <Text style={s.summaryVal}>{contactEmail || "—"}</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>CF / P.IVA</Text>
          <Text style={s.summaryVal}>{taxCode || "—"}</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Referente legale</Text>
          <Text style={s.summaryVal}>
            {legalRepName || legalRepSurname
              ? `${legalRepName} ${legalRepSurname}`.trim()
              : "—"}
          </Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryRow}>
          <Text style={s.summaryKey}>Documento ID</Text>
          <Text style={s.summaryVal}>
            {idDocFileName ? "Caricato" : "Non caricato"}
          </Text>
        </View>
        {orgDocFileName !== null && (
          <>
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text style={s.summaryKey}>Doc. ente</Text>
              <Text style={s.summaryVal}>Caricato</Text>
            </View>
          </>
        )}
      </View>

      <View style={[s.noteBox, { marginBottom: 8 }]}>
        <Ionicons name="time-outline" size={18} color="#0284c7" />
        <Text style={s.noteBoxText}>
          Il tuo profilo organizzatore sarà in revisione. Il team Competo lo
          verificherà entro 24–48 ore. Riceverai una notifica appena approvato.
        </Text>
      </View>

      <Text style={[s.sectionLabel, { marginTop: 8 }]}>Accettazione</Text>

      <CheckRow
        checked={acceptTerms}
        onToggle={() => setAcceptTerms(!acceptTerms)}
      >
        Accetto i{" "}
        <Text style={s.checkLink} onPress={() => openPdf(PDF_URLS.terms)}>
          Termini e Condizioni per gli Organizzatori
        </Text>{" "}
        di Competo. <Text style={{ color: colors.primary }}>*</Text>
      </CheckRow>

      <CheckRow
        checked={acceptPrivacy}
        onToggle={() => setAcceptPrivacy(!acceptPrivacy)}
      >
        Accetto la{" "}
        <Text style={s.checkLink} onPress={() => openPdf(PDF_URLS.privacy)}>
          Privacy Policy
        </Text>{" "}
        e il trattamento dei miei dati personali ai sensi del GDPR.{" "}
        <Text style={{ color: colors.primary }}>*</Text>
      </CheckRow>

      <CheckRow
        checked={acceptConduct}
        onToggle={() => setAcceptConduct(!acceptConduct)}
      >
        Mi impegno a rispettare il{" "}
        <Text style={s.checkLink} onPress={() => openPdf(PDF_URLS.conduct)}>
          Codice di Condotta degli Organizzatori
        </Text>
        {", "}garantendo trasparenza, correttezza e rispetto nei confronti dei
        partecipanti. <Text style={{ color: colors.primary }}>*</Text>
      </CheckRow>
    </>
  );
}
