import {StyleSheet} from 'react-native';
import {theme} from '/theme';

const styles = StyleSheet.create({
  canvasContainer: {
    // flexDirection: 'column',
    // flexWrap: 'wrap',
    backgroundColor: theme.colors.canvasBgDark,
  },
  canvaHeader: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: theme.colors.transparent,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  canvasFooterContainerStyles: {
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default styles;
