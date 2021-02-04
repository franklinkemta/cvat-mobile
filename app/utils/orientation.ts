import {Dimensions} from 'react-native';

export enum OrientationMode {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
}

/**
 * Get the device orientation value
 * @return orientation enum(PORTRAIT | LANDSCAPE)
 */
export const getOrientation = (): OrientationMode => {
// console.log('get Orientation');
  if (Dimensions.get('window').width < Dimensions.get('window').height) {
    return OrientationMode.PORTRAIT;
  } else {
    return OrientationMode.LANDSCAPE;
  }
};
