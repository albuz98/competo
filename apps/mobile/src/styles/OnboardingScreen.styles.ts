import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH * 0.68;
export const CARD_HEIGHT = CARD_WIDTH * 1.32;
export const CARD_GAP = 16;
export const SNAP = CARD_WIDTH + CARD_GAP;
export const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },

  carouselWrapper: {
    marginTop: 24,
    height: CARD_HEIGHT + 20,
    overflow: 'visible',
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.2,
  },
  circleLarge: {
    width: CARD_WIDTH * 1.1,
    height: CARD_WIDTH * 1.1,
    top: -CARD_WIDTH * 0.3,
    right: -CARD_WIDTH * 0.3,
  },
  circleSmall: {
    width: CARD_WIDTH * 0.5,
    height: CARD_WIDTH * 0.5,
    bottom: -CARD_WIDTH * 0.1,
    left: -CARD_WIDTH * 0.1,
  },
  cardEmoji: { fontSize: 96 },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: { backgroundColor: '#fff', width: 22 },

  textBlock: {
    paddingHorizontal: 28,
    marginTop: 20,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },

  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  skipBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipBtnText: {
    color: '#E8601A',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  nextBtn: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
});
