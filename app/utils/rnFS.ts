import RNFS from 'react-native-fs';

// rnFs -> react-native filesytem

// Todo get the FS_PATHS form the global config
export enum FS_PATHS {
  ANNOTATIONS = 'annotations',
  TASK_IMAGES = 'task_images',
}

/**
 * @name saveFileToFs
 * @param file
 * @param fileName
 * @param appPath
 */
export const saveFileToFs = async (
  fileData: any,
  fileName: string,
  appPath?: FS_PATHS,
): Promise<string | boolean> => {
  let path;
  switch (appPath) {
    case FS_PATHS.ANNOTATIONS:
      path = RNFS.DocumentDirectoryPath + '/' + FS_PATHS.ANNOTATIONS;
      break;
    case FS_PATHS.TASK_IMAGES:
      path = RNFS.DocumentDirectoryPath + '/' + FS_PATHS.TASK_IMAGES;
      break;
    default:
      path = RNFS.TemporaryDirectoryPath;
      break;
  }
  path += '/' + fileName; // add the file name
  // const stats = await RNFS.PicturesDirectoryPath
  // throw 'UNIMPLEMENTED';
  // return Promise.resolve('UNIMPLEMENTED');
  /*
  return RNFS.writeFile(path, fileData)
    .then((sucess: any) => {
    // console.log('FILE WRITTEN', sucess);
      return true;
    })
    .catch((err) => {
    // console.log(err.message);
      return false;
    });
    */
};

/**
 * @name readFileFromFs
 * @param fileName
 * @param appPath
 * @param encoding
 */
export const readFileFromFs = async (
  fileName: string,
  appPath?: string,
  encoding?: FS_PATHS,
): Promise<string | boolean> => {
  let path;
  switch (appPath) {
    case FS_PATHS.ANNOTATIONS:
      path = RNFS.DocumentDirectoryPath + '/' + FS_PATHS.ANNOTATIONS;
      break;
    case FS_PATHS.TASK_IMAGES:
      path = RNFS.DocumentDirectoryPath + '/' + FS_PATHS.TASK_IMAGES;
      break;
    default:
      path = RNFS.TemporaryDirectoryPath;
      break;
  }
  path += '/' + fileName; // add the file name
  // read the file
  return RNFS.readFile(path, encoding)
    .then((fileData: any) => {
    // console.log('FILE READ');
      return fileData;
    })
    .catch((err) => {
    // console.log(err.message);
      return false;
    });
};
