import React from "react";
import { Text } from "react-native";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import { s } from "../CreateRefereeProfile.styles";

type Props = {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  birthdate: string;
  setBirthdate: (v: string) => void;
  taxCode: string;
  setTaxCode: (v: string) => void;
  onOpenDatePicker: () => void;
};

export function Step1({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthdate,
  setBirthdate,
  taxCode,
  setTaxCode,
  onOpenDatePicker,
}: Props) {
  return (
    <>
      <Text style={s.sectionTitle}>Dati personali</Text>
      <Text style={s.sectionSub}>
        Inserisci il tuo nome e cognome così come appaiono nel tesserino
        dell'associazione arbitrale.
      </Text>

      <InputBox
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Nome"
        isDark={false}
        labelName="Nome"
        isObbligatory
      />

      <InputBox
        value={lastName}
        onChangeText={setLastName}
        placeholder="Cognome"
        isDark={false}
        labelName="Cognome"
        isObbligatory
      />

      <InputBox
        value={birthdate}
        onChangeText={setBirthdate}
        placeholder="Data di nascita"
        isDark={false}
        labelName="Data di nascita"
        isObbligatory
        handleOnFocus={onOpenDatePicker}
      />

      <InputBox
        value={taxCode}
        onChangeText={setTaxCode}
        placeholder="Codice fiscale"
        isDark={false}
        labelName="Codice fiscale"
        isObbligatory
      />
    </>
  );
}
