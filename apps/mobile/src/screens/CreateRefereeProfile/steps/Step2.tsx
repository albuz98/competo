import React from "react";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import { s } from "../CreateRefereeProfile.styles";
import {
  REFEREE_ASSOCIATIONS,
  ASSOCIATION_LABELS,
  type RefereeAssociationKey,
} from "../../../constants/referee";
import { colors } from "../../../theme/colors";

type Props = {
  association: RefereeAssociationKey;
  setAssociation: (v: RefereeAssociationKey) => void;
  memberNumber: string;
  setMemberNumber: (v: string) => void;
  memberSection: string;
  setMemberSection: (v: string) => void;
  startYear: string;
  setStartYear: (v: string) => void;
};

export function Step2({
  association,
  setAssociation,
  memberNumber,
  setMemberNumber,
  memberSection,
  setMemberSection,
  startYear,
  setStartYear,
}: Props) {
  const labels = ASSOCIATION_LABELS[association];

  return (
    <>
      <Text style={s.sectionTitle}>Dati associazione</Text>
      <Text style={s.sectionSub}>
        Seleziona l'associazione arbitrale a cui appartieni e inserisci i tuoi
        dati di tesseramento.
      </Text>

      <Text style={s.sectionLabel}>Associazione *</Text>
      <View style={s.segmentedRow}>
        {REFEREE_ASSOCIATIONS.map((assoc) => (
          <Pressable
            key={assoc}
            style={[
              s.segmentedItem,
              association === assoc && s.segmentedItemActive,
            ]}
            onPress={() => setAssociation(assoc)}
          >
            <Text
              style={[
                s.segmentedText,
                association === assoc && s.segmentedTextActive,
              ]}
            >
              {assoc}
            </Text>
            {assoc === "AIA" && (
              <Text style={[s.segmentedSub, association === assoc && s.segmentedSubActive]}>
                Assoc. Italiana Arbitri
              </Text>
            )}
            {assoc === "CSI" && (
              <Text style={[s.segmentedSub, association === assoc && s.segmentedSubActive]}>
                Centro Sportivo Italiano
              </Text>
            )}
          </Pressable>
        ))}
      </View>

      <InputBox
        value={memberNumber}
        onChangeText={setMemberNumber}
        placeholder={labels.number}
        isDark={false}
        labelName={labels.number}
        isObbligatory
      />

      <InputBox
        value={memberSection}
        onChangeText={setMemberSection}
        placeholder={labels.section}
        isDark={false}
        labelName={labels.section}
        isObbligatory
      />

      <View style={s.hintBox}>
        <Ionicons
          name="information-circle-outline"
          size={15}
          color={colors.placeholder}
        />
        <Text style={s.hintBoxText}>{labels.sectionHint}</Text>
      </View>

      <InputBox
        value={startYear}
        onChangeText={setStartYear}
        placeholder="Anno di primo tesseramento"
        isDark={false}
        labelName="Anno di primo tesseramento"
      />

      <View style={s.infoBox}>
        <Ionicons
          name="shield-checkmark-outline"
          size={18}
          color={colors.darkBlue}
        />
        <Text style={s.infoBoxText}>
          I tuoi dati verranno verificati con il registro{" "}
          {association}. Assicurati che il numero identificativo sia corretto.
        </Text>
      </View>
    </>
  );
}
