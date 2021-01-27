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
    backgroundColor: theme.colors.transparent,
  },

  bottomSheetPaletteHeader: {
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    // borderTopColor: theme.colors.border,
    //borderTopWidth: 5,
  },

  bottomSheetPaletteContent: {
    backgroundColor: theme.colors.transparent,
    height: '100%',
    borderRadius: 0,
    zIndex: 9999,
  },

  autocompleteContainer: {
    flex: 1,
    alignSelf: 'stretch',
    left: 0,
    position: 'absolute',
    backgroundColor: theme.colors.canvasBgLight,
    height: '100%',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  autocompleteInputContainer: {},

  paletteGroupContainer: {
    borderTopWidth: theme.borderThin,
    borderTopColor: theme.colors.dark, // theme.colors.primary,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  paletteGroupHeader: {
    paddingVertical: 5,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'left',
  },
  paletteGroupContent: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  paletteGroupContentItem: {},
});

export default styles;
