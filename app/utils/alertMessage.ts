import {Alert} from 'react-native';

const DEBUG_ALERT = true;
const CONSOLE_LOG = true;
// Display the react native alert
export const alertMessage = (
  title: string,
  message?: string,
  buttons?: any[],
  type?: 'log' | 'info' | 'warn' | 'error',
  options?: any,
) => {
  // show alert message in the console
  if (CONSOLE_LOG) {
    switch (type) {
      case 'info':
      // console.info(title, message);
        break;
      case 'warn':
      // console.warn(title, message);
        break;
      case 'error':
      // console.error(title, message);
        break;
      default:
      // console.log(title, message);
        break;
    }
  }
  // show alert message popup
  if (DEBUG_ALERT) {
    Alert.alert(
      title,
      message ?? '',
      buttons ?? [],
      options ?? {cancelable: true},
    );
  }
};
