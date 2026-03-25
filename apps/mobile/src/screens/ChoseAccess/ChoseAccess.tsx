import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { View } from "react-native";
import { styles } from "./ChoseAccess.styles";

type Props = NativeStackScreenProps<RootStackParamList, "ChoseAccess">;

export default function ChoseAccessScreen({ navigation, route }: Props) {
  return <View style={styles.root}></View>;
}
