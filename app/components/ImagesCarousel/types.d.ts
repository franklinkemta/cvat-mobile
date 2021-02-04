// We can use here either type or interface to define the ImageCarouselProps
declare interface ImageCarouselProps {
  annotatedImages: BaseImage[];
  layout: 'default' | 'stack' | 'tinder';
  onSnapToItem: (listImageIndex: number) => void; // Defined optional function parameter to handle item swipe
  itemWidthRatio?: number; // e.g 1 full witdth one item, 0.80 preview other items in the background
  itemHeightRatio?: number; // e.g 5 item height is almost 80% of the screen, 7 item height is small on top
}

declare type ImageCarouselState = {
  listImageIndex: number;
  annotatedImages: BaseImage[];
  canvasPreviwerModal: boolean;
};
