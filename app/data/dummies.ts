// Here are some dummy data to prototype our app

// import {TaskItem} from '/components/TaskItem';
// type TaskItemProps = React.ComponentProps<typeof TaskItem>;

export const tasks: Omit<Task, 'onPress'>[] = [
  {
    id: '1',
    author: {id: '1', name: 'Admin'},
    name: 'ANNOTATION : Renault Clio Estate 1.5 dCi 85 eco2 Dynamique',
    images: [
      {
        metas: {name: 'Exterieur'},
        annotations: [
          {
            customAnnotationTypeName: 'FRONT RIGHT',
            labels: ['DENT', 'MISSING PIECE'],
          },
          {
            customAnnotationTypeName: 'DOOR FRONT LEFT',
            labels: ['BROKEN', ''],
          },
        ],
        uri:
          'https://prod.pictures.autoscout24.net/listing-images/5883fd5d-84de-4a46-9039-b8a0dc3627e6_3cdf9e4b-ae17-4a4b-8e2a-c3ef53e65842.jpg/640x480.jpg',
      },
      {
        metas: 'Arriere',
        uri:
          'https://prod.pictures.autoscout24.net/listing-images/5883fd5d-84de-4a46-9039-b8a0dc3627e6_a2126b37-4946-4fc6-8895-5e634e867e96.jpg/640x480.jpg',
      },
      {
        metas: {name: 'Sieges'},
        uri:
          'https://prod.pictures.autoscout24.net/listing-images/5883fd5d-84de-4a46-9039-b8a0dc3627e6_e0ce4bf0-d010-4085-bb2e-fa879044d33c.jpg/640x480.jpg',
      },
      {
        metas: {name: 'Tableau de bord'},
        uri:
          'https://prod.pictures.autoscout24.net/listing-images/5883fd5d-84de-4a46-9039-b8a0dc3627e6_4c3467c6-c22b-4459-ab21-eb51d23a5826.jpg/640x480.jpg',
      },
      {
        metas: 'Sieges passager',
        uri:
          'https://prod.pictures.autoscout24.net/listing-images/5883fd5d-84de-4a46-9039-b8a0dc3627e6_a60a1719-01d8-4735-811a-80baa22c2ae8.jpg/640x480.jpg',
      },
    ],
    createDate: '15-01-2021 14:30:15',
    updateDate: '15-01-2021 14:30:15',
  },
  {
    id: '2',
    author: {id: '2', name: 'Franklin'},
    name: 'Annotation Carefour Bahmad',
    images: [
      {
        metas: {name: 'Image 1'},
        annotations: [
          {customAnnotationTypeName: 'DOOR FRONT LEFT', labels: ['SCRATCH']},
          {
            customAnnotationTypeName: 'FENDER BACK LEFT',
            labels: ['DENT', 'BROKEN', 'MISSING PIECE'],
          },
        ],
        uri: 'https://www.marocannonces.com/user_images/314/4281329.jpg',
      },
      {
        metas: {name: 'Image 21'},
        uri: 'https://www.marocannonces.com/user_images/314/1911177.jpg',
      },
      {
        metas: {name: 'Image 22'},
        uri: 'https://www.marocannonces.com/user_images/314/6775813.jpg',
      },
      {
        metas: {name: 'Image 23'},
        uri: 'https://www.marocannonces.com/user_images/314/6083850.jpg',
      },
    ],
    results: [{}, {}], // Dummy
    completed: true,
    createDate: '15-01-2021 14:30:15',
    updateDate: '15-01-2021 14:30:15',
  },
  {
    id: '3',
    author: {id: '2', name: 'Franklin'},
    name: 'Annotation Casa Port - Parking',
    images: [
      {
        metas: {name: 'Image 3'},
        uri:
          'https://www.moteur.ma/media/photos/ads/resized/kia-sportage-631317.JPG',
      },
      {
        metas: {name: 'Image 4'},
        uri:
          'https://www.moteur.ma/media/photos/ads/resized/kia-sportage-873425.JPG',
      },
    ],
    completed: true,
    createDate: '15-01-2021 14:30:15',
    updateDate: '15-01-2021 14:30:15',
  },
];
