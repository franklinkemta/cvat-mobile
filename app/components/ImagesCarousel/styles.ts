import {StyleSheet} from 'react-native';
// get default theme colors
import {theme} from '/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: theme.paddingYDefault,
  },
  paginationContainer: {
    paddingVertical: 3,
  },
  paginationDot: {
    // width: 10,
    // height: 10,
    // borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: theme.colors.primary,
  },
  inactivePaginationDot: {},
  galleryHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: theme.colors.transparent,
  },
});

export default styles;
