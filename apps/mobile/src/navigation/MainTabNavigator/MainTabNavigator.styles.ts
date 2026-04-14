import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 0,
    paddingTop: 10,
    paddingHorizontal: 0,
    borderRadius: 30,
    left: 0,
    right: 0,
    marginLeft: 10,
    marginRight: 10,
    position: 'absolute',
    elevation: 10,
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
  },
  iconActive: {
    color: '#E8601A',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
});
