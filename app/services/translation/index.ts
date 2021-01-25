// @flow
import { Platform, NativeModules } from 'react-native';
import _ from 'lodash';

import messages from '/translations';

const language = Platform.OS === 'ios'
  ? NativeModules.SettingsManager.settings.AppleLocale
    || NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
  : NativeModules.I18nManager.localeIdentifier;

export const deviceLanguage: 'fr' | 'en' = _.startsWith(language, 'fr') ? 'fr' : 'en';

export const getMessage = (id: string): string => messages?.[deviceLanguage]?.[id] || id;
