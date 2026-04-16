import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s } from "../CreateOrganizerProfile.styles";
import { colors } from "../../../theme/colors";
import { InputBox } from "../../../components/InputBox/InputBox";
import { EntityType } from "../../../types/organizer";
import { ENTITY_TYPES } from "../../../constants/organizer";

interface Step1Props {
  orgName: string;
  setOrgName: (v: string) => void;
  entityType: EntityType | null;
  setEntityType: (v: EntityType) => void;
  customEntityType: string;
  setCustomEntityType: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
}

export function renderStep1({
  orgName,
  setOrgName,
  entityType,
  setEntityType,
  customEntityType,
  setCustomEntityType,
  description,
  setDescription,
}: Step1Props) {
  return (
    <>
      <Text style={s.sectionTitle}>Identità dell'organizzazione</Text>
      <Text style={s.sectionSub}>
        Dicci come si chiama la tua organizzazione e che tipo di ente è.
      </Text>

      <Text style={s.sectionLabel}>
        Nome organizzazione <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <InputBox
        value={orgName}
        onChangeText={setOrgName}
        placeholder="Es. ASD Calcio Milano"
        isDark={false}
      />

      <Text style={s.sectionLabel}>
        Tipo di ente <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      {ENTITY_TYPES.map((et) => {
        const selected = entityType === et.value;
        return (
          <TouchableOpacity
            key={et.value}
            style={[s.optionCard, selected && s.optionCardSelected]}
            onPress={() => setEntityType(et.value)}
            activeOpacity={0.7}
          >
            <View
              style={[s.optionCardIcon, selected && s.optionCardIconSelected]}
            >
              <Ionicons
                name={et.icon as never}
                size={20}
                color={selected ? colors.white : colors.grayDark}
              />
            </View>
            <View style={s.optionCardBody}>
              <Text style={s.optionCardTitle}>{et.label}</Text>
              <Text style={s.optionCardSub}>{et.sub}</Text>
            </View>
            <View
              style={[s.optionCardCheck, selected && s.optionCardCheckSelected]}
            >
              {selected && (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {entityType === "altro" && (
        <>
          <Text style={s.sectionLabel}>
            Specifica il tipo di ente{" "}
            <Text style={{ color: colors.primary }}>*</Text>
          </Text>
          <InputBox
            value={customEntityType}
            onChangeText={setCustomEntityType}
            placeholder="Es. Fondazione sportiva, Ente del terzo settore…"
            isDark={false}
          />
        </>
      )}

      <Text style={s.sectionLabel}>Descrizione</Text>
      <InputBox
        value={description}
        onChangeText={setDescription}
        placeholder="Descrivi brevemente la tua organizzazione (opzionale)"
        isDark={false}
        isMultiline
        numberOfLines={4}
      />
    </>
  );
}
