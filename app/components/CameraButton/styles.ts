import {Dimensions, Platform, StyleSheet} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

// get default theme colors
import {theme} from '/theme';

const safeAreaInsets = useSafeAreaInsets();

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: safeAreaInsets.bottom + 80,
    right: 16,
    backgroundColor: theme.colors.surface,
  },
});

export default styles;
