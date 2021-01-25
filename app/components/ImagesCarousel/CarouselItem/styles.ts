import {Dimensions, Platform, StyleSheet} from 'react-native';

// get default theme colors
import {theme} from '/theme';

export const {width: screenWidth} = Dimensions.get('window');
export const ITEM_WIDTH = Math.round(screenWidth * 0.8);
export const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 5) / 3); // * 3 ) / 4

const styles = StyleSheet.create({
  item: {
    // width: screenWidth - 60,
    // height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    // flexBasis: 200,
    // alignContent: 'center',
    // justifyContent: 'center',
    // width: '100%', // create an unexpected strange animation
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: theme.colors.black, //theme.colors.border, // theme.colors.border,
    borderColor: theme.colors.primary,
    borderWidth: theme.borderThin, // 1,
    borderRadius: theme.radiusDefault, // 4,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: theme.colors.primary,
    fontSize: theme.titleFontSizeDefault, // 20
    fontWeight: 'normal',
    textAlign: 'center',
  },
});

export default styles;
