import React from 'react';
import {Image, Modal, ScrollView, View} from 'react-native';

import {
  useTheme,
  Paragraph,
  Caption,
  TextInput,
  Button,
  ToggleButton,
  Portal,
} from 'react-native-paper';

import {Picker} from '@react-native-picker/picker';
// import our custom preview grid package
import PreviewGrid from 'react-native-preview-images';

// import vectors icons for tabs
import Icon from 'react-native-vector-icons/FontAwesome5';

// get default theme colors
import {theme} from '/theme';

import {AppRoutes} from '/navigation/routes';

import {CameraButton} from '/components/CameraButton';
import {HomeTabsContext} from '/screens/Home/Tabs/tabs';

// import styles
import styles from './styles';

// import utils
import {
  idFromDateAndPrefix,
  formatImagesSources,
  idFromUuid,
  formatImageSource,
  uriFromBase64,
  saveFileToFs,
  readFileFromFs,
  FS_PATHS,
} from '/utils';

// todo implement store
import {
  vehicleConditions,
  vehicleActivities,
  vehicleCleanlinesses,
  vehicleIdentifiers,
} from '/data';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Canvas} from '../../components/Canvas';

// Todo: Move this to app global config
const MAX_TASK_PHOTOS_DEFAULT = 20;
const DEBUG_MODE = false;

// Let define a type to be sure we received the navigation elements
type TaskCreateProps = {
  route: any;
  navigation: any;
  theme: any;
};

// We implements the Task Modal to use TaskFormState to directly type our TaskForm fields
interface TaskFormState extends Task {
  showFAB?: boolean;
  scrolling?: boolean;
  scrollIsTop?: boolean;
  listImageIndex?: number;
  annotationCanvasModal?: boolean;
  annotationPalette?: boolean;
}

/*
const AnnotationPalette = () => {

}
*/

export class TaskCreate extends React.Component<
  TaskCreateProps,
  TaskFormState
> {
  previewGridRef: any;
  imgViewerRef: any;

  state = {
    showFAB: true,
    scrolling: false,
    scrollIsTop: true,
    listImageIndex: 0,
    annotationCanvasModal: false,
    id: idFromUuid(), // Generate unique ID for the task
    author: {
      id: idFromUuid(),
      name: 'Me',
    }, // Todo: Get the current user
    completed: undefined,
    name: '',
    createDate: '',
    updateDate: '',
    details: {
      vehicleContition: undefined,
      vehicleActivity: undefined,
      vehicleIdentifier: undefined,
      vehicleIdentifierVal: undefined,
      vehicleReferenceNumber: undefined,
      vehicleCleanliness: undefined,
    },
    images: [
      /*
      {
        metas: {name: 'Image 1'},
        annotations: [
          {customAnnotationTypeName: 'DOOR FRONT LEFT', labels: ['SCRATCH']},
          {
            customAnnotationTypeName: 'FENDER BACK LEFT',
            labels: ['DENT', 'BROKEN', 'MISSING PIECE'],
          },
        ],
        url: 'https://source.unsplash.com/1600x900/?bus,travel',
      },
      {
        metas: {name: 'Image 1'},
        annotations: [
          {customAnnotationTypeName: 'DOOR FRONT LEFT', labels: ['SCRATCH']},
          {
            customAnnotationTypeName: 'FENDER BACK LEFT',
            labels: ['DENT', 'BROKEN', 'MISSING PIECE'],
          },
        ],
        url: 'https://source.unsplash.com/1600x900/?bus,travel',
      },
      {
        metas: {name: 'Image 1'},
        annotations: [
          {customAnnotationTypeName: 'DOOR FRONT LEFT', labels: ['SCRATCH']},
          {
            customAnnotationTypeName: 'FENDER BACK LEFT',
            labels: ['DENT', 'BROKEN', 'MISSING PIECE'],
          },
        ],
        url: 'https://source.unsplash.com/1600x900/?bus,travel',
      },
      {
        metas: {name: 'Image 1'},
        annotations: [
          {customAnnotationTypeName: 'DOOR FRONT LEFT', labels: ['SCRATCH']},
          {
            customAnnotationTypeName: 'FENDER BACK LEFT',
            labels: ['DENT', 'BROKEN', 'MISSING PIECE'],
          },
        ],
        url: 'https://source.unsplash.com/1600x900/?bus,travel',
      },
      {
        metas: {name: 'Image 1'},
        annotations: [
          {customAnnotationTypeName: 'DOOR FRONT LEFT', labels: ['SCRATCH']},
          {
            customAnnotationTypeName: 'FENDER BACK LEFT',
            labels: ['DENT', 'BROKEN', 'MISSING PIECE'],
          },
        ],
        url: 'https://source.unsplash.com/1600x900/?bus,travel',
      },
      */
    ],
  };

  constructor(props: TaskCreateProps) {
    super(props);
    // this.previewGridRef = React.useRef<PreviewGrid>(null);
    // note that we only bind when we dont define our handle function as arrow function like this taskFunc = () =>
  }

  componentDidMount() {
    // show fab
    this.setState({showFAB: this.props.navigation.isFocused()});
    // generate a reference number for the vehicle based on the current timestamp
    this.setFormDetailsField = {vehicleReferenceNumber: idFromDateAndPrefix()};
  }

  // check if we received a takenPhoto from the Camera navigation going back after snap
  componentDidUpdate() {
    // prevProps: any
    // todo define the Props types for this component, with optional param takenPhoto?
    const routeParams = this.props.route.params;

    if (routeParams?.takenPhotos?.length) {
      // store the photo in a temp variable and set the routeParams.takenPhotos to undefined to unsubscribe the componentDidUpdate circle check on this block
      const takenPhotos: CameraImage[] = routeParams.takenPhotos;
      console.log('taken photos', takenPhotos.length);

      this.props.navigation.setParams({takenPhotos: undefined});
      this.setState({showFAB: true}); // show fab

      takenPhotos.forEach(this.handleTakenPhoto);
    }
  }

  // Get the state as a form
  get form() {
    return this.state;
  }
  get formDetails() {
    return this.state.details;
  }

  // Treat the state as form and update fields inside, by keeping existing values
  set setFormField(formField: any) {
    this.setState((prevState) => ({...prevState, ...formField})); // see the # between this.task and task
  }

  set setFormDetailsField(formDetailField: any) {
    this.setState((prevState) => {
      const details = {...prevState.details, ...formDetailField};
      return {...prevState, details: details};
    }); // see the # between this.task and task
  }

  setAnnotationCanvasModal = (visible: boolean) => {
    this.setState({annotationCanvasModal: visible});
  };

  get vehicleIdentifierLabel() {
    // return the current selected vehicle identifier label
    const items = vehicleIdentifiers.filter(
      (item) => item.value == this.formDetails.vehicleIdentifier,
    );
    return items.length ? items[0].label : undefined;
  }

  get headingTitle() {
    return this.form.name ?? undefined;
  }

  // open camera view to take photos snap, each taken photo will be returned by a callback
  openCameraDefault = () => {
    const {navigation} = this.props;
    navigation.navigate(AppRoutes.KITCHEN);

    navigation.navigate(AppRoutes.CAMERA_VIEW, {
      debugMode: DEBUG_MODE,
      showCountBtn: false,
      maxNumberOfPhotos: MAX_TASK_PHOTOS_DEFAULT,
      rafaleMode: false, // serialize the callback
      cameraOptions: {
        // inner camera module options
        base64: true,
        quality: 0.5, // take high quality in default mode
        doNotSave: true,
        pauseAfterCapture: true,
      }, // for dev only
      currentImagesCount: this.form.images.length, // check about lodash _size  vs default Array.length
      previousScreen: AppRoutes.TASK_CREATE, // navigate back to previousScreen with the takenImage data as param when a photo is taken
    });
  };

  // open camera view to take photos snap, each taken photo will be returned by a callback
  openCameraRafale = () => {
    const {navigation} = this.props;
    navigation.navigate(AppRoutes.CAMERA_VIEW, {
      debugMode: DEBUG_MODE, // show debug only on rafale mode for now, because this mode is unsafe
      showCountBtn: true,
      maxNumberOfPhotos: MAX_TASK_PHOTOS_DEFAULT,
      rafaleMode: true, // serialize the callback
      cameraOptions: {
        // inner camera module options
        base64: true,
        quality: 0.2, // take low quality on rafales
        doNotSave: true,
        pauseAfterCapture: false,
      }, // for dev only
      currentImagesCount: this.form.images.length, // check about lodash _size  vs default Array.length
      previousScreen: AppRoutes.TASK_CREATE, // navigate back to previousScreen with the takenImage data as param when a photo is taken
    });
  };

  // load the selected image in the imgViewGallery to the annotation canvas
  openAnnotationCanvas = () => {
    /*
    const {navigation} = this.props;
    const imageIndex = this.state.listImageIndex;
    const selectedImage: CameraImage = this.state.images[imageIndex];
    const canvaMedia: any = {...selectedImage};

    navigation.navigate(AppRoutes.ANNOTATION_VIEW, {
      selectedImage: canvaMedia,
      listImageIndex: imageIndex,
      previewGridRef: this.previewGridRef, // Todo move to redux
      imgViewerRef: this.imgViewerRef, // Todo move to redux
    });

    this.setAnnotationCanvasModal(false);
    // 
    */
    // this.setAnnotationPalette(true);
  };

  closeAnnotationCanvas = () => {
    this.setAnnotationCanvasModal(false);
  };

  saveDumpedAnnotations = () => {
    console.log('Finished annotating');
    this.setAnnotationCanvasModal(false);
  };

  formatTakenPhoto = (takenPhoto: CameraImage): TaskImage => {
    // format takenPhoto to a Task image format and add to the task form.images[] in the state
    const takenPhotoIndex: number = this.form.images.length;
    // console.log('TakenPhoto number', takenPhotoIndex);
    // As we used base64 option to true, we need to provid a new uri from base64 to other to display our image properly in the PreviewGrid
    const uri = uriFromBase64(String(takenPhoto.base64), 'image/png'); // 'data:image/png;base64,' + takenPhoto.base64; // Todo: check what we be better, png or jpeg
    return formatImageSource({
      ...takenPhoto, // formatImgSourceFromTakenPhoto(takenPhoto), // formatImgSourceFromTakenPhoto(takenPhoto)
      uri: uri,
      metas: {name: `${takenPhotoIndex}`}, // Will be updated on submit to add the taken timestamp and the ID of the task or referenceNumber to prefix the name of the image
      annotations: [], // set the default annotations to [], Todo, call a predict API to help user by preloading annotations.
    }) as TaskImage;
  };

  // the callback that handle the taken camera photos snap
  handleTakenPhoto = async (takenPhoto: CameraImage) => {
    const formatedTakenPhoto = this.formatTakenPhoto(takenPhoto);

    this.setState((prevState) => ({
      images: [...prevState.images, formatedTakenPhoto],
    }));

    /*
    await saveFileToFs(
      takenPhoto.base64,
      'CAT_' + String(Math.random()),
      FS_PATHS.TASK_IMAGES,
    );
    */
    //console.log({...formatedTakenPhoto});
  };

  // handle form submit, save the created task to react native async storage ! for now :)
  _handleOnSubmit = () => {
    // compose the task from form fields and dispatch to actions
  };

  // some anims on scroll for fab
  _handleScrollStart = () => {
    this.setState({
      scrolling: true,
      //scrollIsTop: this.state.scrollIsTop ? false : true,
    });
  };
  _handleScrollEnd = () => {
    this.setState({
      scrolling: false,
      //scrollIsTop: this.state.scrollIsTop ? true : false,
    });
  };
  _handleScrollTop = () => {
    this.setState({
      scrollIsTop: true,
    });
  };

  _renderCameraButton = () => {
    // render Fab if we are on the right screen
    return (
      <HomeTabsContext.Consumer>
        {({routeName}) => (
          <CameraButton
            visible={this.props.navigation.isFocused()}
            theme={this.props.theme}
            onPress={this.openCameraDefault}
            onLongPress={this.openCameraRafale}
          />
        )}
      </HomeTabsContext.Consumer>
    );
  };

  __renderAnnotationCanvas() {
    const paletteGroups = [
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
    return (
      <Canvas
        images={this.state.images}
        onClose={this.closeAnnotationCanvas}
        onSaveDump={this.saveDumpedAnnotations}
        initialIndex={this.state.listImageIndex}
        paletteGroups={paletteGroups}
        paletteTitle="Annotation Palette"></Canvas>
    );
  }

  render() {
    const {
      annotationCanvasModal,
      listImageIndex,
      scrolling,
      showFAB,
    } = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Portal.Host>
          <ScrollView
            style={styles.scrollview}
            onScrollBeginDrag={this._handleScrollStart}
            onScrollEndDrag={this._handleScrollEnd}>
            <View style={styles.formContainer}>
              {this.state.scrollIsTop ? (
                <View style={styles.heading}>
                  <View style={styles.headingIcon}>
                    <Icon
                      name="car-crash"
                      color={theme.colors.primary}
                      size={50}
                    />
                  </View>
                  <Paragraph style={styles.paragraph}>
                    {'New annotation task'}
                  </Paragraph>
                  <Caption style={[styles.paragraph, styles.caption]}>
                    {this.headingTitle ?? 'Please specify the task info'}
                  </Caption>
                </View>
              ) : null}

              <View style={styles.formControl}>
                <Paragraph style={styles.formLabel}>Name</Paragraph>
                <TextInput
                  label="Enter task name"
                  value={this.form.name ?? ''}
                  onChangeText={(value) => (this.setFormField = {name: value})}
                />
              </View>

              <View style={[styles.formControl]}>
                <Paragraph style={styles.formLabel}>
                  Vehicle Condition
                </Paragraph>
                <Picker
                  selectedValue={this.formDetails.vehicleContition}
                  itemStyle={styles.selectOption}
                  style={styles.formSelect}
                  onValueChange={(itemValue, itemIndex) =>
                    (this.setFormDetailsField = {vehicleContition: itemValue})
                  }>
                  {vehicleConditions.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>

              <View style={[styles.formControl]}>
                <Paragraph style={styles.formLabel}>Current Activity</Paragraph>
                <Picker
                  selectedValue={this.formDetails.vehicleActivity}
                  itemStyle={styles.selectOption}
                  style={styles.formSelect}
                  onValueChange={(itemValue, itemIndex) =>
                    (this.setFormDetailsField = {vehicleActivity: itemValue})
                  }>
                  {vehicleActivities.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>

              <View style={styles.formControl}>
                <Paragraph style={styles.formLabel}>
                  Vehicle Identifier
                </Paragraph>
                <ToggleButton.Row
                  style={styles.toggleButtonRow}
                  onValueChange={(value) =>
                    (this.setFormDetailsField = {vehicleIdentifier: value})
                  }
                  value={this.formDetails.vehicleIdentifier ?? ''}>
                  {vehicleIdentifiers.map((item, key) => (
                    <ToggleButton
                      key={key}
                      style={[
                        styles.toggleButton,
                        this.formDetails.vehicleIdentifier == item.value
                          ? styles.toggleButtonActive
                          : null,
                      ]}
                      icon={() => (
                        <Caption style={styles.formLabel}>{item.label}</Caption>
                      )}
                      value={item.value}
                    />
                  ))}
                </ToggleButton.Row>
                <TextInput
                  label={
                    this.vehicleIdentifierLabel ?? 'Specify the indentifier'
                  }
                  value={this.formDetails.vehicleIdentifierVal ?? ''}
                  onChangeText={(value) =>
                    (this.setFormDetailsField = {vehicleIdentifierVal: value})
                  }
                />
              </View>

              <View style={styles.formControl}>
                <Paragraph style={styles.formLabel}>Reference number</Paragraph>
                <TextInput
                  label="Reference number"
                  disabled={true}
                  value={this.formDetails.vehicleReferenceNumber ?? ''}
                  onChangeText={(value) => (this.setFormDetailsField = {value})}
                />
              </View>

              <View style={[styles.formControl]}>
                <Paragraph style={styles.formLabel}>
                  Vehicle Cleanliness
                </Paragraph>
                <Picker
                  selectedValue={this.formDetails.vehicleCleanliness ?? ''}
                  itemStyle={styles.selectOption}
                  style={styles.formSelect}
                  onValueChange={(itemValue, itemIndex) =>
                    (this.setFormField = {vehicleCleanliness: itemValue})
                  }>
                  {vehicleCleanlinesses.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>
              {
                <PreviewGrid
                  ref={(ref) => {
                    this.previewGridRef = ref;
                  }}
                  title={this.form.name}
                  onImageListItemTap={(index: number) => {
                    this.setState({
                      listImageIndex: index,
                      annotationCanvasModal: true,
                    });
                  }}
                  images={this.form.images}></PreviewGrid>
              }

              <View style={{paddingTop: 10}}>
                <Caption style={[styles.paragraph, styles.caption]}>
                  {'Long press to capture images in rafale mode !'}
                </Caption>
                <Caption style={[styles.paragraph, styles.caption]}>
                  {'Your task will be managed in the background :)'}
                </Caption>
              </View>
              <View style={[styles.formControl, styles.formSubmit]}>
                <Button
                  style={styles.formSubmitButton}
                  color={theme.colors.surface}
                  icon={() => (
                    <Icon
                      name="folder-plus"
                      size={20}
                      color={theme.colors.dark}></Icon>
                  )}
                  mode="contained"
                  onPress={this._handleOnSubmit}>
                  Save and continue
                </Button>
              </View>
            </View>
            {showFAB && !scrolling ? this._renderCameraButton() : null}
          </ScrollView>

          <Modal
            style={styles.annotationCanvasModal}
            visible={annotationCanvasModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() =>
              this.setState({annotationCanvasModal: false})
            }>
            {this.__renderAnnotationCanvas()}
          </Modal>
        </Portal.Host>
      </SafeAreaView>
    );
  }
}
