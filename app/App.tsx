import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';

// Import the main navigator
import {AppNavigator} from './navigation/app.navigator';

import {theme} from '/theme';

export default (): React.ReactFragment => {
  // This value is used to determine the initial screen
  const isAuthorized: boolean = true;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};
