import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ls, s } from "../CreateOrganizerProfile.styles";
import { colors } from "../../../theme/colors";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import LocationSearch from "../../../components/core/LocationSearch/LocationSearch";

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
  phoneSent: boolean;
  setPhoneSent: React.Dispatch<React.SetStateAction<boolean>>;
  phoneVerified: boolean;
  setPhoneVerified: React.Dispatch<React.SetStateAction<boolean>>;
  mockPhoneCode: string;
  setMockPhoneCode: React.Dispatch<React.SetStateAction<string>>;
  phoneCodeInput: string;
  setPhoneCodeInput: React.Dispatch<React.SetStateAction<string>>;
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
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
  phoneSent,
  setPhoneSent,
  phoneVerified,
  setPhoneVerified,
  mockPhoneCode,
  setMockPhoneCode,
  phoneCodeInput,
  setPhoneCodeInput,
}: Step2Props) {
  const phoneIsValid = phone.replace(/\s/g, "").length >= 9;

  const handleSendCode = () => {
    const code = generateCode();
    setMockPhoneCode(code);
    setPhoneSent(true);
    setPhoneCodeInput("");
    setPhoneVerified(false);
  };

  const handleVerify = () => {
    if (phoneCodeInput.trim() === mockPhoneCode) {
      setPhoneVerified(true);
    } else {
      setPhoneVerified(false);
    }
  };

  return (
    <>
      <Text style={s.sectionTitle}>Sede e Contatti</Text>
      <Text style={s.sectionSub}>
        Indica dove opera la tua organizzazione e come i partecipanti possono
        contattarti.
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
        Email pubblica di contatto{" "}
        <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <InputBox
        value={contactEmail}
        onChangeText={setContactEmail}
        placeholder="contatti@tuaorganizzazione.it"
        isDark={false}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={s.sectionLabel}>
        Telefono <Text style={{ color: colors.primary }}>*</Text>
      </Text>

      {phoneVerified ? (
        <View style={ls.verifiedBox}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={ls.verifiedText}>Numero verificato: {phone}</Text>
        </View>
      ) : (
        <>
          <InputBox
            value={phone}
            onChangeText={(v) => {
              setPhone(v);
              if (phoneSent) {
                setPhoneSent(false);
                setMockPhoneCode("");
                setPhoneCodeInput("");
              }
            }}
            placeholder="+39 333 000 0000"
            isDark={false}
            keyboardType="phone-pad"
          />

          {phoneIsValid && (
            <Pressable
              style={[ls.sendBtn, phoneSent && ls.sendBtnAlt]}
              onPress={handleSendCode}
            >
              <Text style={ls.sendBtnText}>
                {phoneSent ? "Rinvia codice" : "Invia codice"}
              </Text>
            </Pressable>
          )}

          {phoneSent && (
            <>
              <View style={ls.mockSmsBox}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={16}
                  color={colors.darkBlue}
                />
                <Text style={ls.mockSmsText}>
                  {"SMS simulato → "}
                  <Text style={{ fontWeight: "700" }}>{phone}</Text>
                  {"\nCodice: "}
                  <Text style={ls.mockSmsCode}>{mockPhoneCode}</Text>
                </Text>
              </View>

              <Text style={[s.sectionLabel, { marginTop: 12 }]}>
                Inserisci il codice ricevuto{" "}
                <Text style={{ color: colors.primary }}>*</Text>
              </Text>
              <InputBox
                value={phoneCodeInput}
                onChangeText={setPhoneCodeInput}
                placeholder="000000"
                isDark={false}
                keyboardType="number-pad"
              />

              {phoneCodeInput.length === 6 && !phoneVerified && (
                <Pressable style={ls.verifyBtn} onPress={handleVerify}>
                  <Text style={ls.verifyBtnText}>Verifica numero</Text>
                </Pressable>
              )}

              {phoneSent && phoneCodeInput.length === 6 && !phoneVerified && (
                <View style={ls.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color={colors.danger}
                  />
                  <Text style={ls.errorText}>
                    Inserisci il codice corretto e premi "Verifica numero".
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}

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
