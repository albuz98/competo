import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import type { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { generateTournaments } from "../../mock/data";
import type { Tournament, RootStackParamList } from "../../types";
import { styles } from "./Explore.styles";
import {
  ButtonBorderColored,
  ButtonFullColored,
  ButtonGeneric,
  ButtonIcon,
  ButtonSelectable,
} from "../../components/Button/Button";

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

  // Modal swipe-to-dismiss
  const panY = useRef(new Animated.Value(600)).current;

  const openModal = () => {
    panY.setValue(600);
    setEditModal(true);
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 2,
    }).start();
  };

  const dismissModal = () => {
    Animated.timing(panY, {
      toValue: 600,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setEditModal(false);
      panY.setValue(600);
    });
  };

  const modalPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) panY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 60 || vy > 0.5) {
          dismissModal();
        } else {
          Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

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
    openModal();
  };

  const applyEdit = () => {
    const trimmed = modalLoc.trim();
    if (trimmed) setExploraLocation(trimmed);
    setExploraRadius(modalRadius);
    dismissModal();
  };

  // First load: show full spinner until we have a center
  if (geoLoading && !center) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color="#E8601A" />
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
          strokeColor="#C44E0A"
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
            <Ionicons name="location-sharp" size={20} color="#fff" />
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
            icon={<Ionicons name="close" size={18} color="#94a3b8" />}
            style={styles.tournamentCardDismiss}
          />
          <Text style={styles.tournamentCardName} numberOfLines={2}>
            {selectedTournament.name}
          </Text>
          <View style={styles.tournamentCardRow}>
            <Ionicons name="football-outline" size={13} color="#E8601A" />
            <Text style={styles.tournamentCardGame}>
              {selectedTournament.game}
            </Text>
            <View style={styles.tournamentCardDot} />
            <Ionicons name="cash-outline" size={13} color="#64748b" />
            <Text style={styles.tournamentCardMeta}>
              {selectedTournament.entryFee}
            </Text>
            <View style={styles.tournamentCardDot} />
            <Ionicons name="people-outline" size={13} color="#64748b" />
            <Text style={styles.tournamentCardMeta}>
              {selectedTournament.currentParticipants}/
              {selectedTournament.maxParticipants}
            </Text>
          </View>
          <ButtonFullColored
            text="Vedi dettagli"
            iconRight={<Ionicons name="arrow-forward" size={15} color="#fff" />}
            handleBtn={() => {
              setSelectedTournament(null);
              navigation.navigate("TournamentDetail", {
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
            color="#E8601A"
            style={{ marginRight: 4 }}
          />
        ) : (
          <Ionicons name="location-sharp" size={14} color="#E8601A" />
        )}
        <Text style={styles.badgeText} numberOfLines={1}>
          {exploraLocation ?? "Posizione attuale"}
        </Text>
        <View style={styles.badgeDivider} />
        <Text style={styles.badgeRadius}>{exploraRadius} km</Text>
        <Ionicons name="chevron-down" size={13} color="#94a3b8" />
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
        <Ionicons name="warning-outline" size={15} color="#fff" />
        <Text style={styles.toastText}>
          Città non trovata. Uso posizione attuale.
        </Text>
      </Animated.View>

      {/* Recenter button */}
      <ButtonIcon
        handleBtn={handleRecenter}
        icon={<Ionicons name="locate" size={22} color="#E8601A" />}
        style={[styles.recenterBtn, { bottom: insets.bottom + 90 }]}
      />

      {/* Edit modal */}
      <Modal
        visible={editModal}
        transparent
        animationType="none"
        onRequestClose={dismissModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ButtonGeneric style={styles.modalDismiss} handleBtn={dismissModal} />
          <Animated.View
            style={[styles.modalCard, { transform: [{ translateY: panY }] }]}
          >
            <View {...modalPanResponder.panHandlers} style={styles.dragZone}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Modifica area di ricerca</Text>
            </View>
            <Text style={styles.modalLabel}>POSIZIONE</Text>
            <View style={styles.modalInputRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#E8601A"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.modalInput}
                value={modalLoc}
                onChangeText={setModalLoc}
                placeholder="Es. Milano, Napoli..."
                placeholderTextColor="#94a3b8"
                returnKeyType="done"
              />
              {modalLoc.length > 0 && (
                <ButtonIcon
                  icon={
                    <Ionicons name="close-circle" size={18} color="#cbd5e1" />
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

            <ButtonBorderColored
              text="Applica"
              handleBtn={applyEdit}
              isColored
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
