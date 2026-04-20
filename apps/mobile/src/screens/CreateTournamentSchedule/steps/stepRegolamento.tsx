import { Text, TouchableOpacity, View, Linking } from "react-native";
import { s } from "../CreateTournamentSchedule.styles";
import { colors } from "../../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import * as DocumentPicker from "expo-document-picker";
import {
  SPORT_REGULATIONS,
  SportRegulation,
  TOURNAMENT_GENDERS,
  TournamentGender,
} from "../../../constants/tournament";
import { ButtonGeneric } from "../../../components/core/Button/Button";

interface renderStepRegolamentoProps {
  regulationFileName: string | null;
  setRegulationFileName: React.Dispatch<React.SetStateAction<string | null>>;
  setRegulationFileUri: React.Dispatch<React.SetStateAction<string | null>>;
  sportRegulation: SportRegulation | null;
  setSportRegulation: React.Dispatch<
    React.SetStateAction<SportRegulation | null>
  >;
  gender: TournamentGender;
  setGender: React.Dispatch<React.SetStateAction<TournamentGender>>;
}

export function renderStepRegolamento({
  regulationFileName,
  setRegulationFileName,
  setRegulationFileUri,
  sportRegulation,
  setSportRegulation,
  gender,
  setGender,
}: renderStepRegolamentoProps) {
  async function pickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setRegulationFileName(asset.name);
    setRegulationFileUri(asset.uri);
  }

  function clearPdf() {
    setRegulationFileName(null);
    setRegulationFileUri(null);
  }

  return (
    <>
      <Text style={s.sectionTitle}>Regolamento</Text>
      <Text style={s.sectionSub}>
        Definisci le regole del torneo e la categoria di partecipazione.
      </Text>

      <Text style={s.sectionLabel}>
        Regolamento sportivo <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      {SPORT_REGULATIONS.map((opt) => (
        <ButtonGeneric
          key={opt.value}
          style={[
            s.optionCard,
            sportRegulation === opt.value && s.optionCardSelected,
          ]}
          handleBtn={() => setSportRegulation(opt.value)}
        >
          <View
            style={[
              s.optionCardIcon,
              sportRegulation === opt.value && s.optionCardIconSelected,
            ]}
          >
            <Ionicons
              name={opt.icon as any}
              size={20}
              color={
                sportRegulation === opt.value ? colors.white : colors.placeholder
              }
            />
          </View>
          <View style={s.optionCardBody}>
            <Text style={s.optionCardTitle}>{opt.label}</Text>
          </View>
          <TouchableOpacity
            style={s.downloadBtn}
            onPress={() => Linking.openURL(opt.downloadUrl)}
            hitSlop={8}
          >
            <Ionicons
              name="download-outline"
              size={16}
              color={colors.purpleBlue}
            />
            <Text style={s.downloadBtnText}>Regolamento</Text>
          </TouchableOpacity>
          <View
            style={[
              s.optionCardCheck,
              sportRegulation === opt.value && s.optionCardCheckSelected,
            ]}
          >
            {sportRegulation === opt.value && (
              <Ionicons name="checkmark" size={13} color={colors.white} />
            )}
          </View>
        </ButtonGeneric>
      ))}

      <Text style={[s.sectionLabel, { marginTop: 20 }]}>
        Regolamento comportamentale
      </Text>
      {regulationFileName ? (
        <View style={s.pdfRow}>
          <Ionicons
            name="document-text-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={s.pdfFileName} numberOfLines={1}>
            {regulationFileName}
          </Text>
          <TouchableOpacity onPress={clearPdf} hitSlop={8}>
            <Feather name="x" size={18} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.pdfPickerBtn} onPress={pickPdf}>
          <Ionicons
            name="cloud-upload-outline"
            size={18}
            color={colors.grayDark}
          />
          <Text style={s.pdfPickerText}>
            Carica regolamento comportamentale (opzionale, solo PDF)
          </Text>
        </TouchableOpacity>
      )}

      <Text style={[s.sectionLabel, { marginTop: 20 }]}>
        Genere <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <View style={s.genderRow}>
        {TOURNAMENT_GENDERS.map((opt) => (
          <ButtonGeneric
            key={opt.value}
            style={[
              s.genderCard,
              gender === opt.value && s.genderCardSelected,
            ]}
            handleBtn={() => setGender(opt.value)}
          >
            <Ionicons
              name={opt.icon as any}
              size={20}
              color={
                gender === opt.value ? colors.primary : colors.placeholder
              }
            />
            <Text
              style={[
                s.genderCardText,
                gender === opt.value && s.genderCardTextSelected,
              ]}
            >
              {opt.label}
            </Text>
          </ButtonGeneric>
        ))}
      </View>
    </>
  );
}
