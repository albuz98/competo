import { ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { styles } from "./Button.styles";
import { ButtonEnum } from "../../types/components";

interface ButtonProps {
  text: string;
  handleBtn: () => Promise<void> | void;
  isDisabled?: boolean;
  loading?: boolean;
  isLink?: boolean;
  variant?: ButtonEnum;
}

export default function Button({
  text,
  handleBtn,
  isDisabled,
  loading,
  isLink = false,
  variant = ButtonEnum.PRIMARY,
}: ButtonProps) {
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

  const btnStyle = isLink ? styles.linkBtn : variantStyleBtn;
  const textStyle = isLink ? styles.linkText : variantStyleText;

  return (
    <TouchableOpacity
      style={[btnStyle, isDisabled && styles.btnDisabled]}
      onPress={handleBtn}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#E8601A" />
      ) : (
        <Text style={textStyle}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}
