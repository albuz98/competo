import React from "react";
import { Text, View, Pressable } from "react-native";
import { s } from "../CreateRefereeProfile.styles";
import {
  REFEREE_SPORTS,
  REFEREE_CATEGORIES,
  REFEREE_ROLES,
} from "../../../constants/referee";

type Props = {
  sports: string[];
  setSports: (v: string[]) => void;
  categories: string[];
  setCategories: (v: string[]) => void;
  refereeRoles: string[];
  setRefereeRoles: (v: string[]) => void;
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((i) => i !== value)
    : [...list, value];
}

export function Step3({
  sports,
  setSports,
  categories,
  setCategories,
  refereeRoles,
  setRefereeRoles,
}: Props) {
  return (
    <>
      <Text style={s.sectionTitle}>Attività arbitrale</Text>
      <Text style={s.sectionSub}>
        Indica gli sport, le categorie e i ruoli in cui eserciti l'attività
        arbitrale. Puoi selezionare più opzioni.
      </Text>

      <Text style={s.sectionLabel}>Sport *</Text>
      <View style={s.chipsRow}>
        {REFEREE_SPORTS.map((sp) => {
          const active = sports.includes(sp);
          return (
            <Pressable
              key={sp}
              style={[s.chip, active && s.chipSelected]}
              onPress={() => setSports(toggle(sports, sp))}
            >
              <Text style={[s.chipText, active && s.chipTextSelected]}>{sp}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[s.sectionLabel, { marginTop: 16 }]}>Categoria *</Text>
      <View style={s.chipsRow}>
        {REFEREE_CATEGORIES.map((cat) => {
          const active = categories.includes(cat);
          return (
            <Pressable
              key={cat}
              style={[s.chip, active && s.chipSelected]}
              onPress={() => setCategories(toggle(categories, cat))}
            >
              <Text style={[s.chipText, active && s.chipTextSelected]}>{cat}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[s.sectionLabel, { marginTop: 16 }]}>Ruolo arbitrale *</Text>
      <View style={s.chipsRow}>
        {REFEREE_ROLES.map((role) => {
          const active = refereeRoles.includes(role);
          return (
            <Pressable
              key={role}
              style={[s.chip, active && s.chipSelected]}
              onPress={() => setRefereeRoles(toggle(refereeRoles, role))}
            >
              <Text style={[s.chipText, active && s.chipTextSelected]}>{role}</Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}
