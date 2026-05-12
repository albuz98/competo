import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Popup } from "../../components/core/Popup/Popup";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  type RootStackParamList,
  NavigationEnum,
} from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { StructureSchedule } from "../../components/core/StructureSchedule/StructureSchedule";
import { s } from "./CreateRefereeProfile.styles";
import { STEP_TITLES_REFEREE } from "../../constants/referee";
import type { RefereeAssociationKey, RefereeRateType } from "../../constants/referee";
import { DatePickerModal } from "../../components/core/DatePicker/DatePicker";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { Step5 } from "./steps/Step5";

type Props = NativeStackScreenProps<RootStackParamList, "CreateRefereeProfile">;

export default function CreateRefereeProfile({ navigation }: Props) {
  const { addRefereeProfile } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [activeDatePicker, setActiveDatePicker] = useState(false);

  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [taxCode, setTaxCode] = useState("");

  // Step 2
  const [association, setAssociation] = useState<RefereeAssociationKey>("AIA");
  const [memberNumber, setMemberNumber] = useState("");
  const [memberSection, setMemberSection] = useState("");
  const [startYear, setStartYear] = useState("");

  // Step 3
  const [sports, setSports] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [refereeRoles, setRefereeRoles] = useState<string[]>([]);

  // Step 4
  const [baseRate, setBaseRate] = useState("");
  const [rateType, setRateType] = useState<RefereeRateType>("partita");
  const [travelAvailable, setTravelAvailable] = useState(false);
  const [travelRatePerKm, setTravelRatePerKm] = useState("");
  const [maxTravelKm, setMaxTravelKm] = useState<number | null>(null);
  const [consecutiveHoursRange, setConsecutiveHoursRange] = useState<
    string | null
  >(null);

  // Step 5
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  function validateStep(): boolean {
    if (step === 1) {
      if (!firstName.trim()) {
        Alert.alert("Nome mancante", "Inserisci il tuo nome.");
        return false;
      }
      if (!lastName.trim()) {
        Alert.alert("Cognome mancante", "Inserisci il tuo cognome.");
        return false;
      }
    }
    if (step === 2) {
      if (!memberNumber.trim()) {
        Alert.alert(
          "Numero mancante",
          `Inserisci il numero identificativo ${association}.`,
        );
        return false;
      }
      if (!memberSection.trim()) {
        Alert.alert(
          association === "AIA" ? "Sezione mancante" : "Comitato mancante",
          `Inserisci la ${association === "AIA" ? "sezione" : "comitato"} ${association} di appartenenza.`,
        );
        return false;
      }
    }
    if (step === 3) {
      if (sports.length === 0) {
        Alert.alert("Sport mancante", "Seleziona almeno uno sport.");
        return false;
      }
      if (categories.length === 0) {
        Alert.alert("Categoria mancante", "Seleziona almeno una categoria.");
        return false;
      }
      if (refereeRoles.length === 0) {
        Alert.alert("Ruolo mancante", "Seleziona almeno un ruolo arbitrale.");
        return false;
      }
    }
    if (step === 4) {
      const rate = parseFloat(baseRate);
      if (!baseRate.trim() || isNaN(rate) || rate <= 0) {
        Alert.alert(
          "Tariffa mancante",
          "Inserisci una tariffa base valida per partita.",
        );
        return false;
      }
      if (travelAvailable) {
        const perKm = parseFloat(travelRatePerKm);
        if (!travelRatePerKm.trim() || isNaN(perKm) || perKm <= 0) {
          Alert.alert(
            "Costo trasferta mancante",
            "Inserisci il costo per km di trasferta.",
          );
          return false;
        }
        if (maxTravelKm === null) {
          Alert.alert(
            "Distanza massima mancante",
            "Seleziona la distanza massima per le trasferte.",
          );
          return false;
        }
      }
      if (consecutiveHoursRange === null) {
        Alert.alert(
          "Ore consecutive mancanti",
          "Seleziona il range di ore consecutive che sei disponibile ad arbitrare.",
        );
        return false;
      }
    }
    return true;
  }

  function isStepValid(): boolean {
    if (step === 1)
      return (
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        birthdate.trim().length > 0 &&
        taxCode.trim().length > 0
      );
    if (step === 2)
      return memberNumber.trim().length > 0 && memberSection.trim().length > 0;
    if (step === 3)
      return (
        sports.length > 0 && categories.length > 0 && refereeRoles.length > 0
      );
    if (step === 4) {
      const rate = parseFloat(baseRate);
      if (!baseRate.trim() || isNaN(rate) || rate <= 0) return false;
      if (travelAvailable) {
        const perKm = parseFloat(travelRatePerKm);
        if (!travelRatePerKm.trim() || isNaN(perKm) || perKm <= 0) return false;
        if (maxTravelKm === null) return false;
      }
      return consecutiveHoursRange !== null;
    }
    if (step === 5) return acceptTerms && acceptPrivacy;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    addRefereeProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      association,
      memberNumber: memberNumber.trim(),
      memberSection: memberSection.trim() || undefined,
      sports,
      categories,
      refereeRoles,
      baseRate: parseFloat(baseRate),
      rateType,
      travelAvailable,
      travelRatePerKm: travelAvailable
        ? parseFloat(travelRatePerKm)
        : undefined,
      maxTravelKm: travelAvailable ? (maxTravelKm ?? undefined) : undefined,
      consecutiveHoursRange: consecutiveHoursRange!,
    });
    setSubmitting(false);
    setSuccessPopup(true);
  }

  return (
    <>
      <DatePickerModal
        visible={activeDatePicker}
        currentValue={birthdate}
        onConfirm={(iso) => {
          setBirthdate(iso);
          setActiveDatePicker(false);
        }}
        onCancel={() => setActiveDatePicker(false)}
      />

      <StructureSchedule
        numberSteps={5}
        handleGenerate={handleSubmit}
        validateStep={validateStep}
        step={step}
        setStep={setStep}
        generating={submitting}
        stepTitles={STEP_TITLES_REFEREE}
        isStepValid={isStepValid}
        navigation={navigation}
        cancelTitle="Annulla registrazione"
        cancelMessage="Sei sicuro di voler annullare la registrazione come arbitro?"
        lastStepLabel="Invia"
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <Step1
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              birthdate={birthdate}
              setBirthdate={setBirthdate}
              taxCode={taxCode}
              setTaxCode={setTaxCode}
              onOpenDatePicker={() => setActiveDatePicker(true)}
            />
          )}

          {step === 2 && (
            <Step2
              association={association}
              setAssociation={setAssociation}
              memberNumber={memberNumber}
              setMemberNumber={setMemberNumber}
              memberSection={memberSection}
              setMemberSection={setMemberSection}
              startYear={startYear}
              setStartYear={setStartYear}
            />
          )}

          {step === 3 && (
            <Step3
              sports={sports}
              setSports={setSports}
              categories={categories}
              setCategories={setCategories}
              refereeRoles={refereeRoles}
              setRefereeRoles={setRefereeRoles}
            />
          )}

          {step === 4 && (
            <Step4
              baseRate={baseRate}
              setBaseRate={setBaseRate}
              rateType={rateType}
              setRateType={setRateType}
              travelAvailable={travelAvailable}
              setTravelAvailable={setTravelAvailable}
              travelRatePerKm={travelRatePerKm}
              setTravelRatePerKm={setTravelRatePerKm}
              maxTravelKm={maxTravelKm}
              setMaxTravelKm={setMaxTravelKm}
              consecutiveHoursRange={consecutiveHoursRange}
              setConsecutiveHoursRange={setConsecutiveHoursRange}
            />
          )}

          {step === 5 && (
            <Step5
              firstName={firstName}
              lastName={lastName}
              association={association}
              memberNumber={memberNumber}
              memberSection={memberSection}
              sports={sports}
              categories={categories}
              refereeRoles={refereeRoles}
              baseRate={parseFloat(baseRate) || 0}
              rateType={rateType}
              travelAvailable={travelAvailable}
              travelRatePerKm={
                travelAvailable
                  ? parseFloat(travelRatePerKm) || undefined
                  : undefined
              }
              maxTravelKm={
                travelAvailable ? (maxTravelKm ?? undefined) : undefined
              }
              consecutiveHoursRange={consecutiveHoursRange}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              acceptPrivacy={acceptPrivacy}
              setAcceptPrivacy={setAcceptPrivacy}
            />
          )}
        </ScrollView>
      </StructureSchedule>

      <Popup
        visible={successPopup}
        onClose={() => {
          setSuccessPopup(false);
          navigation.replace(NavigationEnum.MAIN_TABS);
        }}
        title="Richiesta inviata!"
        message={`Il tuo profilo arbitro è in fase di revisione. Riceverai una notifica entro 24–48 ore con l'esito della verifica ${association}.`}
        variant="warning"
        icon="time-outline"
      />
    </>
  );
}
