declare type CarouselItemProps = {
  name?: string; // title or others
  url: string; // check if it needa be string
  index: number;
  parallaxProps: any | undefined;
  onTap?(index: number): void;
  itemStyles: object;
};
