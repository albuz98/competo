import { TouchableOpacity, Text } from "react-native";
import { styles } from "./LinkButton.styles";

interface ButtonProps {
  text: string | React.ReactNode;
  handleBtn: () => Promise<void> | void;
  color?: string;
  fontSize?: number;
  isBold?: boolean;
}

export default function LinkButton({
  text,
  handleBtn,
  color = "#fff",
  fontSize,
  isBold,
}: ButtonProps) {
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
