import { View, Text } from "react-native";
import { s } from "./Stepper.styled";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { ButtonGeneric } from "../Button/Button";

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  fmt?: (v: number) => string;
}
export function Stepper({ value, min, max, onChange, fmt }: StepperProps) {
  return (
    <View style={s.stepper}>
      <ButtonGeneric
        style={[s.stepperBtn, value > min && s.stepperBtnActive]}
        handleBtn={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Ionicons
          name="remove"
          size={16}
          color={value > min ? colors.primary : colors.placeholder}
        />
      </ButtonGeneric>
      <Text style={s.stepperValue}>{fmt ? fmt(value) : value}</Text>
      <ButtonGeneric
        style={[s.stepperBtn, value < max && s.stepperBtnActive]}
        handleBtn={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Ionicons
          name="add"
          size={16}
          color={value < max ? colors.primary : colors.placeholder}
        />
      </ButtonGeneric>
    </View>
  );
}
