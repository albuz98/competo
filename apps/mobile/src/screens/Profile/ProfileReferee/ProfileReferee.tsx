import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RefereeProfile } from "../../../types/user";
import { styles } from "../Profile.styles";
import { rStyles } from "./ProfileReferee.styles";
import { colors } from "../../../theme/colors";

interface ProfileRefereeProps {
  currentProfile: RefereeProfile;
}

export default function ProfileReferee({ currentProfile }: ProfileRefereeProps) {
  const insets = useSafeAreaInsets();
  const isPending = currentProfile.pendingApproval === true;

  const rateLabel =
    currentProfile.rateType === "ora"
      ? `€${currentProfile.baseRate}/ora`
      : `€${currentProfile.baseRate}/partita`;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
    >
      {/* Banner pending approval */}
      {isPending && (
        <View style={rStyles.pendingBanner}>
          <Ionicons name="time-outline" size={20} color={colors.primaryGradientMid} />
          <View style={rStyles.pendingBannerBody}>
            <Text style={rStyles.pendingBannerTitle}>
              Profilo in attesa di approvazione
            </Text>
            <Text style={rStyles.pendingBannerText}>
              Il team Competo sta verificando i tuoi documenti. Riceverai una
              notifica entro 24–48 ore.
            </Text>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={rStyles.headerCard}>
        <View style={rStyles.headerRow}>
          <View style={rStyles.avatarCircle}>
            <Ionicons name="shirt-outline" size={30} color={colors.primary} />
          </View>
          <View style={rStyles.headerInfo}>
            <Text style={rStyles.name}>
              {currentProfile.firstName} {currentProfile.lastName}
            </Text>
            <Text style={rStyles.association}>
              {currentProfile.association}
              {currentProfile.memberSection ? ` · Sez. ${currentProfile.memberSection}` : ""}
            </Text>
            <View style={rStyles.memberChip}>
              <Text style={rStyles.memberChipText}>
                Tessera #{currentProfile.memberNumber}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sport e categorie */}
      <View style={rStyles.sectionHeader}>
        <Ionicons name="football-outline" size={16} color={colors.dark} />
        <Text style={rStyles.sectionTitle}>Sport e categorie</Text>
      </View>
      <View style={rStyles.card}>
        <View style={rStyles.tagsRow}>
          {currentProfile.sports.map((sport) => (
            <View key={sport} style={rStyles.tag}>
              <Text style={rStyles.tagText}>{sport}</Text>
            </View>
          ))}
        </View>
        <View style={[rStyles.tagsRow, { borderTopWidth: 1, borderTopColor: colors.gray }]}>
          {currentProfile.categories.map((cat) => (
            <View key={cat} style={[rStyles.tag, { backgroundColor: colors.purpleBlueBg }]}>
              <Text style={[rStyles.tagText, { color: colors.purpleBlue }]}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tariffe */}
      <View style={rStyles.sectionHeader}>
        <Ionicons name="card-outline" size={16} color={colors.dark} />
        <Text style={rStyles.sectionTitle}>Tariffe</Text>
      </View>
      <View style={rStyles.card}>
        <View style={rStyles.row}>
          <Text style={rStyles.rowLabel}>Tariffa base</Text>
          <Text style={rStyles.rowValue}>{rateLabel}</Text>
        </View>
        <View style={[rStyles.row, rStyles.rowLast]}>
          <Text style={rStyles.rowLabel}>Ore consecutive</Text>
          <Text style={rStyles.rowValue}>{currentProfile.consecutiveHoursRange}h</Text>
        </View>
      </View>

      {/* Disponibilità trasferta */}
      <View style={rStyles.sectionHeader}>
        <Ionicons name="car-outline" size={16} color={colors.dark} />
        <Text style={rStyles.sectionTitle}>Trasferte</Text>
      </View>
      <View style={rStyles.card}>
        <View style={rStyles.row}>
          <Text style={rStyles.rowLabel}>Disponibile</Text>
          <Text style={rStyles.rowValue}>
            {currentProfile.travelAvailable ? "Sì" : "No"}
          </Text>
        </View>
        {currentProfile.travelAvailable && (
          <>
            <View style={rStyles.row}>
              <Text style={rStyles.rowLabel}>Distanza max</Text>
              <Text style={rStyles.rowValue}>
                {currentProfile.maxTravelKm
                  ? `${currentProfile.maxTravelKm} km`
                  : "Illimitata"}
              </Text>
            </View>
            <View style={[rStyles.row, rStyles.rowLast]}>
              <Text style={rStyles.rowLabel}>Rimborso km</Text>
              <Text style={rStyles.rowValue}>
                {currentProfile.travelRatePerKm
                  ? `€${currentProfile.travelRatePerKm}/km`
                  : "—"}
              </Text>
            </View>
          </>
        )}
        {!currentProfile.travelAvailable && (
          <View style={[rStyles.row, rStyles.rowLast]}>
            <Text style={rStyles.rowLabel}>Solo partite in zona</Text>
            <Text style={rStyles.rowValue} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
