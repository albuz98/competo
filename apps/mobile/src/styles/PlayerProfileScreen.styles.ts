import { StyleSheet } from 'react-native';

export const pp = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },

  header: { paddingBottom: 32 },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
    margin: 16,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 12,
  },
  avatarInitials: { color: '#fff', fontSize: 30, fontWeight: '800' },
  playerName: {
    color: '#fff', fontSize: 22, fontWeight: '800',
    textAlign: 'center', lineHeight: 28,
  },
  playerUsername: {
    color: 'rgba(255,255,255,0.75)', fontSize: 13,
    textAlign: 'center', marginTop: 4,
  },
  roleBadge: {
    alignSelf: 'center', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5, marginTop: 10,
  },
  roleText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  scroll: { padding: 16, gap: 12 },

  infoCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  infoLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginTop: 1 },

  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: '#1e293b',
    marginTop: 8, marginBottom: 4,
  },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  statCard: {
    width: '47.5%',
    backgroundColor: '#fff', borderRadius: 16,
    padding: 18, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statIconCircle: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '800', lineHeight: 32 },
  statLabel: {
    fontSize: 12, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
});
