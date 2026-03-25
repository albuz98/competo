import { StyleSheet } from 'react-native';

export const cs = StyleSheet.create({
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
