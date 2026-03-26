import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ChoseAccess.styles";
import Button from "../../components/Button/Button";
import { ButtonEnum } from "../../types/components";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";
import OnboardingCarousel from "../../components/OnboardingCarousel/OnboardingCarousel";
import CompetoLogo from "../../components/CompetoLogo/CompetoLogo";

type Props = NativeStackScreenProps<RootStackParamList, "ChoseAccess">;

export default function ChoseAccess({ navigation }: Props) {
  return (
    <LinearGradient
      colors={[colors.primaryGradientEnd, colors.primaryGradientMid, colors.primary]}
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
          <Button
            text="Accedi"
            handleBtn={() => navigation.replace("Login", {})}
            variant={ButtonEnum.PRIMARY}
          />
          <Button
            text="Registrati"
            handleBtn={() => navigation.replace("Register")}
            variant={ButtonEnum.SECONDARY}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
