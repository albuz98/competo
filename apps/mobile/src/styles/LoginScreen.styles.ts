import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1 },
  flex: { flex: 1 },

  topArea: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backArrow: { color: '#fff', fontSize: 20, lineHeight: 24 },
  backText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  topTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },

  card: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    height: '80%',
  },
  cardContent: {
    padding: 28,
    paddingBottom: 40,
    flexGrow: 1,
  },
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

  errorBox: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: '#fff', fontSize: 13, textAlign: 'center' },

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
  signInBtnText: {
    color: '#E8601A',
    fontSize: 16,
    fontWeight: '800',
  },

  linkBtn: { alignItems: 'center', marginBottom: 8 },
  linkText: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },

  logoArea: { alignItems: 'center', marginTop: 16 },
  logoText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  logoTagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '600',
    marginTop: 2,
  },
});
