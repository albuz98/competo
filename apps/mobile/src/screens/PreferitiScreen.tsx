import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function PreferitiScreen() {
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <Text style={styles.header}>Preferiti</Text>
      <View style={styles.center}>
        <Ionicons name="bookmark-outline" size={64} color="#e2e8f0" />
        <Text style={styles.emptyTitle}>Nessun preferito</Text>
        <Text style={styles.emptySubtitle}>
          Aggiungi tornei ai preferiti per trovarli facilmente
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#94a3b8", marginTop: 16 },
  emptySubtitle: {
    fontSize: 13,
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
