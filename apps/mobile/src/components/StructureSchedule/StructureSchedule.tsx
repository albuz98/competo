import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonBorderColored, ButtonGradient } from "../Button/Button";
import { s } from "./StructureSchedule.styled";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
interface StructureScheduleProps {
  numberSteps: number;
  children: React.ReactNode;
  handleGenerate: () => void;
  validateStep(): boolean;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  generating: boolean;
  stepTitles: string[];
  isStepValid(): boolean;
  navigation: { goBack: () => void };
  cancelTitle: string;
  cancelMessage: string;
  lastStepLabel: string;
}

export const StructureSchedule = ({
  numberSteps,
  children,
  handleGenerate,
  validateStep,
  step,
  setStep,
  generating,
  stepTitles,
  isStepValid,
  navigation,
  cancelTitle,
  cancelMessage,
  lastStepLabel,
}: StructureScheduleProps) => {
  function handleNext() {
    if (!validateStep()) return;
    if (step < numberSteps)
      setStep((p: number) => (p + 1) as typeof numberSteps);
    else handleGenerate();
  }

  function handleBack() {
    if (step > 1) setStep((p: number) => (p - 1) as typeof numberSteps);
  }

  function confirmCancel() {
    Alert.alert(cancelTitle, cancelMessage, [
      { text: "No", style: "cancel" },
      {
        text: "Sì, annulla",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
    ]);
  }

  const headerSteps = Array.from({ length: numberSteps }, (_, i) => i + 1);

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <View style={s.header}>
        <TouchableOpacity style={s.headerSide} onPress={confirmCancel}>
          <Ionicons name="chevron-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{stepTitles[step - 1]}</Text>
        <View style={s.headerSide} />
      </View>

      <View style={s.stepBar}>
        {headerSteps.map((n) => (
          <React.Fragment key={n}>
            <View
              style={[
                s.stepDot,
                step === n && s.stepDotActive,
                step > n && s.stepDotDone,
              ]}
            >
              {step > n ? (
                <Ionicons name="checkmark" size={14} color={colors.primary} />
              ) : (
                <Text
                  style={[s.stepDotText, step === n && s.stepDotTextActive]}
                >
                  {n}
                </Text>
              )}
            </View>
            {n < numberSteps && (
              <View style={[s.stepLine, step > n && s.stepLineDone]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {children}
        <SafeAreaView edges={["bottom"]}>
          <View style={s.bottomNav}>
            <ButtonBorderColored
              isColored
              handleBtn={handleBack}
              text="Indietro"
              fullColor={colors.grayDark}
              isDisabled={step === 1}
            />

            <ButtonGradient
              handleBtn={handleNext}
              isDisabled={generating || !isStepValid()}
              loading={generating}
              isFullWidth
              style={[
                s.btnNext,
                {
                  opacity: generating || !isStepValid() ? 0.5 : 1,
                },
              ]}
            >
              <Text style={s.btnNextText}>
                {step === numberSteps ? lastStepLabel : "Avanti"}
              </Text>
            </ButtonGradient>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
