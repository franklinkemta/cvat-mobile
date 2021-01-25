import React from 'react';
import {useTheme, Portal, FAB} from 'react-native-paper';

// get default theme colors
import {theme} from '/theme';

// import vectors icons for tabs
import Icon from 'react-native-vector-icons/FontAwesome5';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const CameraButton = (props: any) /*: React.ReactElement*/ => {
  // const {theme} = props; // useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <Portal>
      <FAB
        visible={props.visible}
        icon={() => (
          <Icon name="camera-retro" size={22} color={theme.colors.dark} />
        )}
        style={{
          position: 'absolute',
          bottom: safeAreaInsets.bottom + 50, // default 80
          right: theme.paddingXDefault,
          backgroundColor: theme.colors.surface,
        }}
        {...props}
      />
    </Portal>
  );
};
