import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Paragraph} from 'react-native-paper';
import {PaletteItem} from '../PaletteItem';
import {theme} from '/theme';

// return if the current selected paletteItem is the current one rendering
const checkIsSelected = (checkItem: any, selectedItem: any) => {
  // const selectedItem: any = selectedPaletteItem;
  return selectedItem && selectedItem.label.name == checkItem.name;
};
// TODO: Form draggable list before creating the palette group
export const PaletteGroup = (props: any) => {
  const {item: paletteGroup, selectedPaletteItem, onItemPress}: any = props;

  // console.log('render renderPaletteGroup', paletteGroup);
  return (
    <View style={styles.paletteGroupContainer}>
      <Paragraph style={styles.paletteGroupHeader}>
        {paletteGroup.categoryName ?? '[UNKNOWN]'}
      </Paragraph>
      <View style={styles.paletteGroupContent}>
        {paletteGroup.labels.length > 0 &&
          paletteGroup.labels.map((label: any, labelIndex: number) => (
            <PaletteItem
              key={labelIndex}
              label={label}
              paletteGroup={paletteGroup}
              isSelected={checkIsSelected(label, selectedPaletteItem)}
              onPress={onItemPress}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paletteGroupContainer: {
    borderTopWidth: theme.borderThin,
    borderTopColor: theme.colors.dark, // theme.colors.primary,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  paletteGroupHeader: {
    paddingVertical: 5,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'left',
  },
  paletteGroupContent: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
});
