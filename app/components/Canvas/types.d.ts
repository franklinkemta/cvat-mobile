// Annotation palette props and items props


 type Coordinates = {
  // svg coordinates
  x: number; // Position
  y: number;
  z: number;
  heigth?: number; // we consider using this only when the zoomable feature will be implemented
  width?: number; // we consider using this only when the zoomable feature will be implemented
};

 class DraggableItem {
  index: number; // required to select and know the item that was tappped / selected
  item?: any; // the item that will be returned back  with the result after the drag, // we'll use it to store ids, or indexes
  paletteIndex: number; // we save the paletted index so that we can group the dumps by categories, e.g DORT_FRONT_LEFT [ 'DENT', 'SCRATCH' ]
  currentlyAt?: Coordinates; // updated during the drag
  draggedAt?: Coordinates; //  returned when we dump the drags
  origin?: Coordinates; // Set when we load the drag with existing value of draggedAt. // i can serve to check if there were changes after drags
  svgForm?: 'square' | 'circle' | 'polygon' | 'text' // | 'sketch'; // the selected react native svg to use,// i nothing is specified a default will be text // sketch here stands for free drag, but we won't implement it for now
  label?: string; // the label to display at the top of the svg, DENT, SCRATCH, just for example
  color?: string; // the border color or the svg, // example white for tagging BBOX [ ]
  fill?: string; // the background color to fille the svg, // example rgba white with opacity
  svgStyles?: object; // a generic style to apply on the item svg form
  containerStyle?: object; // a generic style to apply on the item touchable opacity container
  onDragStart?(canvasRef: any): [number, Coordinates]; // apply react animated transformation on it
  onDragEnd?(canvasRef: any): [number, Coordinates]; // call hasBeenDragged() off the canvas
  onRotateState?(canvasRef: any): [number, Coordinates]; // apply svg rotation on it using reanimated
  onRotateEnd?(canvasRef: any): [number, Coordinates]; // call hasBeenRotated() off the canvas
  onSelect?(canvasRef: any): [number, Coordinates]; // call hasBeenSelected() off the canvas
}

// Used to group drawed items on the canvas wish share the sames properties
/* the items properties, it takes everything we want to annotate our images with, e.g an array of objects with labels: [ { id: 0, label: 'DENT', 'Scratch', 'Whatever' } ] // used for annotation*
   when we will build our Draggable items, all those items, will become the item attribute of DraggableItem
*/
 type PalleteGroup = {
  categoryName: string; // Exemple : DORT FRONT LEFT || PORTIERE AVANT || PARECHOC ARRIERE etc.. // the palleteName is a kindof primary key
  description?: string; // any other description to display
  content: string[];
  fallBackItem?: string; // if we need to set a default svgForm for all items of this palette.
};

 type CanvasMedia = {
  type: 'image', // | 'video', 'camera', // only image for now
  uri?: string;
  origin?: Coordinates;
  // other metas
}

// the canva receive a palette item(rn-svg) and let the user drag/or/drag it on the media, the
type CanvasProps = {
  paletteTitle?: '', // e.g Vehicles parts .. Categories..etc..
  initialPaletteGroups: PalleteGroup[]; // Stands for categories list
  mode?: 'blank' | 'black' | 'image'; // | 'video', // | 'camera'; // the type of video or image we're going to drag on // we prepare for the future version to drag while the flux is coming from camera stream
  transparent?: boolean; // weither the canvas backgroud is transparent or not
  source: CanvasMedia;  // the media source to use as the board off the canvas
  canvasStyles?: any; // any style to apply to the canva container
  // zoomable?: boolean; // not impleted
  onInsert?(): DraggableItem; // callback when an item is inserted in the canvas
  onClose?(): void; // What to do when the canvas was closed // save
  onSaveDump?(form: Array): DraggableItem[]; // Dump all the received items items back updated with their coordinates on the image, // will this trigger the on close even at the end?
  initialItems?: DraggableItem[]; // when we load the canvas if we have initial drags
};

// canvas state  // can serve to definie the default state values
 type CanvasState = {
  currentDrags?: DraggableItem[]; // will be dumped at the end of the draggs,
  focusedItemIndex?: number; // dragged item index
  focusedItem?: DraggableItem; // currentFocused item
  lastDraggedCordinates: DraggableItem[]; // when we drag an item, we push the change in the list, so the last draggedItem/focusedItem is the item at the length-1 of the list
}

// we be used to type the canvas state in the drag in time
 class Canvas extends CanvasProps, CanvasState {
  canvasRef?: any; // return a ref object of the canvas
  
  public get canvasRef(): any { return this.canvasRef }; // get the canvas ref so that we can invoque his method from outside?

  // here we can define the default values
  constructor(props: CanvasProps, state: CanvasState): void;

  itemHasBeenDragged(itemIndex: number, to: Coordinates): void; // update // set focused item at givenIndex, and st
  itemHasBeenRotated(itemIndex: number, to: Coordinates): void; // update // set focused item
  itemHeenSelected(itemIndex: number, at: Coordinates): void; // update // set focused item

  get focusedItemIndex(): DraggableItem | undefined;
  set focusetItemIndex(draggableItem: DraggableItem): void;

  get focusedItem(): DraggableItem | undefined ; // it can be undefined when nothing is selected
  set focusetItem(draggableItem: DraggableItem): void;
  get isDragging(): boolean { return this.isDragging; }

  deleteFocusedItem(): void; // remove the focused item from the list
  redragItems(): void; // reload all the items coordinates on the canvas from the initial list, and reset the dragged list
  closeCanvas(): void; // close canvas
  dumpDraggs (format: string): any; // for now we dont know how to save that
}

// To resume, our Annotation Palellte use a canvas for dragging and displaying, and the items are formed
// from a a PalletteGroup properties and items list
