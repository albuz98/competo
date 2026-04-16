import { useState } from "react";
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInput,
  TextInputSubmitEditingEvent,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./InputBox.styles";
import { ButtonIcon } from "../Button/Button";
import { colors } from "../../theme/colors";
import Feather from "@expo/vector-icons/Feather";
import {
  inputTextContentType,
  textAutoCapitalize,
} from "../../constants/generals";

interface InputBoxProps {
  isDark?: boolean;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  maxLength?: number;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: any;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  autoCapitalize?: textAutoCapitalize;
  autoCorrect?: boolean;
  isMultiline?: boolean;
  deleteText?: () => void;
  numberOfLines?: number;
  textContentType?: inputTextContentType;
  returnKeyType?: ReturnKeyTypeOptions;
  isError?: boolean;
  isBorderless?: boolean;
}

export const InputBox = ({
  isDark = true,
  value,
  onChangeText,
  secureTextEntry,
  maxLength,
  placeholder,
  keyboardType,
  autoComplete,
  autoCapitalize,
  autoCorrect,
  isMultiline,
  deleteText,
  numberOfLines,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  isError,
  isBorderless = false,
}: InputBoxProps) => {
  const [hidden, setHidden] = useState(true);

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          isError && styles.inputError,
          (secureTextEntry || deleteText) && styles.inputWithIcon,
          {
            borderWidth: isBorderless ? 0 : 1,
            borderColor: isBorderless ? colors.transparent : colors.disabled,
            backgroundColor: isDark ? colors.opacizedBgInput : colors.white,
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
};
