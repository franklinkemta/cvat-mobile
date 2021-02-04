import React from 'react';
import {IconButton} from 'react-native-paper';
import {theme} from '/theme';

export const ArrowLeftButton = () => (
  <IconButton
    style={{
      position: 'absolute',
      left: 0,
      opacity: 0.6,
    }}
    icon="arrow-left"
    color={theme.colors.surface}
  />
);

export const ArrowRightButton = () => (
  <IconButton
    style={{
      position: 'absolute',
      right: 0,
      opacity: 0.6,
    }}
    icon="arrow-right"
    color={theme.colors.surface}
  />
);
