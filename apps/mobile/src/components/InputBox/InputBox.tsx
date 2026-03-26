import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInput,
  TextInputSubmitEditingEvent,
} from "react-native";
import { styles } from "./InputBox.styles";

interface InputBoxProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: any;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  secureTextEntry?: boolean;
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
}: InputBoxProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoComplete={autoComplete}
      placeholderTextColor="rgba(255,255,255,0.5)"
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secureTextEntry}
    />
  );
}
