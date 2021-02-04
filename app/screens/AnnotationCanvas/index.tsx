import React, {useEffect, useRef, useState} from 'react';
import {
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

import ImageViewer from 'react-native-image-zoom-viewer';

import {Appbar, TouchableRipple} from 'react-native-paper';
// import vectors icons for palette

import {alertMessage, DEVICE_HEIGHT, idFromUuid} from '/utils';

import {theme} from '/theme';
import styles from './styles';

import DraggableItem from '../../components/AnnotationCanvas/DraggableItem';
import {
  ArrowLeftButton,
  ArrowRightButton,
} from '../../components/AnnotationCanvas/ArrowButton';

import {Palette} from '../../components/AnnotationCanvas/Palette';
import {LoadingIndicator} from '../../components/AnnotationCanvas/LoadingIndicator';

// Note that we wrap our app inside a gestureHandlerRootHOC, Read the docu. to learn more :) !
export const AnnotationCanvas = gestureHandlerRootHOC((props: any) => {
  const {navigation, route} = props;
  const {images, paletteGroups, initialIndex, paletteTitle} = route.params;

  const paletteRef = useRef<Palette>(null);
  const imgViewerRef = useRef<ImageViewer>(null);

  const safeAreaInsets = useSafeAreaInsets();

  // all the modifications will be stored in this variable
  const [currentImages, setCurrentImages] = useState(images);

  // if the image already have annotations we load with them
  const [annotations, setAnnotations] = useState(
    images[initialIndex].annotations ?? Array,
  ); // the annotations on the current image

  const [selectedPaletteItem, setSelectedPaletteItem] = useState(undefined);
  const [focusedItem, setFocusedItem] = useState(undefined); // to handle double tap on each draggable item

  const getCurrentIndex = () => {
    return imgViewerRef.current?.state.currentShowIndex ?? initialIndex; // instead return initial
  };

  const [currentIndex, setCurrentIndex] = useState(getCurrentIndex());

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
    return releaseBackButton(true);
  });

  // store the current annotations on the corresponding image when the annotated image change
  const updateImageAnnotations = async () => {
  // console.log('saving annotations at index...', currentIndex);
    // update the annotations for the image at the current index
    const currentImage = currentImages[currentIndex];
    const updatedImage = {
      ...currentImage,
      annotations: annotations,
    };
    const updatedModifs = currentImages;
    updatedModifs[currentIndex] = updatedImage;
    setCurrentImages(updatedModifs);
  };

  // load the annotation for the next image
  const handleImageChange = async (nextIndex: number | undefined) => {
  // console.log(`image changed from ${currentIndex} to ${nextIndex}`);
    if (nextIndex != undefined) {
      // save the annotations of the current image first
      await updateImageAnnotations();

      const nextImage: any = currentImages[nextIndex] ?? undefined;

      // load the next images annotations
      if (nextImage != undefined) {
      // console.log('loading annotations for index...', nextIndex);
        setAnnotations(nextImage.annotations ?? []);
        // save the previous index
        setCurrentIndex(nextIndex);

        // remove focus on the selected item
        setFocusedItem(undefined);
      }
    }
  };

  const handleCanvasClose = () => {
    alertMessage(
      'Cancel annotation ?',
      'Are you sure you want to cancel the current changes?',
      [
        {
          text: 'Yes, Cancel',
          onPress: () => {
            navigation.navigate(route.params.previousScreen, {
              updatedImages: [], // indicate that the annotation was canceled
            });
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const handleCanvasSave = async () => {
    // releaseBackButton(true);
    // save the annotations on the current images first
  // console.log('Save and exist');
    await updateImageAnnotations();
    navigation.navigate(route.params.previousScreen, {
      updatedImages: currentImages,
    });
  };

  const addSelectedItem = async (svgEvent: any) => {
    // item: any, paletteGroupName: string
    // console.warn('SVG add item click event', svgEvent.nativeEvent);
    // console.log('layout', svgEvent.nativeEvent.layout);
    if (selectedPaletteItem != undefined) {
      const drawAnnotationItem: any = {
        id: idFromUuid(), // create a unique id for each drawed item
        ...(selectedPaletteItem ?? {}),
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
      // setSelectedPaletteItem(undefined); // unselected item from palette
    }
  };

  const removeSelectedItem = async () => {
    // item: any, paletteGroupName: string
    // console.warn('SVG remove item click event');
    const draggableItem: any = focusedItem;
    setAnnotations(
      annotations.filter((item: any) => item.id != draggableItem.id),
    ); // remove the item at index
    setFocusedItem(undefined); // clear focused item
  };

  const moveSelectedItem = async (moveEvent: any) => {
    // console.warn('SVG move item click event', moveEvent.nativeEvent);
    if (focusedItem != undefined) {
      const draggableItem: any = focusedItem;
      const width = draggableItem.origin.width;
      const height = draggableItem.origin.height;

      const movedItem: any = {
        ...draggableItem,
        origin: {
          x: moveEvent.nativeEvent.locationX,
          y: moveEvent.nativeEvent.locationY,
          width: width, // zoomIN/OUT width
          height: height, // zoomIN/OUT height
        },
      };
      const updatedAnnotations = annotations;
      const movedIndex: number = updatedAnnotations.findIndex(
        (item: any) => item.id == draggableItem.id,
      );
      updatedAnnotations[movedIndex] = movedItem;
      setAnnotations(updatedAnnotations);
      /*
      setAnnotations([
        ...annotations.filter((item: any) => item.id != draggableItem.id),
        movedItem,
      ]); // update the item at index
      */
      setFocusedItem(movedItem);
    }
  };

  const zoomSelectItem = async (zoomRatio: number) => {
    // console.warn('SVG zoom item click event');
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
    const index = getCurrentIndex();
    if (index != undefined) {
      const itemsCount: number = images.length;
      return `${index + 1}/${itemsCount}`;
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
          onPress={async () => zoomSelectItem(ZoomRatio)}
          color={theme.colors.border}></Appbar.Action>
        <Appbar.Action
          icon="minus-circle-outline"
          size={30}
          onPress={async () => zoomSelectItem(-ZoomRatio)}
          color={theme.colors.border}></Appbar.Action>
        <Appbar.Action
          icon="close-circle-outline"
          size={30}
          /* onPress={() => setFocusedItem(undefined)}*/
          /* onLongPress={removeSelectedItem} */
          onPress={removeSelectedItem}
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
            onPress={() => paletteRef.current?.openPalette()}>
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
        onTouchEnd={() => {
          setSelectedPaletteItem(undefined);
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

  // return the ImgageViewer Configured as the canvas with the palette
  // const singleImage = [currentImages[initialIndex]];
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageViewer
        ref={imgViewerRef}
        imageUrls={images}
        index={initialIndex}
        loadingRender={() => <LoadingIndicator />}
        renderIndicator={() => <></>}
        renderArrowLeft={() => <ArrowLeftButton />}
        renderArrowRight={() => <ArrowRightButton />}
        // pageAnimateTime={0}
        renderHeader={canvasHeader}
        renderFooter={canvasFooter}
        renderImage={canvasContent}
        enableSwipeDown={false}
        saveToLocalByLongPress={false}
        useNativeDriver={true}
        enablePreload={true}
        onClick={() => setFocusedItem(undefined)}
        onChange={handleImageChange}
        style={styles.canvasContainer}
        footerContainerStyle={styles.canvasFooterContainerStyles}
      />
      <Palette
        ref={paletteRef}
        title={paletteTitle}
        paletteGroups={paletteGroups}
        selectedPaletteItem={selectedPaletteItem}
        onSelect={(draggableItem: any) => {
          setFocusedItem(undefined);
          setSelectedPaletteItem(draggableItem);
        }}
        onInputClear={() => setSelectedPaletteItem(undefined)}
        safeAreaInsets={safeAreaInsets}
      />
    </SafeAreaView>
  );
});
