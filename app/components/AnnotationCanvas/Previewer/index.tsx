import React, {useRef, useState} from 'react';
import {
  gestureHandlerRootHOC,
  // TouchableOpacity,
} from 'react-native-gesture-handler';

import {Svg, Image} from 'react-native-svg';
import {SafeAreaView} from 'react-native-safe-area-context';

import ImageViewer from 'react-native-image-zoom-viewer';

import {Appbar} from 'react-native-paper';
// import vectors icons for palette

import {theme} from '/theme';
import styles from './styles';

import DraggableItem from '../DraggableItem';
import {ArrowLeftButton, ArrowRightButton} from '../ArrowButton';

import {LoadingIndicator} from '../LoadingIndicator';
import {alertMessage, hasAndroidPermission, savePicture} from '/utils';

// This one display a preview of annotated images
// Note that we wrap our app inside a gestureHandlerRootHOC, Read the docu. to learn more :) !
export const Previewer = gestureHandlerRootHOC((props: any) => {
  const {annotatedImages, initialIndex, handleClose} = props;

  const imgViewerRef = useRef<ImageViewer>(null);

  // if the image already have annotations we load with them
  const [annotations, setAnnotations] = useState(
    annotatedImages[initialIndex].annotations ?? Array,
  ); // the annotations on the current image

  const getCurrentIndex = () => {
    return imgViewerRef.current?.state.currentShowIndex ?? initialIndex; // instead return initial
  };

  const [currentIndex, setCurrentIndex] = useState(getCurrentIndex());

  // load the annotation for the next image
  const handleImageChange = async (nextIndex: number | undefined) => {
    console.log(`image changed from ${currentIndex} to ${nextIndex}`);
    if (nextIndex != undefined) {
      const nextImage: any = annotatedImages[nextIndex] ?? undefined;

      // load the next annotatedImages annotations
      if (nextImage != undefined) {
        console.log('loading annotations for index...', nextIndex);
        setAnnotations(nextImage.annotations ?? []);
        // save the previous index
        setCurrentIndex(nextIndex);
      }
    }
  };

  const handleCanvasClose = () => {
    console.log('close canvas previewer');
    handleClose();
  };

  const handleCanvasSave = async () => {
    // Share the image
    console.log('Share the image');
    if (hasAndroidPermission()) {
      // imgViewerRef.current?.saveToLocal();
      savePicture(annotatedImages[currentIndex].uri, {
        type: 'photo',
        album: 'CAT Mobile Previews',
      });
    }
  };

  // return the  current current index/totalCount for the header // formated to display (A/B)
  const getHeaderTitle = () => {
    const index = getCurrentIndex();
    if (index != undefined) {
      const itemsCount: number = annotatedImages.length;
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
          subtitle="Annotations on this image"
        />
        <Appbar.Action
          icon="download"
          color={theme.colors.transparent}
          size={25}
          disabled={true}
          onPress={handleCanvasSave}
        />
      </Appbar>
    );
  };

  const renderDraggableItem = (draggableItem: any, index: number) => {
    // console.info('Drawing item', draggableItem);
    return <DraggableItem key={index} draggableItem={draggableItem} />;
  };

  const canvasContent = (props: any) => {
    // console.log(props);
    return (
      <Svg style={{flex: 1}} fill="transparent">
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageViewer
        ref={imgViewerRef}
        imageUrls={annotatedImages}
        index={initialIndex}
        loadingRender={() => <LoadingIndicator />}
        renderIndicator={() => <></>}
        // renderArrowLeft={() => <ArrowLeftButton />}
        // renderArrowRight={() => <ArrowRightButton />}
        // pageAnimateTime={0}
        renderHeader={canvasHeader}
        renderImage={canvasContent}
        enableSwipeDown={false}
        onSave={() =>
          alertMessage('Done !', 'Annotated saved in your gallery !')
        }
        saveToLocalByLongPress={false}
        useNativeDriver={false}
        enablePreload={true}
        onChange={handleImageChange}
        style={styles.canvasContainer}
        footerContainerStyle={styles.canvasFooterContainerStyles}
      />
    </SafeAreaView>
  );
});
