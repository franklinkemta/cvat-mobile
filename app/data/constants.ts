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

export const paletteGroups = [
  {
    categoryName: 'DORT FRONT LEFT',
    description: '',
    content: ['DENT', 'MISSING PIECE', 'DENT', 'SCRATCH', 'DENT', 'DIRT'],
    fallBackItem: 'circle',
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
  },
];
