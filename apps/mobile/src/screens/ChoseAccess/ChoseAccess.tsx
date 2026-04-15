import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigationEnum, RootStackParamList } from "../../types";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ChoseAccess.styles";
import { LinearGradient } from "expo-linear-gradient";
import { colorGradientReverse } from "../../theme/colors";
import OnboardingCarousel from "../../components/OnboardingCarousel/OnboardingCarousel";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";
import {
  ButtonBorderColored,
  ButtonFullColored,
} from "../../components/Button/Button";

type Props = NativeStackScreenProps<RootStackParamList, "ChoseAccess">;

export default function ChoseAccess({ navigation }: Props) {
  return (
    <LinearGradient
      colors={colorGradientReverse}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <CompetoLogo />
        <View style={styles.carousel}>
          <OnboardingCarousel />
        </View>
        <View style={styles.button}>
          <ButtonFullColored
            text="Accedi"
            handleBtn={() => navigation.replace(NavigationEnum.LOGIN, {})}
          />
          <ButtonBorderColored
            text="Registrati"
            handleBtn={() => navigation.replace(NavigationEnum.REGISTER)}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
