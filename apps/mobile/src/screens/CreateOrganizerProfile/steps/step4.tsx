import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import * as DocumentPicker from "expo-document-picker";
import { s } from "../CreateOrganizerProfile.styles";
import { colors } from "../../../theme/colors";
import { EntityType } from "../../../types/organizer";
import { getOrgDocConfig } from "../../../functions/organizer";

interface Step4Props {
  entityType: EntityType | null;
  idDocFileName: string | null;
  setIdDocFileName: (v: string | null) => void;
  setIdDocUri: (v: string | null) => void;
  orgDocFileName: string | null;
  setOrgDocFileName: (v: string | null) => void;
  setOrgDocUri: (v: string | null) => void;
}

export function renderStep4({
  entityType,
  idDocFileName,
  setIdDocFileName,
  setIdDocUri,
  orgDocFileName,
  setOrgDocFileName,
  setOrgDocUri,
}: Step4Props) {
  const orgDocConfig = getOrgDocConfig(entityType);

  async function pickIdDoc() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/jpeg", "image/png"],
      copyToCacheDirectory: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setIdDocFileName(asset.name);
    setIdDocUri(asset.uri);
  }

  async function pickOrgDoc() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setOrgDocFileName(asset.name);
    setOrgDocUri(asset.uri);
  }

  return (
    <>
      <Text style={s.sectionTitle}>Documenti di Verifica</Text>
      <Text style={s.sectionSub}>
        Carica i documenti necessari per verificare la tua identità e la
        legittimità dell'organizzazione.
      </Text>

      {/* ── Documento d'identità ───────────────────────── */}
      <Text style={s.sectionLabel}>
        Documento d'identità del referente{" "}
        <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <Text
        style={{ fontSize: 11, color: colors.placeholder, marginBottom: 8 }}
      >
        Carta d'identità, patente o passaporto (PDF o immagine)
      </Text>
      {idDocFileName ? (
        <View style={s.pdfRow}>
          <Ionicons
            name="document-text-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={s.pdfFileName} numberOfLines={1}>
            {idDocFileName}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIdDocFileName(null);
              setIdDocUri(null);
            }}
            hitSlop={8}
          >
            <Feather name="x" size={18} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.pdfPickerBtn} onPress={pickIdDoc}>
          <Ionicons
            name="cloud-upload-outline"
            size={18}
            color={colors.grayDark}
          />
          <Text style={s.pdfPickerText}>Carica documento d'identità</Text>
        </TouchableOpacity>
      )}

      {/* ── Documento dell'ente (contestuale) ─────────── */}
      {orgDocConfig && (
        <>
          <Text style={[s.sectionLabel, { marginTop: 20 }]}>
            {orgDocConfig.label}{" "}
            {orgDocConfig.required && (
              <Text style={{ color: colors.primary }}>*</Text>
            )}
          </Text>
          <Text
            style={{ fontSize: 11, color: colors.placeholder, marginBottom: 8 }}
          >
            {orgDocConfig.hint}
          </Text>
          {orgDocFileName ? (
            <View style={s.pdfRow}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={s.pdfFileName} numberOfLines={1}>
                {orgDocFileName}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setOrgDocFileName(null);
                  setOrgDocUri(null);
                }}
                hitSlop={8}
              >
                <Feather name="x" size={18} color={colors.placeholder} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={s.pdfPickerBtn} onPress={pickOrgDoc}>
              <Ionicons
                name="cloud-upload-outline"
                size={18}
                color={colors.grayDark}
              />
              <Text style={s.pdfPickerText}>
                Carica {orgDocConfig.label.toLowerCase()}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <View style={[s.infoBox, { marginTop: 20 }]}>
        <Ionicons
          name="lock-closed-outline"
          size={18}
          color={colors.primaryGradientMid}
        />
        <Text style={s.infoBoxText}>
          I tuoi documenti sono trattati in modo sicuro e non sono mai condivisi
          pubblicamente. Vengono utilizzati esclusivamente per la verifica
          dell'identità.
        </Text>
      </View>
    </>
  );
}
