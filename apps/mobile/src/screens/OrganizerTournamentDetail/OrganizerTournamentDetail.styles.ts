import { StyleSheet } from 'react-native';

export const CARD_H = 72;
export const CARD_W = 158;
export const COL_GAP = 44;
export const SLOT_H = 84;
export const LABEL_H = 28;
export const LINE_W = 1.5;
export const LINE_COLOR = '#dde3ed';

export const tv = StyleSheet.create({
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444' },
  matchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  matchRowHighlight: { backgroundColor: '#FFF8F5' },
  matchTeam: { flex: 1, fontSize: 12, color: '#475569', fontWeight: '500' },
  matchTeamRight: { textAlign: 'right' },
  matchMyTeam: { color: '#E8601A', fontWeight: '700' },
  matchScoreWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, minWidth: 70, justifyContent: 'center',
  },
  matchScore: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  matchScoreLive: { color: '#E8601A' },
  matchScoreScheduled: { color: '#94a3b8', fontWeight: '600' },
  groupCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  groupCardMine: { borderLeftWidth: 4, borderLeftColor: '#E8601A' },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  groupName: { fontSize: 13, fontWeight: '800', color: '#1e293b', flex: 1 },
  myGroupBadge: { backgroundColor: '#FFF0E6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  myGroupBadgeText: { fontSize: 11, color: '#E8601A', fontWeight: '700' },
  standingsCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  standingsGroupName: {
    fontSize: 13, fontWeight: '800', color: '#1e293b',
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  standingsHeader: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#f8fafc' },
  standingsRow: {
    flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  standingsRowMine: { backgroundColor: '#FFF0E6' },
  sCell: { fontSize: 12, color: '#64748b', textAlign: 'center', width: 28, fontWeight: '600' },
  sCellPos: { color: '#94a3b8', width: 22 },
  sCellName: { flex: 1, textAlign: 'left', width: undefined },
  sCellPts: { color: '#E8601A', fontWeight: '800' },
  bracketCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  bracketCardTitle: {
    fontSize: 13, fontWeight: '800', color: '#1e293b',
    paddingHorizontal: 14, paddingTop: 14, paddingBottom: 8,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
});

export const bStyles = StyleSheet.create({
  roundLabel: {
    position: 'absolute', top: 0, textAlign: 'center',
    fontSize: 9, fontWeight: '700', color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  matchCard: {
    height: CARD_H, backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  matchCardLive: { borderColor: '#E8601A', borderLeftWidth: 3 },
  teamRow: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 5 },
  teamDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#e2e8f0' },
  teamDotMine: { backgroundColor: '#E8601A' },
  teamName: { flex: 1, fontSize: 10, fontWeight: '600', color: '#475569' },
  teamNameMine: { color: '#E8601A', fontWeight: '800' },
  teamNameWinner: { color: '#1e293b', fontWeight: '800' },
  score: { fontSize: 12, fontWeight: '600', color: '#94a3b8', minWidth: 18, textAlign: 'center' },
  scoreWinner: { color: '#1e293b', fontWeight: '800' },
  matchDivider: { height: 0.5, backgroundColor: '#f1f5f9', marginHorizontal: 8 },
  livePill: { position: 'absolute', top: 2, right: 4, backgroundColor: 'transparent' },
  livePillText: { fontSize: 7, fontWeight: '800', color: '#E8601A', letterSpacing: 0.5 },
});

export const os = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { paddingBottom: 20 },
  headerTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  organizerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  organizerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  headerContent: { paddingHorizontal: 20, paddingBottom: 4 },
  headerEmoji: { fontSize: 32, marginBottom: 4 },
  headerGame: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  headerDate: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tab: {
    flex: 1, paddingVertical: 14, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  tabActive: { borderBottomColor: '#E8601A' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
  tabTextActive: { color: '#E8601A', fontWeight: '800' },
  tabDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#10b981' },

  body: { padding: 16, gap: 12 },

  subTabBar: {
    flexDirection: 'row', backgroundColor: '#f1f5f9',
    borderRadius: 12, padding: 4,
  },
  subTab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  subTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3, elevation: 1,
  },
  subTabText: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
  subTabTextActive: { color: '#E8601A', fontWeight: '800' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 8,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginTop: 1 },
  descBlock: { padding: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  rulesBlock: { padding: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  descTitle: { fontSize: 13, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  descText: { fontSize: 13, color: '#64748b', lineHeight: 20 },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  ruleDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#E8601A', marginTop: 6 },
  ruleText: { flex: 1, fontSize: 13, color: '#64748b', lineHeight: 19 },

  squadreHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  squadreCounter: { flexDirection: 'row', alignItems: 'baseline' },
  squadreCountNum: { fontSize: 36, fontWeight: '800', color: '#E8601A' },
  squadreCountSep: { fontSize: 20, fontWeight: '600', color: '#94a3b8' },
  squadreCountLabel: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  squadreFreeSlots: { fontSize: 12, color: '#64748b', marginTop: 2 },

  teamCard: {
    backgroundColor: '#fff', borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    overflow: 'hidden',
  },
  teamHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 10 },
  teamHeaderLeft: { flex: 1, gap: 5 },
  teamHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  teamName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  playerCount: { fontSize: 11, color: '#94a3b8' },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingBottom: 8 },
  deadlineText: { fontSize: 12, color: '#f59e0b', fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingBottom: 12 },
  btnAccept: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, backgroundColor: '#10b981', borderRadius: 10, paddingVertical: 9,
  },
  btnAcceptText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  btnReject: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, borderWidth: 1.5, borderColor: '#fecaca', borderRadius: 10, paddingVertical: 9,
  },
  btnRejectText: { color: '#ef4444', fontSize: 13, fontWeight: '700' },
  btnRemove: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: '#fecaca', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16,
  },
  btnRemoveText: { color: '#ef4444', fontSize: 13, fontWeight: '700' },
  playersContainer: { paddingHorizontal: 14, paddingBottom: 8 },
  playersDivider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 10 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  playerAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center',
  },
  playerAvatarText: { fontSize: 12, fontWeight: '800', color: '#E8601A' },
  playerName: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  playerRole: { fontSize: 11, color: '#94a3b8', marginTop: 1 },

  emptyCard: { backgroundColor: '#fff', borderRadius: 14, padding: 32, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },

  generaCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  generaTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  generaSubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  generaStats: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  generaStat: { flex: 1, alignItems: 'center' },
  generaStatNum: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  generaStatLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },
  generaStatDiv: { width: 1, height: 36, backgroundColor: '#f1f5f9' },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#E8601A', borderRadius: 50,
    paddingVertical: 15, paddingHorizontal: 36, marginTop: 8, minWidth: 220, justifyContent: 'center',
  },
  generateBtnDisabled: { opacity: 0.6 },
  generateBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
