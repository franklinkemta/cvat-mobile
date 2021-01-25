import React from 'react';
import {Image, Modal, ScrollView, View} from 'react-native';
import {
  useTheme,
  Paragraph,
  Caption,
  TextInput,
  Button,
  ToggleButton,
  Text,
  Appbar,
  TouchableRipple,
  Portal,
} from 'react-native-paper';

import {Picker} from '@react-native-picker/picker';
// import our custom preview grid package
import PreviewGrid from 'react-native-preview-images';

import ImageViewer from 'react-native-image-zoom-viewer';

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
  imgViewModal?: boolean;
}

export class TaskCreate extends React.Component<
  TaskCreateProps,
  TaskFormState
> {
  state = {
    showFAB: true,
    scrolling: false,
    scrollIsTop: true,
    listImageIndex: 0,
    imgViewModal: false,
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
    images: [],
  };

  constructor(props: TaskCreateProps) {
    super(props);
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
    const takenPhotos: CameraImage[] = routeParams?.takenPhotos;

    if (takenPhotos?.length) {
      console.log('taken photos', takenPhotos.length);
      takenPhotos.forEach(this.handleTakenPhoto);
      this.props.navigation.setParams({takenPhotos: undefined});
      this.setState({showFAB: true}); // show fab
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

  setImgViewModal = (visible: boolean) => {
    this.setState({imgViewModal: visible});
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

    await saveFileToFs(
      takenPhoto.base64,
      'CAT_' + String(Math.random()),
      FS_PATHS.TASK_IMAGES,
    );
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

  // Render the grid image gallery under the PreviewGrid on ImageList item press
  _renderImagesGallery = (images: any[], listImageIndex: number) => (
    <ImageViewer
      imageUrls={images}
      index={listImageIndex}
      renderIndicator={() => <></>}
      renderHeader={this._galleryHeader}
      enableSwipeDown={false}
      saveToLocalByLongPress={false}
      useNativeDriver={true}
    />
  );

  _galleryTitle = (currentIndex: number | undefined): any => {
    const itemsCount: number = this.form.images.length;
    const index: number = currentIndex != undefined ? currentIndex + 1 : 0;
    return `${index}/${itemsCount}`;
  };

  _galleryHeader = (currentIndex: number | undefined) => {
    // format index to display (A/B)

    return (
      <Appbar theme={theme} style={styles.galleryHeader}>
        <Appbar.BackAction onPress={() => this.setImgViewModal(false)} />
        <Appbar.Content
          title={this._galleryTitle(currentIndex)}
          subtitle="Tap + to annotate the image"
        />
        <Appbar.Action icon="plus" size={30} onPress={() => {}} />
      </Appbar>
    );
  };

  _galleryFooter = (currentIndex: number | undefined) => {
    // format index to display (A/B)

    return (
      <Appbar theme={theme} style={styles.galleryHeader}>
        <Appbar.BackAction onPress={() => this.setImgViewModal(false)} />
        <Appbar.Content
          title={this._galleryTitle(currentIndex)}
          subtitle="Tap + to annotate the image"
        />
        <Appbar.Action icon="plus" size={30} onPress={() => {}} />
      </Appbar>
    );
  };

  render() {
    const {imgViewModal, listImageIndex} = this.state;

    return (
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
              <Paragraph style={styles.formLabel}>Vehicle Condition</Paragraph>
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
              <Paragraph style={styles.formLabel}>Vehicle Identifier</Paragraph>
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
                label={this.vehicleIdentifierLabel ?? 'Specify the indentifier'}
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
                title={this.form.name}
                onImageListItemTap={(index: number) => {
                  this.setState({listImageIndex: index, imgViewModal: true});
                }}
                images={this.form.images}></PreviewGrid>
            }

            <View style={styles.modalView}>
              <Modal
                visible={imgViewModal}
                transparent={false}
                animationType="fade"
                onRequestClose={() => this.setState({imgViewModal: false})}>
                {this._renderImagesGallery(this.form.images, listImageIndex)}
              </Modal>
            </View>
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
        </ScrollView>
        {this.state.showFAB && !this.state.scrolling
          ? this._renderCameraButton()
          : null}
      </Portal.Host>
    );
  }
}
