import {DefaultTheme} from 'react-native-paper';

// for our theming custom properties to work with typescript we need to specify the types of the properties
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      dark: string;
      secondary: string;
      caption: string;
      danger: string;
      success: string;
      border: string;
      dodgerblue: string;
      black: string;
      ripple: string;
      rippleDark: string;
      transparent: string;
      cavasBgColor: string;
      canvasBgDark: string;
      canvasBgLight: string;
    }
    interface Theme {
      borderDefault: number;
      borderThin: number;
      radiusDefault: number;
      paddingXDefault: number;
      paddingYDefault: number;
      titleFontSizeDefault: number;
      captionFontSizeDefault: number;
      paragraphFontSizeDefault: number;
    }
  }
}

export const theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 2,
  borderDefault: 2, // default border for tabs indicators, inputs and other parts in the app
  borderThin: 0.3,
  radiusDefault: 5,
  paddingXDefault: 15,
  paddingYDefault: 10,
  titleFontSizeDefault: 15,
  captionFontSizeDefault: 10,
  paragraphFontSizeDefault: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: '#01579b', // the CAT Blue color // rgba(1, 87, 155, 1)
    accent: '#f1c40f', // the orange color
    dark: '#263238',
    secondary: '#37474f',
    caption: '#616161',
    danger: '#c62828',
    success: '#00c853',
    border: '#e0e0e0',
    dodgerblue: 'dodgerblue',
    black: '#000',
    ripple: 'rgba(1, 87, 155, .05)', // 'rgba(0, 0, 0, .03)',
    rippleDark: 'rgba(255,255,255,0.1)',
    transparent: 'rgba(0,0,0,0)', // or 'rgba(0,0,0,0.5)'
    canvasBg: 'papayawhip',
    canvasBgDark: 'rgba(0,0,0,1)',
    canvasBgLight: 'rgba(255, 255, 255,0.95)',
  },
};
