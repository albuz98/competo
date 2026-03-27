import { useState } from "react";
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  Text,
  TextInput,
  TextInputSubmitEditingEvent,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./InputBox.styles";

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

export default function InputBox(props: InputBoxProps) {
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
                error ? styles.rowInputError : undefined,
              ]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#94a3b8"
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
              <TouchableOpacity
                onPress={() => setHidden((h) => !h)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={hidden ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#94a3b8"
                />
              </TouchableOpacity>
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
  } = props;
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[
          styles.input,
          isError && styles.inputError,
          secureTextEntry && styles.inputWithEye,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        placeholderTextColor="rgba(255,255,255,0.5)"
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={secureTextEntry && hidden}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        textContentType={textContentType}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setHidden((h) => !h)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={hidden ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="rgba(255,255,255,0.6)"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
