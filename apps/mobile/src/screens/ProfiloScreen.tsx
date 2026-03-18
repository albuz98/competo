import React, { useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";

export default function ProfiloScreen() {
  const { user, location, logout, updateProfile } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const savedScrollY = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const y = savedScrollY.current;
      if (y > 0) {
        setTimeout(() => scrollRef.current?.scrollTo({ y, animated: false }), 50);
      }
    }, [])
  );

  const initial = user?.firstName?.[0]?.toUpperCase() ?? user?.username?.[0]?.toUpperCase() ?? "U";

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  };

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permesso negato",
        "Abilita l'accesso alla galleria nelle impostazioni."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await updateProfile({ avatarUri: result.assets[0].uri });
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <Text style={styles.header}>Profilo</Text>
        <View style={styles.guestBox}>
          <Ionicons name="person-circle-outline" size={72} color="#e2e8f0" />
          <Text style={styles.guestTitle}>Non sei connesso</Text>
          <Text style={styles.guestSub}>Accedi per vedere il tuo profilo</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate("Login", {})}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Accedi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 12 }}
          >
            <Text style={styles.registerLink}>Crea un account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <Text style={styles.header}>Profilo</Text>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        scrollEventThrottle={16}
        onScroll={(e) => { savedScrollY.current = e.nativeEvent.contentOffset.y; }}
      >

      <View style={styles.card}>
        {/* Avatar + pencil */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.85}>
            {user.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.avatarImg} />
            ) : (
              <LinearGradient
                colors={["#E8601A", "#F5A020"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{initial}</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pencilBtn}
            onPress={handlePickAvatar}
            activeOpacity={0.85}
          >
            <Ionicons name="pencil" size={13} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>{fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Row icon="person-outline" label="Nome" value={user.firstName ?? "–"} />
        <Row icon="people-outline" label="Cognome" value={user.lastName ?? "–"} />
        <Row icon="at-outline" label="Username" value={user.username} />
        <Row icon="mail-outline" label="Email" value={user.email} />
        <Row icon="lock-closed-outline" label="Password" value="••••••••" />
        <Row icon="calendar-outline" label="Data di nascita" value={user.dateOfBirth ?? "–"} isLast={!location} />
        {location ? (
          <Row icon="location-outline" label="Posizione" value={location} isLast />
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate("EditProfile")}
        activeOpacity={0.85}
      >
        <Ionicons name="create-outline" size={20} color="#E8601A" />
        <Text style={styles.editBtnText}>Modifica profilo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
  isLast,
}: {
  icon: any;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <Ionicons name={icon} size={20} color="#94a3b8" style={{ width: 28 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { paddingBottom: 32 },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "800" },
  pencilBtn: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E8601A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  email: { fontSize: 13, color: "#64748b", marginTop: 4 },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 8,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#1e293b", marginTop: 1 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#fed7aa",
  },
  editBtnText: { color: "#E8601A", fontSize: 15, fontWeight: "700" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#fecaca",
  },
  logoutText: { color: "#ef4444", fontSize: 15, fontWeight: "700" },
  // Guest state
  guestBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  guestTitle: { fontSize: 18, fontWeight: "700", color: "#94a3b8", marginTop: 16 },
  guestSub: { fontSize: 13, color: "#cbd5e1", marginTop: 6, textAlign: "center" },
  loginBtn: {
    marginTop: 24,
    backgroundColor: "#E8601A",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  loginBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  registerLink: { color: "#E8601A", fontWeight: "600", fontSize: 14 },
});
