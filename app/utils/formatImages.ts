import _ from 'lodash';
import {Image} from 'react-native';

/**
 *
 * @param obj
 * @returns get the true type of an object
 */
export const trueTypeOf = (obj: any) => {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  // anyOf(['string', 'boolean', 'array', 'object', 'number', 'function'])
};

/**
 *
 * @param image : any
 * @returns any[]
 * map uri to url or return string as source
 * map an array of images where each image is  a string or and object { uri : string, ...}
 * Expose the Image properties { url?: string, uri?: string, source?: { uri?, ...}, ... } required to display in a PreviewGrid, ImgView gallery and ImagesCarousel
 */
export const formatImageSource = (image: any): any => {
  const hasMoreData = trueTypeOf(image) === 'object';
  const format = {url: hasMoreData ? image.uri ?? image.url ?? '' : image};
  return {...image, ...format};
};

/**
 *
 * @param images : any[]
 * @returns any[]
 * apply the formatImageSource Source to a list of images
 */
export const formatImagesSources = (images: any[]) =>
  images.map(formatImageSource); // as any[];

/**
 *
 * @param base64Data string the base64 data
 * @param dataType string : image/png, image/jpg
 * @returns string that we can use as image source
 */
export const uriFromBase64 = (base64Data: string, dataType: string): string =>
  `data:${dataType};base64,${base64Data}`;
