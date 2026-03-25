import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  signInBtn: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    elevation: 4,
  },
  signInBtnDisabled: { opacity: 0.6 },
  signInBtnText: { color: '#E8601A', fontSize: 16, fontWeight: '800' },
  linkBtn: { alignItems: 'center', marginBottom: 8 },
  linkText: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
});
