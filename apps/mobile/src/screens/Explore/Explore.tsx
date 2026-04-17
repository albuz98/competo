import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  TextInput,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import type { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import {
  type RootStackParamList,
  NavigationEnum,
} from "../../types/navigation";
import { styles } from "./Explore.styles";
import {
  ButtonBorderColored,
  ButtonFullColored,
  ButtonGeneric,
  ButtonIcon,
  ButtonSelectable,
} from "../../components/core/Button/Button";
import { colors } from "../../theme/colors";
import { ModalViewer } from "../../components/core/Modal/Modal";
import { generateTournaments } from "../../mock/tournaments";
import { Tournament } from "../../types/tournament";

const DEFAULT = { lat: 45.4642, lng: 9.19 }; // Milan fallback
const RADIUS_OPTIONS = [5, 10, 20, 50];

function genNearby(lat: number, lng: number, radiusKm: number): Tournament[] {
  const deg = (radiusKm * 1000) / 111_000;
  return generateTournaments(10).map((t) => ({
    ...t,
    lat: lat + (Math.random() - 0.5) * deg * 1.6,
    lng: lng + (Math.random() - 0.5) * deg * 1.6,
  }));
}

export default function Explore() {
  const { location } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  // Local state — edits here stay local, never update profile/home
  const [exploraLocation, setExploraLocation] = useState<string | undefined>(
    () => location ?? undefined,
  );
  const [exploraRadius, setExploraRadius] = useState(10);

  // Map state
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [geoLoading, setGeoLoading] = useState(true);

  // Selected tournament (map pin tap)
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [modalLoc, setModalLoc] = useState("");
  const [modalRadius, setModalRadius] = useState(10);

  // Flag to skip geocoding when recenter sets center directly
  const skipGeocode = useRef(false);

  // Toast for city-not-found
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const showToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, 3500);
  };

  // Effect 1: geocode exploraLocation → update center
  useEffect(() => {
    if (skipGeocode.current) {
      skipGeocode.current = false;
      setGeoLoading(false);
      return;
    }
    let cancelled = false;
    setGeoLoading(true);

    async function resolve() {
      if (exploraLocation) {
        try {
          const results = await Location.geocodeAsync(exploraLocation);
          if (!cancelled && results.length > 0) {
            const { latitude: lat, longitude: lng } = results[0];
            setCenter({ lat, lng });
            return;
          }
          // City not found — show toast and fall through to GPS
          if (!cancelled) showToast();
        } catch {
          if (!cancelled) showToast();
        }
      }
      // Try GPS
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
          if (!cancelled) {
            skipGeocode.current = true;
            setExploraLocation(undefined); // badge → "Posizione attuale"
            setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            return;
          }
        }
      } catch {
        // fall through
      }
      // Default to Milan
      if (!cancelled) {
        if (exploraLocation) {
          skipGeocode.current = true;
          setExploraLocation(undefined);
        }
        setCenter(DEFAULT);
      }
    }

    resolve().finally(() => {
      if (!cancelled) setGeoLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [exploraLocation]);

  // Effect 2: regenerate tournaments when center or radius changes
  useEffect(() => {
    if (!center) return;
    setTournaments(genNearby(center.lat, center.lng, exploraRadius));
  }, [center, exploraRadius]);

  const handleRecenter = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      setGeoLoading(true);
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
      skipGeocode.current = true;
      setExploraLocation(undefined); // badge → "Posizione attuale"
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setGeoLoading(false);
    } catch {
      setGeoLoading(false);
    }
  };

  const openEdit = () => {
    setModalLoc(exploraLocation ?? "");
    setModalRadius(exploraRadius);
    setEditModal(true);
    // openModal()
  };

  const applyEdit = () => {
    const trimmed = modalLoc.trim();
    if (trimmed) setExploraLocation(trimmed);
    setExploraRadius(modalRadius);
    setEditModal(false);
  };

  // First load: show full spinner until we have a center
  if (geoLoading && !center) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color={colors.primaryGradientMid} />
        <Text style={styles.loadingText}>Caricamento mappa…</Text>
      </View>
    );
  }

  if (!center) return null;

  const radiusDeg = (exploraRadius * 1000) / 111_000;
  const region: Region = {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: radiusDeg * 3.2,
    longitudeDelta: radiusDeg * 3.2,
  };

  return (
    <View style={styles.root}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Circle
          center={{ latitude: center.lat, longitude: center.lng }}
          radius={exploraRadius * 1000}
          strokeColor={colors.danger}
          strokeWidth={2.5}
          fillColor="rgba(232,96,26,0.10)"
        />

        {/* Center pin */}
        <Marker
          coordinate={{ latitude: center.lat, longitude: center.lng }}
          anchor={{ x: 0.5, y: 1 }}
          zIndex={10}
        >
          <View style={styles.centerPin}>
            <Ionicons name="location-sharp" size={20} color={colors.white} />
          </View>
        </Marker>

        {tournaments.map((t) =>
          t.lat != null && t.lng != null ? (
            <Marker
              key={t.id}
              coordinate={{ latitude: t.lat, longitude: t.lng }}
              onPress={() => setSelectedTournament(t)}
            >
              <View
                style={[
                  styles.pin,
                  selectedTournament?.id === t.id && styles.pinSelected,
                ]}
              >
                <Text style={styles.pinEmoji}>🏆</Text>
              </View>
            </Marker>
          ) : null,
        )}
      </MapView>

      {/* Tournament bottom card */}
      {selectedTournament && (
        <View style={[styles.tournamentCard, { bottom: insets.bottom + 90 }]}>
          <ButtonIcon
            handleBtn={() => setSelectedTournament(null)}
            icon={
              <Ionicons name="close" size={18} color={colors.placeholder} />
            }
            style={styles.tournamentCardDismiss}
          />
          <Text style={styles.tournamentCardName} numberOfLines={2}>
            {selectedTournament.name}
          </Text>
          <View style={styles.tournamentCardRow}>
            <Ionicons
              name="football-outline"
              size={13}
              color={colors.primaryGradientMid}
            />
            <Text style={styles.tournamentCardGame}>
              {selectedTournament.game}
            </Text>
            <View style={styles.tournamentCardDot} />
            <Ionicons
              name="cash-outline"
              size={13}
              color={colors.placeholder}
            />
            <Text style={styles.tournamentCardMeta}>
              {selectedTournament.entryFee}
            </Text>
            <View style={styles.tournamentCardDot} />
            <Ionicons
              name="people-outline"
              size={13}
              color={colors.placeholder}
            />
            <Text style={styles.tournamentCardMeta}>
              {selectedTournament.currentParticipants}/
              {selectedTournament.maxParticipants}
            </Text>
          </View>
          <ButtonFullColored
            text="Vedi dettagli"
            iconRight={
              <Ionicons name="arrow-forward" size={15} color={colors.white} />
            }
            handleBtn={() => {
              setSelectedTournament(null);
              navigation.navigate(NavigationEnum.TOURNAMENT_DETAIL, {
                tournamentId: selectedTournament.id,
              });
            }}
            isColored
          />
        </View>
      )}

      {/* Top badge — tappable to edit */}
      <ButtonGeneric
        handleBtn={openEdit}
        style={[styles.badge, { top: insets.top + 12 }]}
      >
        {geoLoading ? (
          <ActivityIndicator
            size="small"
            color={colors.primaryGradientMid}
            style={{ marginRight: 4 }}
          />
        ) : (
          <Ionicons
            name="location-sharp"
            size={14}
            color={colors.primaryGradientMid}
          />
        )}
        <Text style={styles.badgeText} numberOfLines={1}>
          {exploraLocation ?? "Posizione attuale"}
        </Text>
        <View style={styles.badgeDivider} />
        <Text style={styles.badgeRadius}>{exploraRadius} km</Text>
        <Ionicons name="chevron-down" size={13} color={colors.placeholder} />
      </ButtonGeneric>

      {/* City-not-found toast */}
      <Animated.View
        style={[
          styles.toast,
          { top: insets.top + 62 },
          {
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-8, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Ionicons name="warning-outline" size={15} color={colors.white} />
        <Text style={styles.toastText}>
          Città non trovata. Uso posizione attuale.
        </Text>
      </Animated.View>

      {/* Recenter button */}
      <ButtonIcon
        handleBtn={handleRecenter}
        icon={
          <Ionicons name="locate" size={22} color={colors.primaryGradientMid} />
        }
        style={[styles.recenterBtn, { bottom: insets.bottom + 90 }]}
      />
      <ModalViewer isOpen={editModal} onClose={() => setEditModal(false)}>
        <Text style={styles.modalTitle}>Modifica area di ricerca</Text>
        <Text style={styles.modalLabel}>POSIZIONE</Text>
        <View style={styles.modalInputRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color={colors.primaryGradientMid}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.modalInput}
            value={modalLoc}
            onChangeText={setModalLoc}
            placeholder="Nome città"
            placeholderTextColor={colors.placeholder}
            returnKeyType="done"
          />
          {modalLoc.length > 0 && (
            <ButtonIcon
              icon={
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.grayDark}
                />
              }
              handleBtn={() => setModalLoc("")}
            />
          )}
        </View>

        <Text style={styles.modalLabel}>RAGGIO DI RICERCA</Text>
        <View style={styles.radiusRow}>
          {RADIUS_OPTIONS.map((r) => (
            <ButtonSelectable
              key={r}
              handleBtn={() => setModalRadius(r)}
              text={`${r} km`}
              isSelected={modalRadius === r}
            />
          ))}
        </View>

        <ButtonBorderColored text="Applica" handleBtn={applyEdit} isColored />
      </ModalViewer>
    </View>
  );
}
