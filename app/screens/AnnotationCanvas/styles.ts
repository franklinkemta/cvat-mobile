import {Dimensions, StyleSheet} from 'react-native';
import {theme} from '/theme';

export const {width: screenWidth} = Dimensions.get('window');
export const ITEM_WIDTH = Math.round(screenWidth * 0.8);
export const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 5) / 3); // * 3 ) / 4

const styles = StyleSheet.create({
  scrollview: {flex: 1},
  saveDumpBtn: {
    alignSelf: 'auto',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 20,
  },
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
    //position: 'absolute',
    //flex: 1,
    //flexBasis: 0,
    // alignSelf: 'center',
    // width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  canvaFooter: {
    //bottom: 0,
    // position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.transparent,
  },
});

export default styles;
