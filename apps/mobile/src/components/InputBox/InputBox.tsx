import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInput,
  TextInputSubmitEditingEvent,
} from "react-native";
import { styles } from "./InputBox.styles";

interface InputBoxProps {
  value: string;
  setValue: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: any;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  autoCorrect?: boolean;
  maxLength?: number;
  isError?: boolean;
  textContentType?: "none" | "oneTimeCode" | "password" | "newPassword" | "username" | "emailAddress" | "name" | "givenName" | "familyName" | "telephoneNumber" | "addressCity" | "addressState" | "addressCityAndState" | "sublocality" | "countryName" | "postalCode" | "streetAddressLine1" | "streetAddressLine2" | "creditCardNumber" | "creditCardSecurityCode";
}

export default function InputBox({
  value,
  setValue,
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
}: InputBoxProps) {
  return (
    <TextInput
      style={[styles.input, isError && styles.inputError]}
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      placeholderTextColor="rgba(255,255,255,0.5)"
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secureTextEntry}
      autoCorrect={autoCorrect}
      maxLength={maxLength}
      textContentType={textContentType}
    />
  );
}
