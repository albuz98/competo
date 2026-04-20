import { Text, TextInput, View } from "react-native";
import { s } from "../CreateTournamentSchedule.styles";
import { colors } from "../../../theme/colors";
import LocationSearch from "../../../components/core/LocationSearch/LocationSearch";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import { Ionicons } from "@expo/vector-icons";

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
  tournamentCost: string;
  setTournamentCost: React.Dispatch<React.SetStateAction<string>>;
  insuranceCost: string;
  setInsuranceCost: React.Dispatch<React.SetStateAction<string>>;
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
  tournamentCost,
  setTournamentCost,
  insuranceCost,
  setInsuranceCost,
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

      <Text style={s.sectionLabel}>Costi</Text>
      <View style={s.costRow}>
        <View style={s.costBox}>
          <View style={s.costIconWrap}>
            <Ionicons name="card-outline" size={16} color={colors.primary} />
          </View>
          <View style={s.costBody}>
            <Text style={s.costLabel}>Costo iscrizione</Text>
            <Text style={s.costSub}>Per squadra</Text>
          </View>
          <TextInput
            value={tournamentCost}
            onChangeText={setTournamentCost}
            placeholder="0"
            placeholderTextColor={colors.placeholder}
            keyboardType="decimal-pad"
            style={s.costInput}
          />
          <Text style={s.costCurrency}>€</Text>
        </View>
        <View style={s.costBox}>
          <View style={s.costIconWrap}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={colors.success}
            />
          </View>
          <View style={s.costBody}>
            <Text style={s.costLabel}>Assicurazione</Text>
            <Text style={s.costSub}>Per componente</Text>
          </View>
          <TextInput
            value={insuranceCost}
            onChangeText={setInsuranceCost}
            placeholder="0"
            placeholderTextColor={colors.placeholder}
            keyboardType="decimal-pad"
            style={s.costInput}
          />
          <Text style={s.costCurrency}>€</Text>
        </View>
      </View>
    </>
  );
}
