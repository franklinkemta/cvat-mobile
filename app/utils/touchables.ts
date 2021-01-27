import {
  Platform,
  TouchableHighlight as TouchableHighlightIOS,
  TouchableOpacity as TouchableOpacityIOS,
  ScrollView as ScrollViewIOS,
} from 'react-native';

import {
  TouchableHighlight as TouchableHighlightAndroid,
  TouchableOpacity as TouchableOpacityAndroid,
  ScrollView as ScrollViewAndroid,
} from 'react-native-gesture-handler';

export const TouchableHighlight =
  Platform.OS === 'android' ? TouchableHighlightAndroid : TouchableHighlightIOS;

export const TouchableOpacity =
  Platform.OS === 'android' ? TouchableOpacityAndroid : TouchableOpacityIOS;

export const ScrollView =
  Platform.OS === 'android' ? ScrollViewAndroid : ScrollViewIOS;

// or

/*
import {Platform} from 'react-native';
const TouchableOpacity =
  Platform.OS === 'ios'
    ? require('react-native').TouchableOpacity
    : require('react-native-gesture-handler').TouchableOpacity;
*/
