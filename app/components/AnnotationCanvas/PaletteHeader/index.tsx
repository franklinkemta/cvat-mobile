import React from 'react';
import {StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {theme} from '/theme';

import Icon from 'react-native-vector-icons/FontAwesome5';

export const PaletteHeader = ({title, onPress, onLongPress}: any) => (
  <Appbar style={styles.bottomSheetPaletteHeader}>
    <Appbar.Content title={title} titleStyle={{fontSize: 15}} />
    <Appbar.Action
      animated={false}
      icon={(icon: any) => (
        <Icon
          name="caret-down"
          style={{alignSelf: 'center'}}
          size={30}
          {...icon}
        />
      )}
      onPress={onPress}
      onLongPress={onLongPress}
    />
  </Appbar>
);

const styles = StyleSheet.create({
  bottomSheetPaletteHeader: {
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    // borderTopColor: theme.colors.border,
    // borderTopWidth: 5,
  },
});
