import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { sStyles } from "./Switcher.styled";

export interface SwitcherOption<T extends string> {
  label: string;
  value: T;
}

interface SwitcherProps<T extends string> {
  options: SwitcherOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Switcher<T extends string>({
  options,
  value,
  onChange,
}: SwitcherProps<T>) {
  return (
    <View style={sStyles.container}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[sStyles.btn, active && sStyles.btnActive]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[sStyles.text, active && sStyles.textActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
