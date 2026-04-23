import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s } from "../CreateOrganizerProfile.styles";
import { colors } from "../../../theme/colors";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import { LegalForm } from "../../../types/organizer";
import { LEGAL_FORMS } from "../../../constants/organizer";

interface Step3Props {
  taxCode: string;
  setTaxCode: (v: string) => void;
  legalRepName: string;
  setLegalRepName: (v: string) => void;
  legalRepSurname: string;
  setLegalRepSurname: (v: string) => void;
  legalForm: LegalForm | null;
  setLegalForm: (v: LegalForm) => void;
}

export function renderStep3({
  taxCode,
  setTaxCode,
  legalRepName,
  setLegalRepName,
  legalRepSurname,
  setLegalRepSurname,
  legalForm,
  setLegalForm,
}: Step3Props) {
  return (
    <>
      <Text style={s.sectionTitle}>Dati Legali</Text>
      <Text style={s.sectionSub}>
        Questi dati sono necessari per la fatturazione delle quote di iscrizione
        e per la verifica dell'organizzazione.
      </Text>

      <View style={s.infoBox}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={colors.primary}
        />
        <Text style={s.infoBoxText}>
          Il codice fiscale o la P.IVA sono richiesti per poter ricevere i
          pagamenti delle iscrizioni ai tornei e per adempiere agli obblighi
          fiscali.
        </Text>
      </View>

      <Text style={s.sectionLabel}>
        Codice Fiscale / P.IVA <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <InputBox
        value={taxCode}
        onChangeText={(v) => setTaxCode(v.toUpperCase())}
        placeholder="RSSMRA80A01H501Z oppure 12345678901"
        isDark={false}
        autoCapitalize="characters"
      />

      <Text style={s.sectionLabel}>
        Nome referente legale <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <InputBox
        value={legalRepName}
        onChangeText={setLegalRepName}
        placeholder="Nome"
        isDark={false}
      />

      <Text style={s.sectionLabel}>
        Cognome referente legale{" "}
        <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <InputBox
        value={legalRepSurname}
        onChangeText={setLegalRepSurname}
        placeholder="Cognome"
        isDark={false}
      />

      <Text style={s.sectionLabel}>Forma giuridica</Text>
      <View style={s.chipsRow}>
        {LEGAL_FORMS.map((lf) => {
          const selected = legalForm === lf.value;
          return (
            <React.Fragment key={lf.value}>
              <Text
                style={[s.chip, selected && s.chipSelected]}
                onPress={() => setLegalForm(lf.value)}
              >
                <Text style={[s.chipText, selected && s.chipTextSelected]}>
                  {lf.label}
                </Text>
              </Text>
            </React.Fragment>
          );
        })}
      </View>
    </>
  );
}
