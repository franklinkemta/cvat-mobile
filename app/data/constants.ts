// Constant datas
export const vehicleConditions = [
  {label: 'New', value: 'NEW'},
  {label: 'Used', value: 'USED'},
];

export const vehicleActivities = [
  {label: 'Receiving in Factoring', value: 'NEW'},
  {label: 'Receiving in Road', value: 'RECEIVING_IN_ROAD'},
  {label: 'Pickup from Road', value: 'PICKUP_FROM_ROAD'},
  {label: 'Customer delivery', value: 'CUSTOMER_DELIVERY'},
  {label: 'Other', value: 'OTHER'},
];

export const vehicleCleanlinesses = [
  {label: 'Clean', value: 'CLEAN'},
  {label: 'Middle', value: 'MIDDLE'},
  {label: 'Dirty', value: 'DIRT'},
];

export const vehicleIdentifiers = [
  {label: 'Immatriculation', value: 'IMMATRICULATION'},
  {label: 'Vin', value: 'VIN'},
];

export const annotationLabels = ['DENT', 'MISSING_PIECE', 'SCRATCH', 'BROKEN'];

export const carouselImages: TaskImage[] = [];

/*
export const paletteGroups = [
  {
    categoryName: 'DORT FRONT LEFT',
    description: '',
    content: ['DENT', 'MISSING PIECE', 'DENT', 'SCRATCH', 'DENT', 'DIRT'],
    fallBackForm: 'circle',
  },
  {
    categoryName: 'PARRE BRISE',
    content: ['BROKEN', 'UNKNOWN', 'DENT', 'SCRATCH', 'DENT', 'DIRT'],
  },
  {
    categoryName: 'FRONT RIGHT',
    content: ['BROKEN', 'UNKNOWN'],
  },
  {
    categoryName: 'PARRECHOC ARRIERE',
    content: ['BROKEN', 'UNKNOWN'],
    fallBackForm: 'circle',
  },
];
*/

// Damage Category based
export const paletteGroups = [
  {
    categoryName: 'IMPACT LABELS',
    description: '',
    content: [{name: 'DENT'}, {name: 'BODY_CRACK'}, {name: 'MISSHAPE'}],
    fallBackForm: 'circle',
    fallBackColor: 'orange',
    fallBackIcon: 'circle',
  },
  {
    categoryName: 'PAINT LABELS',
    content: [
      {name: 'SCRATCH'},
      {name: 'GROUP_OF_SCRATCHES'},
      {name: 'SCATTERED_SCRATCHES'},
      {name: 'RUSTINESS'},
      {name: 'PAINT_PEELING'},
    ],
    fallBackForm: 'line', // path
    fallBackColor: 'cyan',
    fallBackIcon: 'minus',
  },
  {
    categoryName: 'ELEMENT LABELS',
    content: [
      {name: 'MISSING_PIECE'},
      {name: 'MISSING_HUBCAP'},
      {name: 'HUBCAP_SCRATCH'},
      {name: 'BROKEN_GLASS'},
      {name: 'BROKEN_LIGHT'},
    ],
    fallBackForm: 'ellipse',
    fallBackColor: 'red',
    fallBackIcon: 'selection-ellipse',
  },
  {
    categoryName: 'COMMON LABELS',
    content: [
      {name: 'SMASH'},
      {name: 'NOT_DEFINED'},
      {name: 'LIGHT_REFLECTIONS'},
      {name: 'CAR_LINEs_AND_CURVES'},
      {name: 'SHADOWS'},
    ],
    // fallBackForm: 'rect',
    // fallBackColor: 'white',
    fallBackIcon: 'selection-drag', // square
  },
];
