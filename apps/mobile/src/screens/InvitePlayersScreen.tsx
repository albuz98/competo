import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, AppUser } from '../types';
import { searchUsers } from '../api/teams';
import { useTeams } from '../context/TeamsContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import * as Notifications from 'expo-notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'InvitePlayers'>;
type Tab = 'cerca' | 'condividi';

function UserRow({
  user,
  alreadyMember,
  invited,
  onInvite,
}: {
  user: AppUser;
  alreadyMember: boolean;
  invited: boolean;
  onInvite: () => void;
}) {
  const initials = (user.firstName[0] ?? '') + (user.lastName[0] ?? '');
  return (
    <View style={ip.userRow}>
      <View style={ip.userAvatar}>
        <Text style={ip.userAvatarText}>{initials.toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ip.userName}>{user.firstName} {user.lastName}</Text>
        <Text style={ip.userUsername}>@{user.username}</Text>
      </View>
      {alreadyMember ? (
        <View style={ip.alreadyBadge}>
          <Text style={ip.alreadyBadgeText}>Già membro</Text>
        </View>
      ) : invited ? (
        <View style={ip.invitedBadge}>
          <Ionicons name="checkmark" size={14} color="#10b981" />
          <Text style={ip.invitedBadgeText}>In attesa</Text>
        </View>
      ) : (
        <TouchableOpacity style={ip.inviteBtn} onPress={onInvite} activeOpacity={0.8}>
          <Text style={ip.inviteBtnText}>Invita</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function InvitePlayersScreen({ route, navigation }: Props) {
  const { teamId } = route.params;
  const { getTeamById, addMember, sentPendingInvites } = useTeams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<Tab>('cerca');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AppUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [invited, setInvited] = useState<Set<string>>(new Set());
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const team = getTeamById(teamId);
  const memberIds = new Set(team?.members.map((m) => m.id) ?? []);

  const pendingInviteUserIds = new Set(
    sentPendingInvites.filter(i => i.teamId === teamId).map(i => i.toUserId)
  );

  const isRep = team?.members.find((m) => m.id === user?.id)?.role === 'representative';

  // Debounced search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await searchUsers(query, user?.token ?? '');
        setResults(res);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query]);

  const handleInvite = async (appUser: AppUser) => {
    try {
      await addMember(teamId, appUser);
      setInvited((prev) => new Set(prev).add(appUser.id));
      addNotification({
        title: 'Invito inviato',
        body: `Hai invitato ${appUser.firstName} ${appUser.lastName} nella squadra ${team?.name ?? ''}. In attesa di conferma.`,
        timestamp: new Date().toISOString(),
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Sei stato invitato!',
          body: `${user?.firstName ?? ''} ${user?.lastName ?? ''} ti ha invitato nella squadra "${team?.name ?? ''}". Vai nelle squadre per accettare.`,
          data: { screen: 'Teams' },
        },
        trigger: null,
      }).catch(() => {});
    } catch {
      Alert.alert('Errore', "Impossibile invitare l'utente. Riprova.");
    }
  };

  const inviteLink = `competo://teams/join/${teamId}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Unisciti alla mia squadra su Competo! ${inviteLink}`,
        title: `Entra in ${team?.name ?? 'una squadra'}`,
      });
    } catch {
      // user cancelled
    }
  };

  if (!isRep) {
    return (
      <View style={ip.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <View style={ip.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={ip.backBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={ip.headerTitle}>Invita giocatori</Text>
            <View style={{ width: 36 }} />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <Ionicons name="lock-closed-outline" size={48} color="#e2e8f0" />
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#94a3b8', marginTop: 16, textAlign: 'center' }}>
              Solo il rappresentante può invitare giocatori
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={ip.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* Header */}
        <View style={ip.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ip.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={ip.headerTitle}>Invita giocatori</Text>
          <View style={{ width: 36 }} />
        </View>
        {team && <Text style={ip.teamName}>{team.name}</Text>}

        {/* Tab bar */}
        <View style={ip.tabBar}>
          <TouchableOpacity
            style={[ip.tab, tab === 'cerca' && ip.tabActive]}
            onPress={() => setTab('cerca')}
          >
            <Ionicons name="search" size={15} color={tab === 'cerca' ? '#E8601A' : '#94a3b8'} />
            <Text style={[ip.tabText, tab === 'cerca' && ip.tabTextActive]}>Cerca</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[ip.tab, tab === 'condividi' && ip.tabActive]}
            onPress={() => setTab('condividi')}
          >
            <Ionicons name="share-social" size={15} color={tab === 'condividi' ? '#E8601A' : '#94a3b8'} />
            <Text style={[ip.tabText, tab === 'condividi' && ip.tabTextActive]}>Condividi link</Text>
          </TouchableOpacity>
        </View>

        {tab === 'cerca' ? (
          <>
            {/* Search input */}
            <View style={ip.searchWrap}>
              <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                style={ip.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Cerca per nome o username..."
                placeholderTextColor="#94a3b8"
                autoFocus={tab === 'cerca'}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#cbd5e1" />
                </TouchableOpacity>
              )}
            </View>

            {/* Results */}
            {searching ? (
              <ActivityIndicator color="#E8601A" style={{ marginTop: 32 }} />
            ) : query.trim().length === 0 ? (
              <View style={ip.hintBox}>
                <Ionicons name="people-outline" size={40} color="#e2e8f0" />
                <Text style={ip.hintText}>Cerca un giocatore per nome o username per invitarlo alla tua squadra.</Text>
              </View>
            ) : results.length === 0 ? (
              <View style={ip.hintBox}>
                <Text style={ip.hintText}>Nessun utente trovato per "{query}"</Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(u) => u.id}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                renderItem={({ item }) => (
                  <UserRow
                    user={item}
                    alreadyMember={memberIds.has(item.id)}
                    invited={invited.has(item.id) || pendingInviteUserIds.has(item.id)}
                    onInvite={() => handleInvite(item)}
                  />
                )}
              />
            )}
          </>
        ) : (
          /* Share link tab */
          <View style={ip.shareTab}>
            <View style={ip.shareIllustration}>
              <Ionicons name="link" size={36} color="#E8601A" />
            </View>
            <Text style={ip.shareTitle}>Condividi il link di invito</Text>
            <Text style={ip.shareSub}>
              Chiunque clicchi questo link potrà unirsi alla squadra {team?.name}.
            </Text>

            <View style={ip.linkBox}>
              <Text style={ip.linkText} numberOfLines={1}>{inviteLink}</Text>
            </View>

            <TouchableOpacity style={ip.shareBtn} onPress={handleShare} activeOpacity={0.85}>
              <Ionicons name="share-social-outline" size={20} color="#fff" />
              <Text style={ip.shareBtnText}>Condividi</Text>
            </TouchableOpacity>

            <View style={ip.socialRow}>
              {(['logo-whatsapp', 'logo-instagram', 'mail-outline'] as const).map((icon) => (
                <TouchableOpacity key={icon} style={ip.socialBtn} onPress={handleShare} activeOpacity={0.8}>
                  <Ionicons name={icon} size={22} color="#64748b" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </SafeAreaView>
    </View>
  );
}

const ip = StyleSheet.create({
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
  teamName: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#E8601A' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
  tabTextActive: { color: '#E8601A', fontWeight: '800' },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1e293b' },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    gap: 12,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  userName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  userUsername: { fontSize: 12, color: '#94a3b8', marginTop: 1 },

  alreadyBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  alreadyBadgeText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },

  invitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  invitedBadgeText: { fontSize: 11, color: '#10b981', fontWeight: '700' },

  inviteBtn: {
    backgroundColor: '#E8601A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  inviteBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  hintBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  hintText: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 20 },

  // Share tab
  shareTab: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  shareIllustration: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  shareTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  shareSub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  linkBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  linkText: { fontSize: 13, color: '#64748b', fontFamily: 'monospace' as any },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8601A',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  shareBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
