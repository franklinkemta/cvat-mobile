import {StyleSheet} from 'react-native';

// get default theme colors
import {theme} from '/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    paddingTop: theme.paddingYDefault,
    paddingHorizontal: theme.paddingXDefault,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: theme.borderThin,
    // borderBottomColor: theme.colors.border, // theme.colors.primary,
  },
  row: {
    flex: 1,
    borderBottomWidth: theme.borderDefault,
    borderBottomColor: theme.colors.primary, // theme.colors.primary,
  },
  title: {
    fontSize: theme.titleFontSizeDefault,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  author: {
    fontSize: 12,
    marginTop: -3,
    width: '60%',
  },
  createDate: {
    width: '40%',
    fontSize: 12,
    textAlign: 'right',
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    borderRadius: theme.radiusDefault, // 5,
    width: '100%',
    height: 224,
  },
  bottomRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconDescription: {
    marginLeft: 3,
    lineHeight: 14,
  },
});

export default styles;
