import { Text, TouchableOpacity, View } from "react-native";
import { s } from "../CreateTournamentSchedule.styles";
import { colors } from "../../../theme/colors";
import LocationSearch from "../../../components/core/LocationSearch/LocationSearch";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";

interface renderStep1Props {
  tournamentName: string;
  setTournamentName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  setLocationLat: React.Dispatch<React.SetStateAction<number | undefined>>;
  setLocationLng: React.Dispatch<React.SetStateAction<number | undefined>>;
  locationLat: number | undefined;
  locationLng: number | undefined;
  regulationFileName: string | null;
  setRegulationFileName: React.Dispatch<React.SetStateAction<string | null>>;
  setRegulationFileUri: React.Dispatch<React.SetStateAction<string | null>>;
}

export function renderStep1({
  setTournamentName,
  tournamentName,
  description,
  setDescription,
  location,
  setLocation,
  setLocationLat,
  setLocationLng,
  locationLat,
  locationLng,
  regulationFileName,
  setRegulationFileName,
  setRegulationFileUri,
}: renderStep1Props) {
  async function pickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setRegulationFileName(asset.name);
    setRegulationFileUri(asset.uri);
  }

  function clearPdf() {
    setRegulationFileName(null);
    setRegulationFileUri(null);
  }

  return (
    <>
      <Text style={s.sectionTitle}>Info Torneo</Text>
      <Text style={s.sectionSub}>
        Inserisci le informazioni principali del torneo.
      </Text>

      <Text style={s.sectionLabel}>
        Nome del torneo <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <InputBox
        value={tournamentName}
        onChangeText={setTournamentName}
        placeholder="Nome torneo"
        isDark={false}
      />

      <Text style={s.sectionLabel}>Descrizione</Text>
      <InputBox
        value={description}
        onChangeText={setDescription}
        placeholder="Descrivi il torneo (opzionale)"
        isDark={false}
        isMultiline
        numberOfLines={5}
      />

      <Text style={s.sectionLabel}>
        Luogo <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <LocationSearch
        setLocation={setLocation}
        initialValue={location}
        initialLat={locationLat}
        initialLng={locationLng}
        isConfirmed={!!location}
        onConfirm={(address, lat, lng) => {
          setLocation(address);
          setLocationLat(lat);
          setLocationLng(lng);
        }}
      />

      <Text style={s.sectionLabel}>Regolamento</Text>
      {regulationFileName ? (
        <View style={s.pdfRow}>
          <Ionicons
            name="document-text-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={s.pdfFileName} numberOfLines={1}>
            {regulationFileName}
          </Text>
          <TouchableOpacity onPress={clearPdf} hitSlop={8}>
            <Feather name="x" size={18} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.pdfPickerBtn} onPress={pickPdf}>
          <Ionicons
            name="cloud-upload-outline"
            size={18}
            color={colors.grayDark}
          />
          <Text style={s.pdfPickerText}>Carica regolamento (solo PDF)</Text>
        </TouchableOpacity>
      )}
    </>
  );
}
