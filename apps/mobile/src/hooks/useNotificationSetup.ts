import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { useNotifications } from "../context/NotificationsContext";
import { addToMockCache } from "../api/tournaments";
import { generateTournament } from "../mock/tournaments";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// Android / fallback: in-app notification only (no expo-notifications import)
export function useNotificationSetup() {
  const { addNotification } = useNotifications();
  const addNotificationRef = useRef(addNotification);
  const notificationSent = useRef(false);

  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (notificationSent.current) return;
      notificationSent.current = true;

      let lat = 45.4642;
      let lng = 9.19;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        }
      } catch {}

      const degOffset = 14_000 / 111_000;
      const tLat = lat + (Math.random() - 0.5) * degOffset;
      const tLng = lng + (Math.random() - 0.5) * degOffset;
      const distKm = haversineKm(lat, lng, tLat, tLng);

      if (distKm > 19) return;

      const tournament = generateTournament();
      addToMockCache(tournament);

      addNotificationRef.current({
        title: "Nuovo torneo vicino a te 🏆",
        body: `"${tournament.name}" è aperto a ${distKm.toFixed(1)} km da te. Iscriviti ora!`,
        timestamp: new Date().toISOString(),
        tournamentId: tournament.id,
      });
    }, 12_000);

    return () => clearTimeout(timer);
  }, []);
}
