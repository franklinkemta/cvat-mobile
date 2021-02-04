import React, {createRef} from 'react';
import {ScrollView, View} from 'react-native';

import {
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

import AsyncStorage from '@react-native-async-storage/async-storage';

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
  idFromUuid,
  formatImageSource,
  uriFromBase64,
  saveFileToFs,
  readFileFromFs,
  FS_PATHS,
  alertMessage,
} from '/utils';

// todo implement store
import {
  vehicleConditions,
  vehicleActivities,
  vehicleCleanlinesses,
  vehicleIdentifiers,
  paletteGroups,
  images,
} from '/data';
import {SafeAreaView} from 'react-native-safe-area-context';

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
  loading?: boolean;
}

export class TaskCreate extends React.Component<
  TaskCreateProps,
  TaskFormState
> {
  previewGridRef = createRef<PreviewGrid>();

  state = {
    showFAB: true,
    scrolling: false,
    loading: false,
    scrollIsTop: true,
    listImageIndex: 0,
    annotationCanvasModal: false,
    name: '',
    details: {
      vehicleContition: undefined,
      vehicleActivity: undefined,
      vehicleIdentifier: undefined,
      vehicleIdentifierVal: undefined,
      vehicleReferenceNumber: undefined,
      vehicleCleanliness: undefined,
    },
    images: [],
  };

  constructor(props: TaskCreateProps) {
    super(props);
    this.previewGridRef = createRef<PreviewGrid>();
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
    // console.log('taken photos', takenPhotos.length);

      this.props.navigation.setParams({takenPhotos: undefined});
      this.setState({showFAB: true}); // show fab

      takenPhotos.forEach(this.handleTakenPhoto);
    }

    // check if the form image was updates
    if (routeParams?.updatedImages != undefined) {
      const updatedImages: TaskImage[] = routeParams.updatedImages;
      if (updatedImages.length) {
        // images annotations was saved by the user
        this.handleAnnotatedImages(updatedImages);
      } else {
        // images annotation was cancelled by the user
        this.handleAnnotationCancel();
      }
      // prevent from updating again
      this.props.navigation.setParams({updatedImages: undefined});
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

  get vehicleIdentifierLabel() {
    // return the current selected vehicle identifier label
    
    const items = vehicleIdentifiers.filter(
      (item) => item.value == this.formDetails.vehicleIdentifier,
    );
    return items.length ? items[0].label : undefined;
    
    // return this.formDetails.vehicleIdentifier
  }

  get headingTitle() {
    return this.state.name ?? '';
  }

  // reset form fieds
  isFormValid = (): boolean => {
  // console.log('Validating form data');
    const form = this.form;
    const formDetails = this.formDetails;
    if (!form.name) {
      alertMessage('Invalid task name', 'Please enter a name for the task');
      return false;
    }
    if (!formDetails.vehicleContition) {
      alertMessage(
        'Invalid vehicle contition',
        'Please precise the vehicle condition',
      );
      return false;
    }
    if (!formDetails.vehicleActivity) {
      alertMessage(
        'Invalid vehicle activity',
        'Please precise the current activity',
      );
      return false;
    }
    if (!formDetails.vehicleIdentifier) {
      alertMessage(
        'Invalid vehicle identifier',
        'Please select the vehicle identifier',
      );
      return false;
    }
    if (!formDetails.vehicleIdentifierVal) {
      alertMessage(
        'Invalid vehicle identifier value',
        'Please enter the vehicle identifier value',
      );
      return false;
    }
    if (!formDetails.vehicleReferenceNumber) {
      alertMessage(
        'Invalid vehicle reference number',
        'Please set a reference number',
      );
      return false;
    }
    if (!form.images.length) {
      alertMessage(
        'Photos are required',
        'At least one photo is required for creating a new the task, Please take photos from the camera',
        [
          {
            text: 'Add photos',
            onPress: this.openCameraRafale,
            // style: ' '
          },
        ],
      );
      return false;
    }
    return true;
  };

  // reset form fieds
  clearForm = () => {
  // console.log('Clearing form data');
    this.setState({
      listImageIndex: 0,
      name: '',
      images: [],
      details: {
        vehicleContition: undefined,
        vehicleActivity: undefined,
        vehicleIdentifier: undefined,
        vehicleIdentifierVal: undefined,
        vehicleCleanliness: undefined,
        vehicleReferenceNumber: idFromDateAndPrefix(), // create a new vehicle reference number
      },
    });
  };

  // open camera view to take photos snap, each taken photo will be returned by a callback
  openCameraDefault = () => {
    const {navigation} = this.props;
    navigation.navigate(AppRoutes.KITCHEN);

    navigation.navigate(AppRoutes.CAMERA, {
      debugMode: DEBUG_MODE,
      showCountBtn: false,
      maxNumberOfPhotos: MAX_TASK_PHOTOS_DEFAULT,
      rafaleMode: false, // serialize the callback
      cameraOptions: {
        // inner camera module options
        base64: true,
        width: 1920, // the base resolution, that we will use for our canvas
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
    navigation.navigate(AppRoutes.CAMERA, {
      debugMode: DEBUG_MODE, // show debug only on rafale mode for now, because this mode is unsafe
      showCountBtn: true,
      maxNumberOfPhotos: MAX_TASK_PHOTOS_DEFAULT,
      rafaleMode: true, // serialize the callback
      cameraOptions: {
        // inner camera module options
        base64: true,
        width: 1920, // the base resolution, that we will use for our canvas
        quality: 0.2, // take low quality on rafales
        doNotSave: true,
        pauseAfterCapture: false,
      }, // for dev only
      currentImagesCount: this.form.images.length, // check about lodash _size  vs default Array.length
      previousScreen: AppRoutes.TASK_CREATE, // navigate back to previousScreen with the takenImage data as param when a photo is taken
    });
  };

  // load the selected image in the imgViewGallery to the annotation canvas
  openAnnotationCanvas = (index: number) => {
    this.setState({
      listImageIndex: index,
    });
    const {navigation} = this.props;

    // hide the previewGrid
    this.previewGridRef.current?.setState({modalVisible: false});

    navigation.navigate(AppRoutes.ANNOTATION_CANVAS, {
      images: this.state.images,
      initialIndex: this.state.listImageIndex,
      paletteGroups: paletteGroups,
      paletteTitle: 'Select a damage marker',
      previousScreen: AppRoutes.TASK_CREATE,
    });
  };

  handleAnnotationCancel = () => {
  // console.log('Annotation cancelled !');
    this.previewGridRef.current?.setState({modalVisible: true});
  };

  handleAnnotatedImages = (updatedImages: TaskImage[]) => {
    // console.log('Finished annotating the images');
    // this.previewGridRef.current?.setState({modalVisible: true});
    this.setState({images: updatedImages});
    alertMessage('Photos updated !', 'Annotated  photos updated sucessfuly');
  };

  formatTakenPhoto = (takenPhoto: CameraImage): TaskImage => {
    // format takenPhoto to a Task image format and add to the task form.images[] in the state
    const takenPhotoIndex: number = this.form.images.length + 1;
    // console.log('TakenPhoto number', takenPhotoIndex);
    // As we used base64 option to true, we need to provid a new uri from base64 to other to display our image properly in the PreviewGrid
    const uri = uriFromBase64(String(takenPhoto.base64), 'image/png'); // 'data:image/png;base64,' + takenPhoto.base64; // Todo: check what we be better, png or jpeg
    return formatImageSource({
      ...takenPhoto, // formatImgSourceFromTakenPhoto(takenPhoto), // formatImgSourceFromTakenPhoto(takenPhoto)
      name: `Photo ${takenPhotoIndex}`, // Will be updated on submit to add the taken timestamp and the ID of the task or referenceNumber to prefix the name of the image
      annotations: [], // set the default annotations to [], Todo, call a predict API to help user by preloading annotations.
      uri: uri,
    }) as TaskImage;
  };

  // the callback that handle the taken camera photos snap
  handleTakenPhoto = (takenPhoto: CameraImage) => {
    const formatedTakenPhoto = this.formatTakenPhoto(takenPhoto);

    /* 
    console.log(
      'Taken picture Width x Height',
      formatedTakenPhoto.width,
      formatedTakenPhoto.height,
    );
    */

    this.setState((prevState) => ({
      images: [...(prevState.images ?? []), formatedTakenPhoto],
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
  _handleOnSubmit = async () => {
    // compose the task from form fields and dispatch to actions
    // validate the form first
    if (!this.state.loading) {
      if (this.isFormValid()) {
        this.setState({loading: true});
        // id: idFromUuid(), // Generate unique ID for the task
        // Todo: Get the current user
        const createdTask: Task = {
          ...this.form,
          id: idFromUuid(),
          author: {
            id: '0',
            name: 'You', //
          },
          completed: false,
          createDate: new Date().toUTCString(),
          updateDate: new Date().toUTCString(),
        };
        try {
          // get the stored tasks list // Todo: Store on the server
          const storageValue = await AsyncStorage.getItem('@storedTasks');
          let storedTasks: Task[];
          if (storageValue) {
          // console.log('Storage tasks found');
            storedTasks = JSON.parse(storageValue);
          } else {
          // console.log('No storage tasks found');
            storedTasks = [];
          }

          const jsonValueOfStoredTasks = JSON.stringify([
            createdTask,
            ...storedTasks,
          ]);
          // update the storage // adding the new task
          await AsyncStorage.setItem('@storedTasks', jsonValueOfStoredTasks);
          alertMessage(
            'Task created',
            'Sucessfuly added the task:  ' + createdTask.name,
          );

          this.clearForm(); // clear the form
        } catch (error) {
          // saving error
        // console.warn('Task save failed', error);
        }
        this.setState({loading: false});
      } else console.log('Form not valid');
    } else {
    // console.log('Loading please wait');
    }
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
    this &&
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

  render() {
    const {listImageIndex, images, scrolling, showFAB} = this.state;
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
                    <Picker.Item
                      key={'-1'}
                      label={'Select an option'}
                      value={undefined}
                    />
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
                    <Picker.Item
                    key={'-1'}
                    label={'Select an option'}
                    value={undefined}
                  />
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
                  onValueChange={(itemValue) =>
                    { if (itemValue) this.setFormDetailsField = {vehicleIdentifier: itemValue}}
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
                  onChangeText={(itemValue) =>
                    (this.setFormDetailsField = {
                      vehicleIdentifierVal: itemValue,
                    })
                  }
                />
              </View>

              <View style={styles.formControl}>
                <Paragraph style={styles.formLabel}>Reference number</Paragraph>
                <TextInput
                  label="Reference number"
                  disabled={true}
                  value={this.formDetails.vehicleReferenceNumber ?? ''}
                  onChangeText={(value) =>
                    (this.setFormDetailsField = {vehicleReferenceNumber: value})
                  }
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
                     <Picker.Item
                      key={'-1'}
                      label={'Select an option'}
                      value={undefined}
                    />
                  {vehicleCleanlinesses.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>
              <PreviewGrid
                ref={this.previewGridRef}
                images={images}
                title={'Taken photos: select to annotate'}
                onImageListItemTap={this.openAnnotationCanvas}
              />

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
                  loading={this.state.loading}
                  icon={() => (
                    <Icon
                      name="save"
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
        </Portal.Host>
      </SafeAreaView>
    );
  }
}
