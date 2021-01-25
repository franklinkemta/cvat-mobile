import {StyleSheet} from 'react-native';
import {theme} from '/theme';

export default StyleSheet.create({
  drawerContent: {
    flex: 1,
    // paddingHorizontal: theme.paddingXDefault,
  },
  appInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 0,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  divider: {
    backgroundColor: theme.colors.primary,
    height: theme.borderDefault,
    marginVertical: 12,
    marginTop: 20,
    alignSelf: 'center',
    width: '88%',
  },
  logo: {
    marginTop: 10,
    marginBottom: 0,
  },
});
