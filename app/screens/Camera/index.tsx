import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, BackHandler} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

// import the react native camera module
import {RNCamera} from 'react-native-camera';
// import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
// import {getMessage} from '/services/translation';

import styles from './styles';

// Todo: Move this to app global config
const MAX_CAMERA_PHOTOS_DEFAULT = 100;
// Learn more at https://react-native-camera.github.io/react-native-camera/docs/rncamera#takepictureasync-options-promise
const defaultCameraOptions = {
  // Camera config
  base64: true,
  fixorientation: true,
  quality: 1, // 0.95,
  width: 1920,
  captureAudio: false,
  // imageType: 'png', // 'jpg',
  doNotSave: true,
  useNativeZoom: true,
  pauseAfterCapture: true, // set this option to false if you plan to take a series of photo in the same cameraPreviewLayer
  // path: 'camera_raw.png',
};

type CameraProps = {
  navigation: any;
  route: any;
};

type CameraState = {
  count: number;
  takenPhotos: CameraImage[]; // if rafaleMode is set to rafale
};

export class Camera extends PureComponent<CameraProps, CameraState> {
  camera: any;

  constructor(props: CameraProps) {
    super(props);
    const {route} = props;
    this.state = {count: +route.params?.currentImagesCount, takenPhotos: []};
  }

  componentDidMount() {
    const {navigation, route} = this.props;
    // const goBack = () => navigation.pop();
    const {currentImagesCount} = this.props.route.params;
    this.setState({count: currentImagesCount});
    BackHandler.addEventListener('hardwareBackPress', this.backWithTakenPhotos);
  }

  componentWillUnmount() {
    try {
      // prevent the native hardware back press
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.backWithTakenPhotos,
      );
    } catch (e) {
      this.debug(e.message);
    }
  }

  // return takenPhotos back to the CreateTask view
  backWithTakenPhotos = () => {
    console.log('Closing camera...');
    const {route, navigation} = this.props;
    navigation.navigate(route.params.previousScreen, {
      takenPhotos: this.state.takenPhotos,
    }); // Note: use navigation.navigate('previous_screen_name') instead and check the data with component did update
    return true;
  };

  // get if we are in rafale mode
  get isRafaleMode() {
    return this.props.route.params.rafaleMode == true;
  }

  get isMaxCount() {
    const {maxNumberOfPhotos} = this.props.route.params;
    const maxPhotos: number = maxNumberOfPhotos
      ? maxNumberOfPhotos
      : MAX_CAMERA_PHOTOS_DEFAULT;
    // console.log('MaxCount, Count, Count >= MaxCount ', maxPhotos, this.state.count, this.state.count < maxPhotos);
    return this.state.count >= maxPhotos;
  }

  get showCount() {
    return this.props.route.params.showCountBtn;
  }

  // takePicture, send the result back or wait all takenPhotos
  takePicture = async () => {
    if (this.camera) {
      const {route, navigation} = this.props;
      const {cameraOptions} = route.params;

      if (!this.isMaxCount) {
        // Handle Promise Rejection Errors, expecially errors when camera button is taped accidently more than once
        try {
          this.debug(
            `Taking picture with ${
              cameraOptions ? 'custom' : 'default'
            } cameraOptions.`,
          );
          const takenPhoto = await this.camera.takePictureAsync(
            // if cameraOptions were set in the props we override the default options
            cameraOptions
              ? {...defaultCameraOptions, ...cameraOptions}
              : defaultCameraOptions,
          ); // config camera option based of the props values or set the default camera options
          this.setState((previousState) => ({count: previousState?.count + 1}));
          // Send the taken photo data back to the caller view

          this.setState({takenPhotos: [...this.state.takenPhotos, takenPhoto]});
          if (this.isRafaleMode == false) return this.backWithTakenPhotos();
        } catch (err) {
          return this.debug(err); // PromiseRejectionError: failed to fetch
        }
      } else {
        this.debug('Max number of photos taken');
        return this.backWithTakenPhotos();
      }
    }
  };

  /*
  // send the rafale back to the caller
  sendRafaleBack = (takenPhoto: CameraImage) => {
    const callback = this.props.route.params.rafaleMode.callback;
    callback(takenPhoto);
  };*/

  _renderCount(countText: string) {
    return (
      <View style={styles.circle}>
        <Text style={styles.count}>{countText}</Text>
      </View>
    );
  }

  _renderCloseButton() {
    return (
      <TouchableOpacity onPress={this.backWithTakenPhotos} style={styles.close}>
        <Text style={styles.closeIcon}>&#10132;</Text>
      </TouchableOpacity>
    );
  }

  debug(errMsg: string) {
    // check if we should display Toast or not
    const {route} = this.props;
    const isDebugMode = route.params.debugMode ?? true;
    if (isDebugMode) {
      console.warn('DEBUG:', errMsg); // Log to console
    }
  }

  startDragBBOX(even: any) {
    console.log('drag start', even);
  }

  stopDragBBOX(even: any) {
    console.log('drag stop', even);
  }

  render() {
    const {state, isMaxCount, isRafaleMode} = this;

    const countText = isMaxCount ? ':)' : state.count.toString();
    return (
      <SafeAreaView style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            buttonNegative: 'Cancel',
            buttonPositive: 'Ok',
            message: 'We need your permission to use your camera',
            title: 'Permission to use camera',
          }}
          captureAudio={false}
          useNativeZoom
        />
        <View style={styles.buttonContainer}>
          {this.showCount && this._renderCount(countText)}

          <TouchableOpacity
            disabled={isMaxCount}
            onPress={this.takePicture}
            style={[
              styles.capture,
              isMaxCount ? {borderColor: 'black'} : null,
            ]}>
            <View
              style={[
                styles.captureInner,
                isMaxCount ? {borderColor: 'transparent'} : null,
              ]}></View>
          </TouchableOpacity>
        </View>
        {isRafaleMode && this._renderCloseButton()}
        {/* 
        <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
          {this.renderSvg()}
        </View>*/}
      </SafeAreaView>
    );
  }
}
