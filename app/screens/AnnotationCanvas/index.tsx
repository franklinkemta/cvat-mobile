import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  // TouchableOpacity,
} from 'react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

import {Svg, Rect} from 'react-native-svg';
import Animated from 'react-native-reanimated';
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
import Icon from 'react-native-vector-icons/FontAwesome';

import {theme} from '/theme';
import styles from './styles';
import {DEVICE_HEIGHT} from '/utils';

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

  const paletteRef = React.useRef<BottomSheet>(null);
  const imgViewerRef = React.useRef<ImageViewer>(null);

  const safeAreaInsets = useSafeAreaInsets();
  const bottomSnapPoints = [
    `${safeAreaInsets.bottom + 100}%`,
    `${safeAreaInsets.bottom + 63.5}%`,
    `${safeAreaInsets.bottom + 40}%`,
    `${safeAreaInsets.bottom + 30}%`,
    `${safeAreaInsets.bottom + 0}`,
  ]; //  [450, 300, 60, 0] // maxSnapPoint

  const openSnapPoint = 1; // 63.5%
  const closedSnapPoint = bottomSnapPoints.length - 1;

  const [filterQuery, setFilterQuery] = React.useState('');
  const [currentPaletteGroups, setCurrentPaletteGroups] = React.useState(
    paletteGroups,
  ); // get the categories from the palettes initial value

  const getCurrentIndex = () => {
    return imgViewerRef.current?.state.currentShowIndex;
  };

  const openPalette = () => {
    console.log('opening palette');
    paletteRef.current?.snapTo(openSnapPoint);
  };

  const openPaletteSearch = () => {
    console.log('opening search in palette');
    // show in fullscreen when the search input in focused
    paletteRef.current?.snapTo(0);
  };

  const closePalette = () => {
    console.log('closing palette');
    paletteRef.current?.snapTo(closedSnapPoint);
  };

  const addCustomPaletteGroup = () => {
    console.log('add custom palette group');
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
        <Appbar.BackAction onPress={() => onClose()} />
        <Appbar.Content
          title={getHeaderTitle()}
          titleStyle={{
            fontWeight: 'normal',
          }}
          style={{
            alignItems: 'center',
          }}
          subtitle="Tap + to annotate the image"
        />
        <Appbar.Action
          icon="check"
          style={styles.saveDumpBtn}
          color={theme.colors.surface}
          size={25}
          onPress={() => onSaveDump()}
        />
      </Appbar>
    );
  };

  const canvasFooter = () => {
    return (
      <>
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
      </>
    );
  };

  const renderLoader = () => {
    console.log('Canvas is loading');
    return (
      <View style={{}}>
        <ActivityIndicator color={'grey'} size="large" style={{}} />
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
      <IconButton
        color="black"
        onPress={addCustomPaletteGroup}
        icon={() => (
          <Icon size={20} color="black" name="plus-circle" />
        )}></IconButton>
    );

    // TODO: Form draggable list before creating the palette group
    const renderPaletteGroup = ({item: paletteGroup, index}: any) => {
      console.log('render renderPaletteGroup', paletteGroup);
      return (
        <View style={styles.paletteGroupContainer}>
          <Paragraph style={styles.paletteGroupHeader}>
            {paletteGroup.categoryName ?? '[UNKNOWN]'}
          </Paragraph>
          <View style={styles.paletteGroupContent}>
            {paletteGroup.content?.length &&
              paletteGroup.content.map((item: any, itemIndex: number) => (
                <Chip
                  mode="outlined"
                  style={styles.paletteGroupContentItem}
                  theme={theme}
                  key={itemIndex}
                  icon={item.svgForm ?? paletteGroup.fallBackItem ?? 'square'}
                  onPress={() =>
                    console.log(
                      paletteGroup.categoryName ?? '[UNKNOWN]',
                      'Palette Item select Item',
                      item.name ?? String(item),
                    )
                  }>
                  {item.name ?? String(item)}
                </Chip>
              ))}
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
            <Searchbar clearIcon={autoCompleteRightIcon} {...attrs} />
          )}
          autoCorrect={false}
          data={currentPaletteGroups}
          placeholder="Filter  e.g: Dort front left "
          defaultValue={filterQuery}
          onContentSizeChange={() => openPaletteSearch()}
          onChangeText={(text) => setFilterQuery(text)}
          renderItem={renderPaletteGroup}
          keyExtractor={autoCompleteKeyExtractor}
          listStyle={{backgroundColor: 'transparent'}}
        />
        <Text>Swipe down to close</Text>
      </View>
    );

    return (
      <BottomSheet
        ref={paletteRef}
        snapPoints={bottomSnapPoints}
        borderRadius={10}
        onOpenStart={() => {
          console.log('open');
        }}
        initialSnap={closedSnapPoint}
        renderHeader={paletteHeader}
        renderContent={paletteContent}
        enabledInnerScrolling
        enabledContentTapInteraction
        enabledHeaderGestureInteraction
        enabledImperativeSnapping
        enabledBottomInitialAnimation
        enabledBottomClamp
        enabledContentGestureInteraction
      />
    );
  };
  // return the ImgageViewer Configured as the canvas with the palette
  return (
    <SafeAreaView style={{flex: 1, zIndex: 1, position: 'absolute'}}>
      <ImageViewer
        ref={imgViewerRef}
        imageUrls={images}
        index={initialIndex}
        loadingRender={renderLoader}
        renderIndicator={() => <></>}
        renderHeader={canvasHeader}
        renderFooter={canvasFooter}
        enableSwipeDown={true}
        onSwipeDown={onClose}
        saveToLocalByLongPress={false}
        useNativeDriver={true}
        enablePreload={true}
        style={styles.canvasContainer}
        footerContainerStyle={styles.canvasFooterContainerStyles}
      />
      {canvasPalette()}
    </SafeAreaView>
  );
});

/*
  renderSvg() {
    return (
      <Svg height="100%" width="100%" fill="red" viewBox="0 0 100 100">
        <Rect
          x={this.x}
          y={this.y}
          width="20"
          height="20"
          stroke="white"
          strokeWidth="1"
          fill="transparent"
          onPressIn={this.startDragBBOX}
          onPressOut={this.stopDragBBOX}
        />
      </Svg>
    );
  }*/
