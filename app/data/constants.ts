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

// Damage Category based paletteGroups
export const damageTypes = [
  {
    id: '0',
    categoryName: 'IMPACT LABELS',
    description: '',
    labels: [{name: 'DENT'}, {name: 'BODY_CRACK'}, {name: 'MISSHAPE'}],
    fallBackForm: 'circle',
    fallBackColor: 'orange',
    fallBackIcon: 'circle',
  },
  {
    id: '1',
    categoryName: 'PAINT LABELS',
    labels: [
      {name: 'SCRATCH'},
      {name: 'GROUP_OF_SCRATCHES'},
      {name: 'SCATTERED_SCRATCHES'},
      {name: 'RUSTINESS'},
      {name: 'PAINT_PEELING'},
    ],
    fallBackForm: 'line', // path
    fallBackColor: '#00e5ff', // blue
    fallBackIcon: 'minus',
  },
  {
    id: '2',
    categoryName: 'ELEMENT LABELS',
    labels: [
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
    id: '3',
    categoryName: 'COMMON LABELS',
    labels: [
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

// Vehicle parts category based palette groups
export const vehiclesParts = [
  {
    id: '4',
    categoryName: 'DORT FRONT LEFT',
    description: '',
    labels: [
      {name: 'DENT'},
      {name: 'MISSING PIECE'},
      {name: 'SCRATCH'},
      {name: 'DIRT'},
    ],
    fallBackForm: 'square',
    fallBackColor: 'white',
    fallBackIcon: 'square',
  },
  {
    id: '5',
    categoryName: 'PARRE BRISE',
    description: '',
    labels: [
      {name: 'BROKEN'},
      {name: 'UNKNOWN'},
      {name: 'SCRATCH'},
      {name: 'DIRT'},
    ],
    fallBackForm: 'square',
    fallBackColor: 'white',
    fallBackIcon: 'square',
  },
  {
    id: '6',
    categoryName: 'FRONT RIGHT',
    description: '',
    labels: [{name: 'BROKEN'}, {name: 'UNKNOWN'}],
    fallBackForm: 'square',
    fallBackColor: 'white',
    fallBackIcon: 'square',
  },
  {
    id: '7',
    categoryName: 'PARRECHOC ARRIERE',
    description: '',
    labels: [{name: 'BROKEN'}, {name: 'UNKNOWN'}],
    fallBackForm: 'square',
    fallBackColor: 'white',
    fallBackIcon: 'square',
  },
];

export const paletteGroups = [...damageTypes, ...vehiclesParts];
