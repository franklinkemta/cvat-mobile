import React from 'react';
import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import {
  ActivityIndicator,
  Chip,
  Divider,
  List,
  Paragraph,
} from 'react-native-paper';

import Orientation from 'react-native-orientation-locker';

// Import the ImageCarousel component
import {ImageCarousel} from '/components/ImagesCarousel';
import {theme} from '/theme';

// import utils
import {formatImagesSources} from '/utils';
import {paletteGroups} from '/data';

// todo implement store
// import {taskImages} from '/data';
type ResultTabProps = {
  route: any;
  navigation?: any;
};
type ResultTabState = {
  task: Task;
  annotationsResults: any[];
  listExpanded: boolean;
};

// we are not typing props and state yet because we do not wait for data coming from a top component
export class ResultTab extends React.Component<ResultTabProps, ResultTabState> {
  // const task: TaskPropsType = route.params;

  // todo : type ResultTab props
  constructor(props: ResultTabProps) {
    super(props);

    // we may need to type the props if we want to provide a navigation from this component
    const {route, navigation} = props;
    // console.log('route', route.params);

    // bind callbacks to this
    this.handleOnSnapToItem = this.handleOnSnapToItem.bind(this);
    this.handleListItemPress = this.handleListItemPress.bind(this);

    // get the taskImages images from the route params sent by the TaskDetail parent
    //const task:
    //const images: TaskImage[] = task.images ?? []; // tasks

    // define the initial state
    this.state = {
      task: {...route.params},
      annotationsResults: [],
      listExpanded: false,
    };

    // get the initial device orientation
    const initial = Orientation.getInitialOrientation();
    console.info('Initial device orientation:', initial);
    console.info('Lock device orientation to portrait');
    Orientation.lockToPortrait();
    //Orientation.addOrientationListener(this._onOrientationDidChange);
  }

  _onOrientationDidChange = (orientation: string) => {
    console.log('Current device orientation:', orientation);
    if (orientation == 'LANDSCAPE-LEFT') {
      //do something with landscape left layout
    } else {
      //do something with portrait layout
    }
  };

  componentDidMount() {
    // load the annotations for the active item
    if (!this.state.annotationsResults.length) this.handleOnSnapToItem(0);
  }

  componentWillUnmount() {
    // unlock device orientation to portrait
    Orientation.unlockAllOrientations();
  }

  handleOnSnapToItem(listImageIndex: number) {
    // update listImageIndex
    // console.log('index', listImageIndex);

    // load and display the annotations corresponding to the current activeIndex
    const currentImage: TaskImage = this.taskImages[listImageIndex];

    // console.log(currentImage);
    // update the annotations list

    // console.log('TaskImages', this.taskImages);
    const annotations: any[] = currentImage.annotations || [];
    // console.log(annotations);
    const annotationsResults = paletteGroups.map((paletteGroup) => {
      const results = annotations.filter(
        (annotation: any) => annotation.paletteGroupId == paletteGroup.id,
      );
      // console.log(results.length);
      return {
        ...paletteGroup,
        labels: results,
      };
    });

    // console.log(annotationsResults);

    this.setState({
      annotationsResults: annotationsResults.filter(
        (result) => result.labels.length > 0,
      ), // Do not show empty category
    });
    // Todo : Test annotations before assigning to the state.annotations

    // console.log(this.state.annotations);
  }

  handleListItemPress() {
    // happen when accordion list change
    this.listExpanded = !this.listExpanded;
  }

  // some getters and setters that we want to override
  get taskImages() {
    return this.state.task.images as TaskImage[];
  }

  get listExpanded() {
    return this.state.listExpanded;
  }

  set listExpanded(listExpanded: boolean) {
    this.setState({listExpanded});
  }

  render() {
    const annotationsResults = this.state.annotationsResults;
    return (
      <ScrollView style={styles.scrollview}>
        <ImageCarousel
          onSnapToItem={this.handleOnSnapToItem}
          annotatedImages={formatImagesSources(
            this.taskImages.map((item) => item as BaseImage),
          )}
          layout="default"
        />
        <Divider style={styles.divider} />
        <Paragraph style={styles.annotationTitle}>
          Annotations on this Image
        </Paragraph>
        <View style={styles.listContainer}>
          {annotationsResults && annotationsResults.length ? (
            <View>
              {annotationsResults.map(
                (annotationsResult: any, index: number) => (
                  <View key={index} style={styles.annotationsResultContainer}>
                    <Paragraph style={styles.categoryName}>
                      {annotationsResult.categoryName}
                    </Paragraph>
                    <View style={styles.paletteGroupContent}>
                      {annotationsResult.labels.length > 0 &&
                        annotationsResult.labels.map(
                          (annotation: any, itemIndex: number) => (
                            <Chip
                              key={itemIndex}
                              mode={'flat'}
                              style={styles.annotationLabelItem}
                              theme={theme}
                              selectedColor={
                                annotationsResult.fallBackColor ??
                                theme.colors.primary
                              }
                              icon={annotationsResult.fallBackIcon ?? 'square'}>
                              {annotation.label.name}
                            </Chip>
                          ),
                        )}
                    </View>
                  </View>
                ),
              )}
            </View>
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.noAnnotationsText}>
                This photo does not have any annotation !
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollview: {flex: 1},
  listContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: theme.paddingXDefault,
  },
  categoryName: {
    borderBottomWidth: theme.borderDefault,
    borderBottomColor: theme.colors.primary, // theme.colors.primary,
  },
  listTitle: {
    color: theme.colors.dark,
    alignSelf: 'center',
  },
  activityIndicator: {
    marginTop: 20,
  },
  divider: {
    display: 'none',
    backgroundColor: 'lightgrey',
    marginVertical: 12,
    marginTop: 20,
  },
  noAnnotationsText: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  annotationLabelItem: {
    borderWidth: 0.2,
    marginEnd: 1,
    marginTop: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(55, 71, 79, 0.7)', // theme.colors.secondary,
  },
  annotationsResultContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  paletteGroupContent: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  annotationTitle: {
    flex: 1,
    paddingVertical: 5,
    textAlign: 'center',
  },
});
