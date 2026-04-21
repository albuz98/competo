import { Ionicons } from "@expo/vector-icons";
import { Gender } from "../types/user";

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: "Maschio",
  [Gender.FEMALE]: "Femmina",
  [Gender.OTHER]: "Non definito",
};

export const GENDER_ICONS: Record<
  Gender,
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  [Gender.MALE]: "male",
  [Gender.FEMALE]: "female",
  [Gender.OTHER]: "male-female",
};

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: Gender.MALE, label: "Maschio" },
  { value: Gender.FEMALE, label: "Femmina" },
  { value: Gender.OTHER, label: "Non definito" },
];
