import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { GAMES } from '../mock/data';
import { useTeams } from '../context/TeamsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTeam'>;

export default function CreateTeamScreen({ navigation }: Props) {
  const { createTeam } = useTeams();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const isValid = name.trim().length >= 2 && sport.length > 0;

  const handleCreate = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const team = await createTeam(name.trim(), sport);
      navigation.replace('TeamDetail', { teamId: team.id });
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Errore nella creazione');
      setError('Errore nella creazione della squadra. Riprova.');
      setLoading(false);
    }
  };

  return (
    <View style={cs.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

          {/* Header */}
          <View style={cs.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={cs.backBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={cs.headerTitle}>Crea squadra</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            contentContainerStyle={[cs.content, { paddingBottom: insets.bottom + 32 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Name input */}
            <Text style={cs.label}>NOME SQUADRA</Text>
            <View style={[cs.inputWrap, name.length > 0 && cs.inputWrapFocused]}>
              <Ionicons name="shield-outline" size={18} color="#E8601A" style={{ marginRight: 10 }} />
              <TextInput
                style={cs.input}
                value={name}
                onChangeText={(text) => { setName(text); setCreateError(null); }}
                placeholder="Es. Roma Eagles FC"
                placeholderTextColor="#94a3b8"
                autoFocus
                returnKeyType="done"
                maxLength={40}
              />
            </View>
            <Text style={cs.inputHint}>Minimo 2 caratteri</Text>
            {createError && (
              <Text style={{ color: '#ef4444', fontSize: 13, marginTop: -8, marginBottom: 8, paddingHorizontal: 4 }}>
                {createError}
              </Text>
            )}

            {/* Sport selector */}
            <Text style={[cs.label, { marginTop: 24 }]}>SPORT</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={cs.sportsList}
            >
              {GAMES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[cs.sportPill, sport === g && cs.sportPillActive]}
                  onPress={() => setSport(g)}
                  activeOpacity={0.8}
                >
                  <Text style={[cs.sportPillText, sport === g && cs.sportPillTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {error && (
              <View style={cs.errorBox}>
                <Text style={cs.errorText}>{error}</Text>
              </View>
            )}

            {/* Info card */}
            <View style={cs.infoCard}>
              <Ionicons name="information-circle-outline" size={18} color="#E8601A" />
              <Text style={cs.infoText}>
                Creando la squadra diventerai automaticamente il rappresentante e potrai invitare altri giocatori.
              </Text>
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={[cs.createBtn, (!isValid || loading) && cs.createBtnDisabled]}
              onPress={handleCreate}
              disabled={!isValid || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="people" size={18} color="#fff" />
                  <Text style={cs.createBtnText}>Crea squadra</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const cs = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#1e293b', paddingLeft: 4 },

  content: { padding: 20 },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputWrapFocused: { borderColor: '#E8601A' },
  input: { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '600' },
  inputHint: { fontSize: 11, color: '#cbd5e1', marginTop: 5 },

  sportsList: { gap: 8, paddingVertical: 4 },
  sportPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  sportPillActive: { backgroundColor: '#E8601A', borderColor: '#E8601A' },
  sportPillText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  sportPillTextActive: { color: '#fff' },

  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  errorText: { color: '#ef4444', fontSize: 13 },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    padding: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  infoText: { flex: 1, fontSize: 12, color: '#78350f', lineHeight: 18 },

  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8601A',
    borderRadius: 50,
    paddingVertical: 16,
    marginTop: 24,
  },
  createBtnDisabled: { opacity: 0.5 },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
