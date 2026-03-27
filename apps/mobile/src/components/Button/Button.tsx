import { ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { styles } from "./Button.styles";
import { ButtonEnum } from "../../types/components";

interface ButtonProps {
  text: string | React.ReactNode;
  handleBtn: () => Promise<void> | void;
  isDisabled?: boolean;
  loading?: boolean;
  variant?: ButtonEnum;
  color?: string;
  fontSize?: number;
  isBold?: boolean;
}

export default function Button({
  text,
  handleBtn,
  isDisabled,
  loading,
  variant = ButtonEnum.PRIMARY,
  color = "#fff",
  fontSize,
  isBold,
}: ButtonProps) {
  if (variant === ButtonEnum.LINK) {
    return (
      <TouchableOpacity style={styles.linkBtn} onPress={handleBtn}>
        <Text
          style={[
            styles.linkText,
            { color },
            fontSize ? { fontSize } : undefined,
            isBold && { fontWeight: "700" },
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  if (variant === ButtonEnum.EDIT) {
    return (
      <TouchableOpacity
        style={[styles.editBtn, isDisabled && styles.btnDisabled]}
        onPress={handleBtn}
        disabled={isDisabled}
        activeOpacity={0.85}
      >
        {text}
      </TouchableOpacity>
    );
  }

  const variantStyleBtn =
    variant === ButtonEnum.PRIMARY
      ? styles.primaryBtn
      : variant === ButtonEnum.THIRD
        ? styles.thirdBtn
        : styles.secondaryBtn;

  const variantStyleText =
    variant === ButtonEnum.PRIMARY
      ? styles.primaryBtnText
      : variant === ButtonEnum.THIRD
        ? styles.thirdBtnText
        : styles.secondaryBtnText;

  return (
    <TouchableOpacity
      style={[variantStyleBtn, isDisabled && styles.btnDisabled]}
      onPress={handleBtn}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#E8601A" />
      ) : (
        <Text style={variantStyleText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}
