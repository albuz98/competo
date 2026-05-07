import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { pStyles } from "../ProfilePlayer.styled";
import { GENDER_OPTIONS } from "../../../../constants/user";
import LocationSearch from "../../../../components/core/LocationSearch/LocationSearch";
import {
  ButtonBorderColored,
  ButtonFullColored,
} from "../../../../components/core/Button/Button";
import { InputBoxRow } from "../../../../components/core/InputBoxRow/InputBoxRow";
import { styles } from "../../Profile.styles";
import { useAuth } from "../../../../context/AuthContext";
import { Gender } from "../../../../types/user";
import { PlayerFormRef } from "../ProfilePlayer";
import { colors } from "../../../../theme/colors";
import { Ionicons } from "@expo/vector-icons";

interface EditProfileProps {
  gender: Gender | null;
  onGenderChange: (g: Gender) => void;
  onDirty?: () => void;
  formRef?: React.MutableRefObject<PlayerFormRef>;
  edit: boolean;
}

export const EditProfile = ({
  gender,
  onGenderChange,
  onDirty,
  formRef,
  edit,
}: EditProfileProps) => {
  const { user } = useAuth();
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    location: "",
    birthdate: "",
    email: "",
  });

  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    setCodeSent(false);
    setVerificationCode("");
    setEmailVerified(false);
  }, [form.email]);

  useEffect(() => {
    if (formRef) {
      formRef.current = { ...form, emailVerified };
    }
  }, [form, emailVerified]);

  useEffect(() => {
    if (edit) {
      setForm({
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        username: user?.username ?? "",
        location: user?.location ?? "",
        birthdate: user?.birthdate ?? "",
        email: user?.email ?? "",
      });
    }
  }, [edit]);

  const updateForm = (patch: Partial<typeof form>) => {
    setForm((f) => ({ ...f, ...patch }));
    onDirty?.();
  };

  const formatBirthdate = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
  };

  const handleSetLocation: React.Dispatch<React.SetStateAction<string>> = (
    v,
  ) => {
    setForm((f) => ({
      ...f,
      location: typeof v === "function" ? v(f.location) : v,
    }));
    onDirty?.();
  };

  const handleSendCode = async () => {
    setSendingCode(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSendingCode(false);
    setCodeSent(true);
  };

  const handleVerifyCode = async () => {
    setVerifyingCode(true);
    await new Promise((r) => setTimeout(r, 800));
    setVerifyingCode(false);
    if (verificationCode === "123456") {
      setEmailVerified(true);
    } else {
      Alert.alert(
        "Codice non valido",
        "Il codice inserito non è corretto. Riprova.",
      );
    }
  };

  if (!user) return;

  return (
    <View style={styles.cardEditFields}>
      <InputBoxRow
        label="Username"
        value={form.username}
        onChangeText={(v) => updateForm({ username: v })}
        disabled
      />
      <InputBoxRow
        label="Nome"
        placeholder="Nome"
        value={form.first_name}
        onChangeText={(v) => updateForm({ first_name: v })}
      />
      <InputBoxRow
        label="Cognome"
        placeholder="Cognome"
        value={form.last_name}
        onChangeText={(v) => updateForm({ last_name: v })}
      />
      <InputBoxRow
        label="Data di nascita"
        value={form.birthdate}
        keyboardType="number-pad"
        maxLength={10}
        placeholder="gg-mm-aaaa"
        onChangeText={(v) => updateForm({ birthdate: formatBirthdate(v) })}
      />
      <InputBoxRow
        label="Email"
        placeholder="Email"
        value={form.email}
        keyboardType="email-address"
        autoCorrect={false}
        onChangeText={(v) => updateForm({ email: v })}
      />
      {form.email.length > 0 &&
        !emailVerified &&
        (!user.isEmailConfirmed || form.email !== user.email) && (
          <View style={pStyles.sendCodeRow}>
            <ButtonBorderColored
              isColored
              handleBtn={handleSendCode}
              loading={sendingCode}
              text={codeSent ? "Riinvia codice" : "Invia codice conferma"}
            />
            {codeSent && (
              <>
                <InputBoxRow
                  label="Codice di verifica"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder="123456"
                />
                <ButtonFullColored
                  text="Conferma email"
                  handleBtn={handleVerifyCode}
                  isDisabled={verificationCode.length < 6 || verifyingCode}
                  loading={verifyingCode}
                  isColored
                />
              </>
            )}
          </View>
        )}
      {emailVerified && (
        <View style={pStyles.emailVerifiedRow}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={pStyles.emailVerifiedText}>Email verificata</Text>
        </View>
      )}
      <View style={pStyles.locationSection}>
        <Text style={pStyles.locationLabel}>Posizione</Text>
        <LocationSearch
          key={`location-${edit}`}
          setLocation={handleSetLocation}
          initialValue={user?.location ?? ""}
          isConfirmed={!!user?.location}
          onConfirm={(address) => setForm((f) => ({ ...f, location: address }))}
          isRow
        />
      </View>
      <View style={pStyles.genderRow}>
        <Text style={pStyles.genderLabel}>Sesso</Text>
        <View style={pStyles.genderOptions}>
          {GENDER_OPTIONS.map((opt, idx) => {
            const selected = gender === opt.value;
            const isFirst = idx === 0;
            const isLast = idx === GENDER_OPTIONS.length - 1;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  pStyles.genderOption,
                  selected && pStyles.genderOptionSelected,
                  isFirst && pStyles.genderOptionFirst,
                  isLast && pStyles.genderOptionLast,
                ]}
                onPress={() => onGenderChange(opt.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    pStyles.genderOptionText,
                    selected && pStyles.genderOptionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
