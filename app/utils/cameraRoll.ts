import CameraRoll from '@react-native-community/cameraroll';
import {PermissionsAndroid, Platform} from 'react-native';

export const hasAndroidPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};

// tag, { type, album }
// https://github.com/react-native-cameraroll/react-native-cameraroll#save
export const savePicture = async (tag: any, options: any) => {
  console.log(tag);
  try {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    await CameraRoll.save(tag, options);
    console.log('save picture sucess ');
  } catch (error) {
    console.warn('save picture error ', error);
  }
};
