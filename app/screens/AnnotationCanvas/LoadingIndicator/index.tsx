import React from 'react';
import {ActivityIndicator, View} from 'react-native';

export const LoadingIndicator = () => {
  // console.log('Canvas is loading');
  return (
    <View
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
      }}>
      <ActivityIndicator color={'white'} size="large" style={{}} />
    </View>
  );
};
