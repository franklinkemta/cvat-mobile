declare type CardItemProps = {
  id: string;
  author: User;
  name: string;
  completed?: boolean;
  createDate: string;
  updateDate?: string;
  onPress?(id: string): void; // onPress?: (id: number) => void; // old syntax
  image: BaseImage;
  imagesCount?: number | undefined;
  resultsCount?: number | undefined;
};
