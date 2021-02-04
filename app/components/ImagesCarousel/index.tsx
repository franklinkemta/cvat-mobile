import React from 'react';

import {Modal, Text} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

// import the carousel package
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {DEVICE_WIDTH} from '/utils';

import CarouselItem from './CarouselItem';

// import styles
import styles from './styles';

import {Previewer} from '../AnnotationCanvas/Previewer';

export class ImageCarousel extends React.Component<
  ImageCarouselProps,
  ImageCarouselState
> {
  carouselRef: any; // store the current carouselRef to pass it to the pagination container

  state = {
    listImageIndex: 0,
    annotatedImages: [],
    canvasPreviwerModal: false,
  };

  constructor(props: ImageCarouselProps) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
    this._handleSnapToItem = this._handleSnapToItem.bind(this);
    this._handleOnTapItem = this._handleOnTapItem.bind(this);

    // set items entries to the state
    const {annotatedImages}: any = this.props;
    // initial state and Map annotatedImages items to entries values
    this.state = {
      ...this.state,
      listImageIndex: 0,
      annotatedImages: annotatedImages,
    };
  }

  // get the carousel item width depending on the DEVICE_WIDTH
  get ITEM_WIDTH() {
    const ratio = this.props.itemWidthRatio ?? 0.8; // 80% the fallback value of props.itemWidthRatio
    return Math.round(DEVICE_WIDTH * ratio);
  }

  // get the carousel item heigth depending on the calculate ITEM_HEIGHT
  get ITEM_HEIGHT() {
    const ratio = this.props.itemHeightRatio ?? 3; // 3 the fallback value of props.itemHeightRatio
    return Math.round((this.ITEM_WIDTH * ratio) / 3); // * 3 ) / 4
  }

  _renderItem({item, index}: any, parallaxProps?: any) {
    // the optional parameter parallaxProps, for displaying annotatedImages
    // here we share the item properties as props of the CarouselItem child component
    // console.log('render_Item', item);
    return (
      <CarouselItem
        itemStyles={{width: this.ITEM_WIDTH, height: this.ITEM_HEIGHT}}
        {...item}
        index={index}
        parallaxProps={parallaxProps}
        onTap={this._handleOnTapItem}
        
      />
    );
  }

  setCanvasPreviewerModal = (visible: boolean) => {
    this.setState({canvasPreviwerModal: visible});
  };

  // Handle when item is taped and show modal
  _handleOnTapItem(listImageIndex: number) {
    // console.log(listImageIndex);
    this.setState({listImageIndex}); // may not be necessary
    this.setCanvasPreviewerModal(true);
  }

  // Handle when item is swiped and show annotations list
  _handleSnapToItem(listImageIndex: number) {
    // console.log('snaped to item', listImageIndex);
    this.setState({listImageIndex});
    this.props.onSnapToItem(listImageIndex);
  }

  // Render the grid image gallery under the PreviewGrid on ImageList item press
  _renderCanvasPreviewer = (annotatedImages: any[], listImageIndex: number) => (
    <Previewer
      annotatedImages={annotatedImages}
      initialIndex={listImageIndex}
      handleClose={() => {
        this.setCanvasPreviewerModal(false);
      }}
    />
  );

  render() {
    const {layout}: ImageCarouselProps = this.props;
    const {
      annotatedImages,
      canvasPreviwerModal,
      listImageIndex,
    }: ImageCarouselState = this.state;
    return (
      <>
        <Modal
          animationType="fade"
          transparent={true}
          visible={canvasPreviwerModal}
          onRequestClose={() => {
            this.setCanvasPreviewerModal(false);
          }}>
          {this._renderCanvasPreviewer(annotatedImages, listImageIndex)}
        </Modal>
        <Carousel
          ref={(ref: any) => {
            this.carouselRef = ref;
          }}
          layout={layout}
          data={annotatedImages}
          sliderWidth={DEVICE_WIDTH}
          itemWidth={this.ITEM_WIDTH}
          containerCustomStyle={styles.container}
          onSnapToItem={this._handleSnapToItem}
          inactiveSlideShift={1}
          layoutCardOffset={9}
          hasParallaxImages={true}
          renderItem={this._renderItem}
        />

        <Pagination
          carouselRef={this.carouselRef}
          dotsLength={annotatedImages.length}
          activeDotIndex={listImageIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          tappableDots={this.carouselRef ? true : false}
          inactiveDotStyle={styles.inactivePaginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </>
    );
  }
}
