import React from "react";
import { Text } from "react-native";
import { s } from "../CreateOrganizerProfile.styles";
import { colors } from "../../../theme/colors";
import { InputBox } from "../../../components/InputBox/InputBox";
import LocationSearch from "../../../components/LocationSearch/LocationSearch";

interface Step2Props {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setAddressLat: React.Dispatch<React.SetStateAction<number | undefined>>;
  setAddressLng: React.Dispatch<React.SetStateAction<number | undefined>>;
  addressLat: number | undefined;
  addressLng: number | undefined;
  contactEmail: string;
  setContactEmail: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  website: string;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
}

export function renderStep2({
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
}: Step2Props) {
  return (
    <>
      <Text style={s.sectionTitle}>Sede e Contatti</Text>
      <Text style={s.sectionSub}>
        Indica dove opera la tua organizzazione e come i partecipanti possono contattarti.
      </Text>

      <Text style={s.sectionLabel}>
        Sede operativa <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <LocationSearch
        setLocation={setAddress}
        initialValue={address}
        initialLat={addressLat}
        initialLng={addressLng}
        isConfirmed={!!address}
        onConfirm={(addr, lat, lng) => {
          setAddress(addr);
          setAddressLat(lat);
          setAddressLng(lng);
        }}
      />

      <Text style={s.sectionLabel}>
        Email pubblica di contatto <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <InputBox
        value={contactEmail}
        onChangeText={setContactEmail}
        placeholder="contatti@tuaorganizzazione.it"
        isDark={false}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={s.sectionLabel}>Telefono</Text>
      <InputBox
        value={phone}
        onChangeText={setPhone}
        placeholder="+39 333 000 0000 (opzionale)"
        isDark={false}
        keyboardType="phone-pad"
      />

      <Text style={s.sectionLabel}>Sito web</Text>
      <InputBox
        value={website}
        onChangeText={setWebsite}
        placeholder="https://tuaorganizzazione.it (opzionale)"
        isDark={false}
        autoCapitalize="none"
        keyboardType="url"
      />
    </>
  );
}
