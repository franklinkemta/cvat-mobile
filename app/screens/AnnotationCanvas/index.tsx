import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  BackHandler,
  // Image,
  // TouchableOpacity,
} from 'react-native';
import {
  gestureHandlerRootHOC,
  // TouchableOpacity,
} from 'react-native-gesture-handler';

import {Svg, Image} from 'react-native-svg';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import BottomSheet from 'reanimated-bottom-sheet';
import ImageViewer from 'react-native-image-zoom-viewer';

import {
  ActivityIndicator,
  Appbar,
  Chip,
  IconButton,
  List,
  Paragraph,
  Searchbar,
  TouchableRipple,
} from 'react-native-paper';
import Autocomplete from 'react-native-autocomplete-input';
// import vectors icons for palette
import Icon from 'react-native-vector-icons/FontAwesome5';

import {theme} from '/theme';
import styles from './styles';
import {DEVICE_HEIGHT, idFromUuid, TouchableOpacity} from '/utils';
import DraggableItem from './DraggableItem';

// Note that we wrap our app inside a gestureHandlerRootHOC, Read the docu. to learn more :) !
export const AnnotationCanvas = gestureHandlerRootHOC((props: any) => {
  const {navigation, route} = props;
  const {
    images,
    paletteGroups,
    initialIndex,
    onSaveDump,
    onClose,
    paletteTitle,
  } = route.params;

  const paletteRef = useRef<BottomSheet>(null);
  const imgViewerRef = useRef<ImageViewer>(null);

  const safeAreaInsets = useSafeAreaInsets();
  const bottomSnapPoints = [
    `${safeAreaInsets.top}%`,
    `${safeAreaInsets.bottom + 63.5}%`,
    `${safeAreaInsets.bottom + 40}%`,
    `${safeAreaInsets.bottom + 30}%`,
    `${safeAreaInsets.bottom + 8}%`,
    `${safeAreaInsets.bottom + 0}`,
    `${safeAreaInsets.bottom - 8}%`,
  ]; //  [450, 300, 60, 0] // maxSnapPoint

  const openSnapPoint = 1; // 63.5%
  const closedSnapPoint = bottomSnapPoints.length - 1;

  const [filterQuery, setFilterQuery] = useState('');
  const [currentPaletteGroups, setCurrentPaletteGroups] = useState(
    Array, // paletteGroups
  ); // get the categories from the palettes initial value

  const [annotations, setAnnotations] = useState(Array);
  const [selectedPaletteGroupItem, setSelectedPaletteGroupItem] = useState(
    undefined,
  );
  const [focusedItem, setFocusedItem] = useState(undefined); // to handle double tap on each draggable item
  const getCurrentIndex = () => {
    return imgViewerRef.current?.state.currentShowIndex;
  };

  // release hardware back button or not
  const releaseBackButton = (release: boolean) => {
    if (release) {
      BackHandler.removeEventListener('hardwareBackPress', () => false);
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => true);
    }
  };

  useEffect(() => {
    // prevent the hardware back button from going back without saved result
    releaseBackButton(false);
  });

  const handleCanvasClose = () => {
    releaseBackButton(true);
    // call the on close
    onClose();
    navigation.goBack();
  };

  const handleCanvasSave = () => {
    releaseBackButton(true);
    // call the on save
    onSaveDump();
    navigation.goBack();
  };

  const openPalette = () => {
    // console.log('opening palette');
    paletteRef.current?.snapTo(openSnapPoint);
  };

  const openPaletteSearch = () => {
    // console.log('opening search in palette');
    // show in fullscreen when the search input in focused
    // paletteRef.current?.snapTo(0);
  };

  const initSearchPalette = async () => {
    console.log('init search palette');
    // query the palette list
    if (!currentPaletteGroups.length) setCurrentPaletteGroups(paletteGroups);
  };

  const closePalette = () => {
    // console.log('closing palette');
    paletteRef.current?.snapTo(closedSnapPoint);
  };

  const clearPaletteFilters = () => {
    console.log('clear custom palette group');
    setFilterQuery('');
    setCurrentPaletteGroups(paletteGroups);
    setSelectedPaletteGroupItem(undefined);
  };

  // apply a the queryText entered in the autocomplete to the paletteGroups contents
  const searchInPallette = (queryText: string) => {
    setFilterQuery(queryText);
    // use the current filter key to filter the paletteItems
    const regex = new RegExp(`${queryText.trim()}`, 'i');
    // the first filter return the paletteGroups that names match the filter or any content item match the filter
    const firstResultsFilter: Array<any> = paletteGroups.filter(
      (paletteGroup: any) =>
        paletteGroup.categoryName?.search(regex) >= 0 ||
        paletteGroup.content.filter(
          (label: any) => label.name?.search(regex) >= 0,
        ).length > 0,
    );

    // we apply a second filter on the first result to return only the labels those match the filter query
    const secondResultsFilter: Array<any> = firstResultsFilter.map(
      (paletteGroup: any) => {
        return {
          ...paletteGroup,
          content: paletteGroup.content.filter(
            (label: any) => label.name?.search(regex) >= 0,
          ),
        };
      },
    );
    // .filter((paletteGroup: any) => paletteGroup.content.length > 0); // Do not display an empty oaletteGroup?
    setCurrentPaletteGroups(secondResultsFilter);
  };

  const addSelectedItem = (svgEvent: any) => {
    // item: any, paletteGroupName: string
    // console.warn('SVG add item click event', svgEvent.nativeEvent);
    // console.log('layout', svgEvent.nativeEvent.layout);
    if (selectedPaletteGroupItem != undefined) {
      const drawAnnotationItem: any = {
        id: idFromUuid(), // create a unique id for each drawed item
        ...(selectedPaletteGroupItem ?? {}),
        origin: {
          x: svgEvent.nativeEvent.locationX,
          y: svgEvent.nativeEvent.locationY,
          width: 10, // + '%',
          height: 10, //  + '%',
        },
      };
      // console.log('Draw', String(drawAnnotationItem));
      const newAnnotations: any = [...annotations, drawAnnotationItem];
      setAnnotations(newAnnotations); // add annotation item
      // setSelectedPaletteGroupItem(undefined); // unselected item from palette
    }
  };

  const removeSelectedItem = () => {
    // item: any, paletteGroupName: string
    // console.warn('SVG remove item click event', svgItemEvent.nativeEvent);
    const draggableItem: any = focusedItem;
    setAnnotations(
      annotations.filter((item: any) => item.id != draggableItem.id),
    ); // remove the item at index
    setFocusedItem(undefined); // clear focused item
  };

  const moveSelectedItem = (svgItemEvent: any) => {
    // console.warn('SVG move item click event', svgItemEvent.nativeEvent);
    if (focusedItem != undefined) {
      const draggableItem: any = focusedItem;
      const width = draggableItem.origin.width;
      const height = draggableItem.origin.height;

      const movedItem: any = {
        ...draggableItem,
        origin: {
          x: svgItemEvent.nativeEvent.locationX,
          y: svgItemEvent.nativeEvent.locationY,
          width: width, // zoomIN/OUT width
          height: height, // zoomIN/OUT height
        },
      };
      setAnnotations([
        ...annotations.filter((item: any) => item.id != draggableItem.id),
        movedItem,
      ]); // update the item at index
      setFocusedItem(movedItem);
    }
  };

  const zoomSelectItem = (zoomRatio: number) => {
    // console.warn('SVG zoom item click event', svgItemEvent.nativeEvent);
    if (focusedItem != undefined) {
      // console.log('moving');
      const draggableItem: any = focusedItem;
      const width = draggableItem.origin.width + zoomRatio;
      const height = draggableItem.origin.height + zoomRatio;

      const zoomedItem: any = {
        ...draggableItem,
        origin: {
          x: draggableItem.origin.x,
          y: draggableItem.origin.y,
          width: width, // zoomIN/OUT width
          height: height, // zoomIN/OUT height
        },
      };
      setAnnotations([
        ...annotations.filter((item: any) => item.id != draggableItem.id),
        zoomedItem,
      ]); // update the item at index
      setFocusedItem(zoomedItem);
    }
  };

  // return the  current current index/totalCount for the header // formated to display (A/B)
  const getHeaderTitle = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex != undefined) {
      const itemsCount: number = images.length;
      return `${currentIndex + 1}/${itemsCount}`;
    } else return '';
  };

  const canvasHeader = () => {
    return (
      <Appbar theme={theme} style={styles.canvaHeader}>
        <Appbar.BackAction onPress={handleCanvasClose} />
        <Appbar.Content
          title={getHeaderTitle()}
          titleStyle={{
            fontWeight: 'normal',
          }}
          style={{
            alignItems: 'center',
          }}
          subtitle="Tap to annotate the image"
        />
        <Appbar.Action
          icon="check"
          style={styles.saveDumpBtn}
          color={theme.colors.surface}
          size={25}
          onPress={handleCanvasSave}
        />
      </Appbar>
    );
  };

  const renderSelectedItemOptions = () => {
    const ZoomRatio = 0.5; // how much we should zoomIn or zoomOut the item
    return (
      <Appbar style={styles.canvaFooter}>
        <Appbar.Action
          icon="plus-circle-outline"
          size={30}
          onPress={() => zoomSelectItem(ZoomRatio)}
          color={theme.colors.border}></Appbar.Action>
        <Appbar.Action
          icon="minus-circle-outline"
          size={30}
          onPress={() => zoomSelectItem(-ZoomRatio)}
          color={theme.colors.border}></Appbar.Action>
        <Appbar.Action
          icon="close-circle-outline"
          size={30}
          onPress={() => setFocusedItem(undefined)}
          onLongPress={removeSelectedItem}
          color={theme.colors.border}></Appbar.Action>
      </Appbar>
    );
  };

  const canvasFooter = () => {
    return (
      <>
        {focusedItem ? (
          renderSelectedItemOptions()
        ) : (
          <TouchableRipple
            rippleColor={theme.colors.rippleDark}
            onPress={() => openPalette()}>
            <Appbar style={styles.canvaFooter}>
              <Appbar.Content
                title="_______"
                subtitle={paletteTitle}
                titleStyle={{
                  fontWeight: '100',
                  fontSize: 15,
                }}
                style={{
                  alignItems: 'center',
                }}></Appbar.Content>
            </Appbar>
          </TouchableRipple>
        )}
      </>
    );
  };

  const renderDraggableItem = (draggableItem: any, index: number) => {
    // console.info('Drawing item', draggableItem);
    // check the draggableItem.svgtFrom and display the corresponding form
    const currentFocusedItem: any = focusedItem;
    const isFocused =
      currentFocusedItem && currentFocusedItem.id == draggableItem.id;
    return (
      <DraggableItem
        key={index}
        draggableItem={draggableItem}
        isFocused={isFocused}
        onPressIn={() => setFocusedItem(draggableItem)}
      />
    );
  };

  const canvasContent = (props: any) => {
    // console.log(props);
    return (
      <Svg
        style={{flex: 1}}
        fill="transparent"
        onTouchStart={addSelectedItem}
        onTouchMove={moveSelectedItem}
        onPress={() => {}}
        onTouchEnd={() => {
          setSelectedPaletteGroupItem(undefined);
        }}>
        <Image
          href={props.source?.uri}
          x="0"
          y="0"
          height="100%"
          width="100%"
        />
        {annotations.map((draggableItem: any, index: number) =>
          renderDraggableItem(draggableItem, index),
        )}
      </Svg>
    );
  };

  const renderLoader = () => {
    // console.log('Canvas is loading');
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={'white'} size="large" style={{}} />
      </View>
    );
  };

  const canvasPalette = () => {
    // format index to display (A/B)

    const paletteHeader = () => (
      <Appbar style={styles.bottomSheetPaletteHeader}>
        <Appbar.Content title={paletteTitle} titleStyle={{fontSize: 15}} />
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
          onPress={() => closePalette()}
          onLongPress={() => {
            paletteRef.current?.snapTo(0);
          }}
        />
      </Appbar>
    );

    const autoCompleteRightIcon = () => (
      <TouchableOpacity onPress={clearPaletteFilters}>
        <IconButton color="black" icon="close-circle" />
      </TouchableOpacity>
    );

    // display a selectable item from the bottom palette
    const renderPaletteGroupItem = ({item, index}: any, paletteGroup: any) => {
      const draggableItem: any = {
        item: item,
        svgForm: paletteGroup.fallBackForm ?? 'rect',
        icon: paletteGroup.fallBackIcon ?? 'square',
        color: paletteGroup.fallBackColor ?? 'white',
        paletteIndex: paletteGroup.index ?? paletteGroup.categoryName,
      };
      const selected: any = selectedPaletteGroupItem;
      const isSelected = draggableItem.item == selected?.item;
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setFocusedItem(undefined);
            setSelectedPaletteGroupItem(draggableItem);
          }}>
          <Chip
            mode={'outlined'}
            style={styles.paletteGroupItem}
            selectedColor={
              isSelected
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

    // TODO: Form draggable list before creating the palette group
    const renderPaletteGroup = ({item: paletteGroup, index}: any) => {
      // console.log('render renderPaletteGroup', paletteGroup);
      return (
        <View style={styles.paletteGroupContainer}>
          <Paragraph style={styles.paletteGroupHeader}>
            {paletteGroup.categoryName ?? '[UNKNOWN]'}
          </Paragraph>
          <View style={styles.paletteGroupContent}>
            {paletteGroup.content.length > 0 &&
              paletteGroup.content.map((item: any, itemIndex: number) =>
                renderPaletteGroupItem(
                  {item: item, index: itemIndex},
                  {index: index, ...paletteGroup},
                ),
              )}
          </View>
        </View>
      );
    };

    const autoCompleteKeyExtractor = (item: any, index: any) => {
      // console.log(item);
      return String(index); // item.categoryName?.toString() ?? String(item);
    };

    const paletteContent = () => (
      <View style={styles.bottomSheetPaletteContent}>
        <Autocomplete
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle={styles.autocompleteInputContainer}
          renderTextInput={(attrs: any) => (
            <Searchbar
              inputStyle={{padding: 0}}
              clearIcon={autoCompleteRightIcon}
              {...attrs}
            />
          )}
          autoCorrect={true}
          autoCapitalize={'characters'}
          data={currentPaletteGroups}
          placeholder="Filter damage types "
          defaultValue={filterQuery}
          onContentSizeChange={async () => openPaletteSearch()}
          onChangeText={async (text) => searchInPallette(text)}
          renderItem={renderPaletteGroup}
          keyExtractor={autoCompleteKeyExtractor}
          listStyle={{backgroundColor: 'transparent'}}
        />
        <Text>Swipe down to close</Text>
      </View>
    );

    // console.log(images[0]?.width);

    return (
      <BottomSheet
        ref={paletteRef}
        snapPoints={bottomSnapPoints}
        borderRadius={10}
        onOpenStart={initSearchPalette}
        initialSnap={closedSnapPoint}
        renderHeader={paletteHeader}
        renderContent={paletteContent}
      />
    );
  };
  // return the ImgageViewer Configured as the canvas with the palette
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageViewer
        ref={imgViewerRef}
        imageUrls={images}
        index={initialIndex}
        loadingRender={renderLoader}
        renderIndicator={() => <></>}
        renderHeader={canvasHeader}
        renderFooter={canvasFooter}
        renderImage={canvasContent}
        enableSwipeDown={false}
        onSwipeDown={onClose}
        saveToLocalByLongPress={false}
        useNativeDriver={false}
        enablePreload={false}
        style={styles.canvasContainer}
        footerContainerStyle={styles.canvasFooterContainerStyles}
      />
      {canvasPalette()}
    </SafeAreaView>
  );
});
