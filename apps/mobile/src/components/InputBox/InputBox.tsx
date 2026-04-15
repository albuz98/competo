import { useState } from "react";
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  Text,
  TextInput,
  TextInputSubmitEditingEvent,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./InputBox.styles";
import { ButtonIcon } from "../Button/Button";
import { colors } from "../../theme/colors";
import Feather from "@expo/vector-icons/Feather";

type CommonProps = {
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: any;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  isDark?: boolean;
  isMultiline?: boolean;
  deleteText?: () => void;
  numberOfLines?: number;
  style?: any;
  textContentType?:
    | "none"
    | "oneTimeCode"
    | "password"
    | "newPassword"
    | "username"
    | "emailAddress"
    | "name"
    | "givenName"
    | "familyName"
    | "telephoneNumber"
    | "addressCity"
    | "addressState"
    | "addressCityAndState"
    | "sublocality"
    | "countryName"
    | "postalCode"
    | "streetAddressLine1"
    | "streetAddressLine2"
    | "creditCardNumber"
    | "creditCardSecurityCode";
};

type AuthProps = CommonProps & {
  variant?: "auth";
  placeholder: string;
  isError?: boolean;
};

type RowProps = CommonProps & {
  variant: "row";
  label: string;
  placeholder?: string;
  isLast?: boolean;
  error?: string;
};

type InputBoxProps = AuthProps | RowProps;

export default function InputBox({ isDark = true, ...props }: InputBoxProps) {
  const [hidden, setHidden] = useState(true);

  if (props.variant === "row") {
    const {
      label,
      value,
      onChangeText,
      secureTextEntry,
      isLast,
      error,
      placeholder,
      keyboardType,
      autoCapitalize,
      autoCorrect,
      maxLength,
      textContentType,
      returnKeyType,
      onSubmitEditing,
    } = props;
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
              ]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.placeholder}
              secureTextEntry={secureTextEntry && hidden}
              textContentType={textContentType ?? "oneTimeCode"}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              maxLength={maxLength}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
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
  }

  const {
    value,
    onChangeText,
    placeholder,
    keyboardType,
    autoComplete,
    returnKeyType,
    onSubmitEditing,
    secureTextEntry,
    autoCapitalize = "none",
    autoCorrect = true,
    maxLength,
    isError,
    textContentType,
    isMultiline,
    numberOfLines,
    deleteText,
  } = props;
  return (
    <View>
      <TextInput
        style={[
          styles.input,
          isError && styles.inputError,
          (secureTextEntry || deleteText) && styles.inputWithIcon,
          {
            backgroundColor: isDark ? colors.opacized : colors.white,
            color: isDark ? colors.white : colors.black,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        placeholderTextColor={isDark ? colors.grayOpacized : colors.placeholder}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={secureTextEntry && hidden}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        textContentType={textContentType}
        multiline={isMultiline}
        numberOfLines={numberOfLines}
      />
      {secureTextEntry && (
        <ButtonIcon
          style={styles.iconBtn}
          handleBtn={() => setHidden((h) => !h)}
          icon={
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colors.grayOpacized}
            />
          }
        />
      )}
      {deleteText && (
        <ButtonIcon
          style={styles.iconBtn}
          handleBtn={() => deleteText()}
          icon={<Feather name="x" size={20} color={colors.placeholder} />}
        />
      )}
    </View>
  );
}
