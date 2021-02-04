import React from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-paper';
import {theme} from '/theme';
import {TouchableOpacity} from '/utils';

// display a selectable item from the bottom palette
export const PaletteItem = (props: any) => {
  const {item, paletteGroup, isSelected, onPress}: any = props;
  const draggableItem: any = {
    item: item,
    svgForm: paletteGroup.fallBackForm ?? 'rect',
    icon: paletteGroup.fallBackIcon ?? 'square',
    color: paletteGroup.fallBackColor ?? 'white',
    paletteIndex: paletteGroup.index ?? paletteGroup.categoryName,
  };
  // const selected: any = selectedPaletteItem;
  // const isSelected = draggableItem.item == selected?.item;
  return (
    <TouchableOpacity onPress={() => onPress(draggableItem)}>
      <Chip
        mode={'outlined'}
        style={styles.paletteItem}
        selectedColor={
          isSelected == true
            ? draggableItem.color == 'white'
              ? theme.colors.primary
              : draggableItem.color
            : theme.colors.black
        }
        theme={theme}
        icon={item.icon ?? draggableItem.icon}>
        {item.name ?? String(item)}
      </Chip>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  paletteItem: {
    borderWidth: 0.2,
    marginEnd: 1,
    marginTop: 1,
    borderColor: theme.colors.dark,
  },
});
