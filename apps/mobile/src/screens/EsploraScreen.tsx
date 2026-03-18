import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import MapView, { Circle, Marker, Callout } from "react-native-maps";
import type { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { generateTournaments } from "../mock/data";
import type { Tournament, RootStackParamList } from "../types";

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

export default function EsploraScreen() {
  const { location } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  // Local state — edits here stay local, never update profile/home
  const [exploraLocation, setExploraLocation] = useState<string | undefined>(
    () => location ?? undefined,
  );
  const [exploraRadius, setExploraRadius] = useState(10);

  // Map state
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [geoLoading, setGeoLoading] = useState(true);

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [modalLoc, setModalLoc] = useState("");
  const [modalRadius, setModalRadius] = useState(10);

  // Flag to skip geocoding when recenter sets center directly
  const skipGeocode = useRef(false);

  // Toast for city-not-found
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
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

    resolve().finally(() => { if (!cancelled) setGeoLoading(false); });
    return () => { cancelled = true; };
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
              onCalloutPress={() =>
                navigation.navigate("TournamentDetail", { tournamentId: t.id })
              }
            >
              <View style={styles.pin}>
                <Text style={styles.pinEmoji}>🏆</Text>
              </View>
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutName} numberOfLines={2}>{t.name}</Text>
                  <View style={styles.calloutRow}>
                    <Ionicons name="football-outline" size={12} color="#E8601A" />
                    <Text style={styles.calloutGame}>{t.game}</Text>
                  </View>
                  <View style={styles.calloutRow}>
                    <Ionicons name="cash-outline" size={12} color="#64748b" />
                    <Text style={styles.calloutMeta}>{t.entryFee}</Text>
                  </View>
                  <View style={styles.calloutRow}>
                    <Ionicons name="people-outline" size={12} color="#64748b" />
                    <Text style={styles.calloutMeta}>
                      {t.currentParticipants}/{t.maxParticipants}
                    </Text>
                  </View>
                  <View style={styles.calloutCta}>
                    <Text style={styles.calloutCtaText}>Vedi dettagli →</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          ) : null,
        )}
      </MapView>

      {/* Top badge — tappable to edit */}
      <TouchableOpacity
        style={[styles.badge, { top: insets.top + 12 }]}
        onPress={openEdit}
        activeOpacity={0.85}
      >
        {geoLoading ? (
          <ActivityIndicator size="small" color="#E8601A" style={{ marginRight: 4 }} />
        ) : (
          <Ionicons name="location-sharp" size={14} color="#E8601A" />
        )}
        <Text style={styles.badgeText} numberOfLines={1}>
          {exploraLocation ?? "Posizione attuale"}
        </Text>
        <View style={styles.badgeDivider} />
        <Text style={styles.badgeRadius}>{exploraRadius} km</Text>
        <Ionicons name="chevron-down" size={13} color="#94a3b8" />
      </TouchableOpacity>

      {/* City-not-found toast */}
      <Animated.View
        style={[
          styles.toast,
          { top: insets.top + 62 },
          {
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }],
          },
        ]}
        pointerEvents="none"
      >
        <Ionicons name="warning-outline" size={15} color="#fff" />
        <Text style={styles.toastText}>Città non trovata. Uso posizione attuale.</Text>
      </Animated.View>

      {/* Recenter button */}
      <TouchableOpacity
        style={[styles.recenterBtn, { bottom: insets.bottom + 90 }]}
        onPress={handleRecenter}
        activeOpacity={0.85}
      >
        <Ionicons name="locate" size={22} color="#E8601A" />
      </TouchableOpacity>

      {/* Edit modal */}
      <Modal
        visible={editModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={styles.modalDismiss}
            onPress={() => setEditModal(false)}
            activeOpacity={1}
          />
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Modifica area di ricerca</Text>
            <Text style={styles.modalLabel}>POSIZIONE</Text>
            <View style={styles.modalInputRow}>
              <Ionicons name="location-outline" size={18} color="#E8601A" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalInput}
                value={modalLoc}
                onChangeText={setModalLoc}
                placeholder="Es. Milano, Napoli..."
                placeholderTextColor="#94a3b8"
                returnKeyType="done"
              />
              {modalLoc.length > 0 && (
                <TouchableOpacity onPress={() => setModalLoc("")}>
                  <Ionicons name="close-circle" size={18} color="#cbd5e1" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.modalLabel}>RAGGIO DI RICERCA</Text>
            <View style={styles.radiusRow}>
              {RADIUS_OPTIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.radiusBtn, modalRadius === r && styles.radiusBtnActive]}
                  onPress={() => setModalRadius(r)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.radiusBtnText, modalRadius === r && styles.radiusBtnTextActive]}>
                    {r} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={applyEdit}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Applica</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  map: { flex: 1 },
  loadingRoot: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14, color: "#94a3b8" },

  // Top badge
  badge: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    maxWidth: "85%",
  },
  badgeText: { fontSize: 13, fontWeight: "700", color: "#1e293b", flex: 1 },
  badgeDivider: { width: 1, height: 14, backgroundColor: "#e2e8f0" },
  badgeRadius: { fontSize: 12, fontWeight: "700", color: "#E8601A" },

  // Center location pin
  centerPin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E8601A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E8601A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2.5,
    borderColor: "#fff",
  },

  // Recenter button
  recenterBtn: {
    position: "absolute",
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  // Tournament pin
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#E8601A",
  },
  pinEmoji: { fontSize: 18 },

  // Callout
  callout: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  calloutName: { fontSize: 13, fontWeight: "800", color: "#1e293b", marginBottom: 8, lineHeight: 18 },
  calloutRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  calloutGame: { fontSize: 12, color: "#E8601A", fontWeight: "600" },
  calloutMeta: { fontSize: 12, color: "#64748b" },
  calloutCta: { marginTop: 8, backgroundColor: "#FFF0E6", borderRadius: 8, paddingVertical: 6, alignItems: "center" },
  calloutCtaText: { fontSize: 12, fontWeight: "800", color: "#E8601A" },

  // Toast
  toast: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: "85%",
  },
  toastText: { color: "#fff", fontSize: 13, fontWeight: "600", flexShrink: 1 },

  // Modal
  modalOverlay: { flex: 1 },
  modalDismiss: { flex: 1 },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e2e8f0",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: "800", color: "#1e293b", marginBottom: 20 },
  modalLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: "uppercase" as const,
  },
  modalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
  },
  modalInput: { flex: 1, fontSize: 15, color: "#1e293b" },
  radiusRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  radiusBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  radiusBtnActive: { borderColor: "#E8601A", backgroundColor: "#FFF0E6" },
  radiusBtnText: { fontSize: 13, fontWeight: "700", color: "#64748b" },
  radiusBtnTextActive: { color: "#E8601A" },
  applyBtn: {
    backgroundColor: "#E8601A",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
