import {
  View,
  Text,
  TextInput,
  TextInputSubmitEditingEvent,
  ReturnKeyTypeOptions,
  KeyboardTypeOptions,
} from "react-native";
import { ButtonIcon } from "../Button/Button";
import { colors } from "../../../theme/colors";
import { styles } from "./InputBoxRow.styled";
import { useState } from "react";
import {
  inputTextContentType,
  textAutoCapitalize,
} from "../../../constants/generals";
import { Ionicons } from "@expo/vector-icons";

interface InputBoxProps {
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  autoCapitalize?: textAutoCapitalize;
  autoCorrect?: boolean;
  textContentType?: inputTextContentType;
  placeholder?: string;
  error?: string;
  label: string;
  isLast?: boolean;
  disabled?: boolean;
}

export const InputBoxRow = ({
  value,
  onChangeText,
  secureTextEntry,
  maxLength,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  autoCapitalize,
  autoCorrect,
  textContentType,
  placeholder,
  error,
  label,
  isLast,
  disabled,
}: InputBoxProps) => {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={[styles.row, isLast && !error && styles.rowLast]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <View style={styles.rowInputRow}>
          <TextInput
            style={[
              styles.rowInput,
              secureTextEntry ? styles.rowInputWithIcon : undefined,
              error ? styles.rowInputError : undefined,
              disabled ? styles.rowInputDisabled : undefined,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.opacizedBgInput}
            secureTextEntry={secureTextEntry && hidden}
            textContentType={textContentType ?? "oneTimeCode"}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            maxLength={maxLength}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            editable={!disabled}
          />
          {secureTextEntry && (
            <ButtonIcon
              style={styles.rowEyeBtn}
              handleBtn={() => setHidden((h) => !h)}
              icon={
                <Ionicons
                  name={hidden ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color={colors.placeholder}
                />
              }
            />
          )}
        </View>
        {error && <Text style={styles.rowError}>{error}</Text>}
      </View>
    </View>
  );
};
