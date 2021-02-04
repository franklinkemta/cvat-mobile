import React, {createRef} from 'react';
import {StyleSheet, View} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {IconButton, Searchbar} from 'react-native-paper';
import {PaletteGroup} from '../PaletteGroup';
import {TouchableOpacity} from '/utils';

import BottomSheet from 'reanimated-bottom-sheet';
import {theme} from '/theme';
import {PaletteHeader} from '../PaletteHeader';

type PaletteProps = {
  paletteGroups: any;
  title: string;
  selectedPaletteItem: any;
  safeAreaInsets: any;
  onSelect(selectedItem: any): void;
  onInputClear(): void;
};

type PaletteState = {
  filterQuery: string;
  currentPaletteGroups: any[];
};

export class CanvasPalette extends React.PureComponent<
  PaletteProps,
  PaletteState
> {
  bottomSheetRef = createRef<BottomSheet>(); // useRef<BottomSheet>(null);

  bottomSnapPoints = [
    `${this.props.safeAreaInsets.top}%`,
    // `${this.props.safeAreaInsets.bottom + 80}%`,
    `${this.props.safeAreaInsets.bottom + 63.5}%`,
    `${this.props.safeAreaInsets.bottom + 40}%`,
    `${this.props.safeAreaInsets.bottom + 30}%`,
    `${this.props.safeAreaInsets.bottom + 8}%`,
    `${this.props.safeAreaInsets.bottom + 0}`,
    `${this.props.safeAreaInsets.bottom - 8}%`,
  ]; //  [450, 300, 60, 0] // maxSnapPoint

  openSnapPoint = 1; // 63.5%
  closedSnapPoint = this.bottomSnapPoints.length - 1;

  constructor(props: any) {
    super(props);
    this.state = {
      filterQuery: '',
      currentPaletteGroups: [], // paletteGroups // get the categories from the palettes initial value
    };
  }

  autoCompleteRightIcon = () => (
    <TouchableOpacity onPress={this.clearPaletteFilters}>
      <IconButton color={theme.colors.dark} icon="close-circle" />
    </TouchableOpacity>
  );

  // TODO: Form draggable list before creating the palette group
  renderPaletteGroup = ({item: paletteGroup, index}: any) => {
    // console.log('render renderPaletteGroup', paletteGroup);
    return (
      <PaletteGroup
        item={paletteGroup}
        selectedPaletteItem={this.props.selectedPaletteItem}
        onItemPress={this.props.onSelect}
      />
    );
  };

  openPalette = () => {
    // console.log('opening palette');
    this.bottomSheetRef.current?.snapTo(this.openSnapPoint);
  };

  openPaletteSearch = () => {
    // console.log('opening search in palette');
    // show in fullscreen when the search input in focused
    // bottomSheetRef.current?.snapTo(0);
  };

  initSearchPalette = async () => {
    // query the palette list
    if (!this.state.currentPaletteGroups.length) {
      console.log('init search palette');
      this.setState({currentPaletteGroups: this.props.paletteGroups});
    }
  };

  closePalette = () => {
    // console.log('closing palette');
    this.bottomSheetRef.current?.snapTo(this.closedSnapPoint);
  };

  clearPaletteFilters = () => {
    console.log('clear custom palette group');
    this.setState({
      filterQuery: '',
      currentPaletteGroups: this.props.paletteGroups,
    });
    // setSelectedPaletteItem(undefined);
    this.props.onInputClear();
  };

  // apply a the queryText entered in the autocomplete to the paletteGroups contents
  searchInPallette = (queryText: string) => {
    this.setState({filterQuery: queryText});
    // use the current filter key to filter the paletteItems
    const regex = new RegExp(`${queryText.trim()}`, 'i');
    // the first filter return the paletteGroups that names match the filter or any content item match the filter
    const firstResultsFilter: Array<any> = this.props.paletteGroups.filter(
      (paletteGroup: any) =>
        paletteGroup.categoryName?.search(regex) >= 0 ||
        paletteGroup.labels.filter(
          (label: any) => label.name?.search(regex) >= 0,
        ).length > 0,
    );

    // we apply a second filter on the first result to return only the labels those match the filter query
    const secondResultsFilter: Array<any> = firstResultsFilter.map(
      (paletteGroup: any) => {
        const filteredContent: [] = paletteGroup.labels.filter(
          (label: any) => label.name?.search(regex) >= 0,
        );
        return {
          ...paletteGroup,
          content: filteredContent.length
            ? filteredContent
            : paletteGroup.labels,
        };
      },
    );
    // .filter((paletteGroup: any) => paletteGroup.labels.length > 0); // Do not display an empty oaletteGroup?
    this.setState({currentPaletteGroups: secondResultsFilter});
  };

  autoCompleteKeyExtractor = (item: any, index: any) => {
    // console.log(item);
    return String(index); // item.categoryName?.toString() ?? String(item);
  };

  renderContent = () => (
    <View style={styles.bottomSheetPaletteContent}>
      <Autocomplete
        containerStyle={styles.autocompleteContainer}
        inputContainerStyle={styles.autocompleteInputContainer}
        renderTextInput={(attrs: any) => (
          <Searchbar clearIcon={this.autoCompleteRightIcon} {...attrs} />
        )}
        autoCorrect={true}
        autoCapitalize={'characters'}
        data={this.state.currentPaletteGroups}
        placeholder="Filter damage types "
        defaultValue={this.state.filterQuery}
        autoFocus={true}
        onContentSizeChange={async () => this.openPaletteSearch()}
        onChangeText={async (text) => this.searchInPallette(text)}
        renderItem={this.renderPaletteGroup}
        keyExtractor={this.autoCompleteKeyExtractor}
        listStyle={{backgroundColor: 'transparent'}}
      />
    </View>
  );

  render() {
    return (
      <BottomSheet
        ref={this.bottomSheetRef}
        snapPoints={this.bottomSnapPoints}
        borderRadius={10}
        onOpenStart={this.initSearchPalette}
        initialSnap={this.closedSnapPoint}
        renderHeader={() => (
          <PaletteHeader
            title={this.props.title}
            onPress={() => this.closePalette()}
            onLongPress={() => {
              this.bottomSheetRef.current?.snapTo(0);
            }}
          />
        )}
        renderContent={this.renderContent}
        enabledHeaderGestureInteraction={true}
        enabledContentGestureInteraction={false}
        /* enabledContentTapInteraction={false} */
      />
    );
  }
}

const styles = StyleSheet.create({
  bottomSheetPaletteContent: {
    backgroundColor: theme.colors.surface,
    height: '100%',
    borderRadius: 0,
    top: 0,
  },
  autocompleteContainer: {
    // left: 0,
    backgroundColor: theme.colors.canvasBgDark,
    // bottom: 0,
    flex: 1,
  },
  autocompleteInputContainer: {
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
    alignSelf: 'stretch',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
