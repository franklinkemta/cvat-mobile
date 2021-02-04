import React from 'react';
import {ActivityIndicator, View} from 'react-native';

export const LoadingIndicator = () => {
  // console.log('Canvas is loading');
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <ActivityIndicator
        color="#fff"
        size="large"
        style={{alignSelf: 'center'}}
      />
    </View>
  );
};
