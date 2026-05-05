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

  roleRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  roleCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  roleCardActive: {
    borderColor: '#E8601A',
    backgroundColor: '#FFF8F5',
  },
  roleCardLabel: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  roleCardLabelActive: { color: '#E8601A' },
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

});
