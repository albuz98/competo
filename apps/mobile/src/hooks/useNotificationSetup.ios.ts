import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { navigationRef } from "../navigation/navigationRef";
import { useNotifications } from "../context/NotificationsContext";
import { useAuth } from "../context/AuthContext";
import { generateTournament } from "../mock/data";
import { addToMockCache } from "../api/tournaments";
import { registerPushToken } from "../api/auth";
import { NavigationEnum } from "../types/navigation";

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

export function useNotificationSetup() {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const addNotificationRef = useRef(addNotification);
  const notificationSent = useRef(false);
  const userTokenRef = useRef(user?.token);

  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  useEffect(() => {
    userTokenRef.current = user?.token;
  }, [user?.token]);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Request permission then register the Expo push token with the backend.
    // In mock mode registerPushToken is a no-op.
    (async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted" && userTokenRef.current) {
          const tokenData = await Notifications.getExpoPushTokenAsync();
          await registerPushToken(tokenData.data, userTokenRef.current);
        }
      } catch {}
    })();

    const handleNotificationData = (data: Record<string, unknown>) => {
      const screen = data?.screen as string | undefined;
      const tournamentId = data?.tournamentId as string | undefined;
      if (screen === NavigationEnum.TEAMS) {
        navigationRef.navigate(NavigationEnum.TEAMS);
      } else if (tournamentId) {
        navigationRef.navigate(NavigationEnum.TOURNAMENT_DETAIL, {
          tournamentId,
        });
      }
    };

    const navigateWhenReady = (data: Record<string, unknown>) => {
      if (navigationRef.isReady()) {
        handleNotificationData(data);
      } else {
        const retry = setInterval(() => {
          if (navigationRef.isReady()) {
            clearInterval(retry);
            handleNotificationData(data);
          }
        }, 100);
      }
    };

    // App in foreground or background
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        navigateWhenReady(response.notification.request.content.data);
      },
    );

    // App cold-started by tapping a notification
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (!response) return;
        navigateWhenReady(response.notification.request.content.data);
      })
      .catch(() => {});

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

      const title = "Nuovo torneo vicino a te 🏆";
      const body = `"${tournament.name}" è aperto a ${distKm.toFixed(1)} km da te. Iscriviti ora!`;

      addNotificationRef.current({
        title,
        body,
        timestamp: new Date().toISOString(),
        tournamentId: tournament.id,
      });

      await Notifications.scheduleNotificationAsync({
        content: { title, body, data: { tournamentId: tournament.id } },
        trigger: null,
      }).catch(() => {});
    }, 12_000);

    return () => {
      responseSub.remove();
      clearTimeout(timer);
    };
  }, []);
}
