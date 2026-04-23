import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Popup } from "../../components/core/Popup/Popup";
import { submitOrganizerProfile } from "../../api/organizer";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  type RootStackParamList,
  NavigationEnum,
} from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { s } from "./CreateOrganizerProfile.styles";
import { StructureSchedule } from "../../components/core/StructureSchedule/StructureSchedule";
import { renderStep1 } from "./steps/step1";
import { renderStep2 } from "./steps/step2";
import { renderStep3 } from "./steps/step3";
import { renderStep4 } from "./steps/step4";
import { renderStep5 } from "./steps/step5";
import { EntityType, LegalForm } from "../../types/organizer";
import { STEP_TITLES_ORGANIZER } from "../../constants/organizer";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "CreateOrganizerProfile"
>;

export default function CreateOrganizerProfile({ navigation }: Props) {
  const { addOrganizerProfile, user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  // Step 1: Identità
  const [orgName, setOrgName] = useState("");
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [customEntityType, setCustomEntityType] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Sede e contatti
  const [address, setAddress] = useState("");
  const [addressLat, setAddressLat] = useState<number | undefined>(undefined);
  const [addressLng, setAddressLng] = useState<number | undefined>(undefined);
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [mockPhoneCode, setMockPhoneCode] = useState("");
  const [phoneCodeInput, setPhoneCodeInput] = useState("");

  // Step 3: Dati legali
  const [taxCode, setTaxCode] = useState("");
  const [legalRepName, setLegalRepName] = useState("");
  const [legalRepSurname, setLegalRepSurname] = useState("");
  const [legalForm, setLegalForm] = useState<LegalForm | null>(null);

  // Step 4: Documenti (ex step5)
  const [idDocFileName, setIdDocFileName] = useState<string | null>(null);
  const [, setIdDocUri] = useState<string | null>(null);
  const [orgDocFileName, setOrgDocFileName] = useState<string | null>(null);
  const [, setOrgDocUri] = useState<string | null>(null);

  // Step 5: Consensi (ex step6)
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptConduct, setAcceptConduct] = useState(false);

  function validateStep(): boolean {
    if (step === 1) {
      if (!orgName.trim()) {
        Alert.alert("Nome mancante", "Inserisci il nome dell'organizzazione.");
        return false;
      }
      if (!entityType) {
        Alert.alert("Tipo ente mancante", "Seleziona il tipo di ente.");
        return false;
      }
      if (entityType === "altro" && !customEntityType.trim()) {
        Alert.alert("Tipo ente mancante", "Specifica il tipo di ente.");
        return false;
      }
    }
    if (step === 2) {
      if (!address.trim()) {
        Alert.alert("Sede mancante", "Inserisci la sede operativa.");
        return false;
      }
      if (!contactEmail.trim() || !contactEmail.includes("@")) {
        Alert.alert("Email non valida", "Inserisci un indirizzo email valido.");
        return false;
      }
      if (!phone.trim()) {
        Alert.alert("Telefono mancante", "Inserisci il numero di telefono.");
        return false;
      }
      if (!phoneVerified) {
        Alert.alert(
          "Telefono non verificato",
          "Verifica il numero di telefono prima di continuare.",
        );
        return false;
      }
    }
    if (step === 3) {
      if (!taxCode.trim()) {
        Alert.alert("Dati mancanti", "Inserisci il codice fiscale o la P.IVA.");
        return false;
      }
      if (!legalRepName.trim() || !legalRepSurname.trim()) {
        Alert.alert(
          "Referente mancante",
          "Inserisci nome e cognome del referente legale.",
        );
        return false;
      }
    }
    if (step === 4) {
      if (!idDocFileName) {
        Alert.alert(
          "Documento mancante",
          "Carica il documento d'identità del referente.",
        );
        return false;
      }
      const orgDocRequired = ["asd", "ssd", "societa", "azienda"].includes(
        entityType ?? "",
      );
      if (orgDocRequired && !orgDocFileName) {
        Alert.alert(
          "Documento mancante",
          "Carica il documento richiesto per il tipo di ente selezionato.",
        );
        return false;
      }
    }
    return true;
  }

  function isStepValid(): boolean {
    if (step === 1) {
      return (
        orgName.trim().length > 0 &&
        entityType !== null &&
        (entityType !== "altro" || customEntityType.trim().length > 0)
      );
    }
    if (step === 2)
      return (
        address.trim().length > 0 &&
        contactEmail.includes("@") &&
        phoneVerified
      );
    if (step === 3)
      return (
        taxCode.trim().length > 0 &&
        legalRepName.trim().length > 0 &&
        legalRepSurname.trim().length > 0
      );
    if (step === 4) {
      if (!idDocFileName) return false;
      const orgDocRequired = ["asd", "ssd", "societa", "azienda"].includes(
        entityType ?? "",
      );
      if (orgDocRequired && !orgDocFileName) return false;
      return true;
    }
    if (step === 5) return acceptTerms && acceptPrivacy && acceptConduct;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitOrganizerProfile(orgName.trim(), user?.token ?? "");
      addOrganizerProfile(orgName.trim());
      setSuccessPopup(true);
    } catch {
      Alert.alert("Errore", "Si è verificato un errore. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <StructureSchedule
        numberSteps={5}
        handleGenerate={handleSubmit}
        validateStep={validateStep}
        step={step}
        setStep={setStep}
        generating={submitting}
        stepTitles={STEP_TITLES_ORGANIZER}
        isStepValid={isStepValid}
        navigation={navigation}
        cancelTitle="Annulla registrazione"
        cancelMessage="Sei sicuro di voler annullare la creazione del profilo organizzatore?"
        lastStepLabel="Invia"
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 &&
            renderStep1({
              orgName,
              setOrgName,
              entityType,
              setEntityType,
              customEntityType,
              setCustomEntityType,
              description,
              setDescription,
            })}
          {step === 2 &&
            renderStep2({
              address,
              setAddress,
              setAddressLat,
              setAddressLng,
              addressLat,
              addressLng,
              contactEmail,
              setContactEmail,
              phone,
              setPhone,
              website,
              setWebsite,
              phoneSent,
              setPhoneSent,
              phoneVerified,
              setPhoneVerified,
              mockPhoneCode,
              setMockPhoneCode,
              phoneCodeInput,
              setPhoneCodeInput,
            })}
          {step === 3 &&
            renderStep3({
              taxCode,
              setTaxCode,
              legalRepName,
              setLegalRepName,
              legalRepSurname,
              setLegalRepSurname,
              legalForm,
              setLegalForm,
            })}
          {step === 4 &&
            renderStep4({
              entityType,
              idDocFileName,
              setIdDocFileName,
              setIdDocUri,
              orgDocFileName,
              setOrgDocFileName,
              setOrgDocUri,
            })}
          {step === 5 &&
            renderStep5({
              orgName,
              entityType,
              customEntityType,
              address,
              contactEmail,
              taxCode,
              legalRepName,
              legalRepSurname,
              idDocFileName,
              orgDocFileName,
              acceptTerms,
              setAcceptTerms,
              acceptPrivacy,
              setAcceptPrivacy,
              acceptConduct,
              setAcceptConduct,
            })}
        </ScrollView>
      </StructureSchedule>
      <Popup
        visible={successPopup}
        onClose={() => {
          setSuccessPopup(false);
          navigation.replace(NavigationEnum.MAIN_TABS);
        }}
        title="Profilo inviato!"
        message="Il tuo profilo organizzatore è stato inviato per la verifica. Riceverai una notifica entro 24–48 ore."
        variant="warning"
        icon="time-outline"
      />
    </>
  );
}
