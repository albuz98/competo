import React, { useState } from "react";
import { View, TextInput } from "react-native";
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
  parse?: (text: string) => number;
  step?: number;
  editable?: boolean;
}

export function Stepper({
  value,
  min,
  max,
  onChange,
  fmt,
  parse,
  step = 1,
  editable = true,
}: StepperProps) {
  const [focused, setFocused] = useState(false);
  const [inputText, setInputText] = useState("");

  const displayValue = focused ? inputText : (fmt ? fmt(value) : String(value));

  function handleFocus() {
    setInputText(fmt ? fmt(value) : String(value));
    setFocused(true);
  }

  function handleBlur() {
    setFocused(false);
    const raw = parse ? parse(inputText) : parseInt(inputText, 10);
    if (!isNaN(raw)) {
      const snapped = Math.round(raw / step) * step;
      onChange(Math.min(max, Math.max(min, snapped)));
    }
  }

  return (
    <View style={s.stepper}>
      <ButtonGeneric
        style={[s.stepperBtn, value > min && s.stepperBtnActive]}
        handleBtn={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
      >
        <Ionicons
          name="remove"
          size={16}
          color={value > min ? colors.primary : colors.placeholder}
        />
      </ButtonGeneric>
      <TextInput
        style={s.stepperValue}
        value={displayValue}
        onChangeText={setInputText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType="numeric"
        selectTextOnFocus
        editable={editable}
      />
      <ButtonGeneric
        style={[s.stepperBtn, value < max && s.stepperBtnActive]}
        handleBtn={() => onChange(Math.min(max, value + step))}
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
