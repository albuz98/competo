import { Text } from "react-native";
import { s } from "../CreateTournamentSchedule.styles";
import { colors } from "../../../theme/colors";
import LocationSearch from "../../../components/LocationSearch/LocationSearch";
import { InputBox } from "../../../components/InputBox/InputBox";

interface renderStep1Props {
  tournamentName: string;
  setTournamentName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  setLocationLat: React.Dispatch<React.SetStateAction<number | undefined>>;
  setLocationLng: React.Dispatch<React.SetStateAction<number | undefined>>;
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
}: renderStep1Props) {
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
        placeholder="Es. Torneo Primavera 2026"
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
        onConfirm={(address, lat, lng) => {
          setLocation(address);
          setLocationLat(lat);
          setLocationLng(lng);
        }}
      />
    </>
  );
}
