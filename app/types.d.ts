declare type User = {
  id: string;
  name: string;
  organisation?: any;
};

declare interface BaseImage {
  uri?: string;
  height?: number;
  width?: number;
}

// type for image taken from camera
declare type CameraImage = BaseImage & {
  base64?: string;
  quality?: number;
  pictureOrientation?: number;
  deviceOrientation?: number;
};

// The TaskImage Type extends the CustomImage type and CameraImage type from as in the react native camera
// Type used to display images when they are already store
// We will use TaskImage as default image type inside our application when we will need to deal with tasks images
declare interface TaskImage extends CameraImage {
  // id?: string;
  name?: string; // all metas to describe the TasKImage like, Timestamp, createdDate, File size, extension and more..
  annotations?: ImageAnnotation[]; // optional ?
}

// The details informations object on the task { vehicleConditions, CarIdentifier, ... }
declare type TaskDetails = {
  vehicleContition?: string;
  vehicleActivity?: string;
  vehicleIdentifier?: string;
  vehicleIdentifierVal?: string;
  vehicleReferenceNumber?: string;
  vehicleCleanliness?: string;
};

// Todo: Implement in the next release// The result of predictions
declare interface TaskResult {}

declare type Task = {
  id?: string;
  author?: User;
  name?: string;
  completed?: boolean;
  createDate?: string;
  updateDate?: string;
  details?: TaskDetails; // PS: Could change in future versions, becoming an array of TaskDetails
  images: TaskImage[];
  results?: TaskResult[]; // DamageTypes.., PartTypes... this optional parameter result as it may come from a server in future versions
};
