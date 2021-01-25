import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ActivityIndicator, Divider, List} from 'react-native-paper';

import Orientation from 'react-native-orientation-locker';

// Import the ImageCarousel component
import {ImageCarousel} from '/components/ImagesCarousel';
import {theme} from '/theme';

// import utils
import {formatImagesSources} from '/utils';

// todo implement store
// import {taskImages} from '/data';
type ResultTabProps = {
  route: any;
  navigation?: any;
};
type ResultTabState = {
  taskImages: TaskImage[];
  annotations: ImageAnnotation[] | undefined;
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
    const task: Task = {...route.params};
    const images: TaskImage[] = task.images ?? []; // tasks

    // define the initial state
    this.state = {
      taskImages: images,
      annotations: undefined,
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
    if (!this.state.annotations) this.handleOnSnapToItem(0);
  }

  componentWillUnmount() {
    // unlock device orientation to portrait
    Orientation.unlockAllOrientations();
  }

  handleOnSnapToItem(listImageIndex: number) {
    // update listImageIndex
    // console.log('index', listImageIndex);

    // load and display the annotations corresponding to the current activeIndex
    const currentTaskImage: TaskImage = this.taskImages[listImageIndex];

    // console.log(currentTaskImage);
    // update the annotations list

    this.setState({
      annotations: currentTaskImage.annotations
        ? currentTaskImage.annotations
        : [],
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
    return this.state.taskImages;
  }

  get listExpanded() {
    return this.state.listExpanded;
  }

  set taskImages(taskImages: TaskImage[]) {
    this.setState({taskImages});
    console.error(taskImages);
  }
  set listExpanded(listExpanded: boolean) {
    this.setState({listExpanded});
  }

  render() {
    console.log('TaskImages', this.taskImages);
    return (
      <ScrollView style={styles.scrollview}>
        <ImageCarousel
          onSnapToItem={this.handleOnSnapToItem}
          images={formatImagesSources(
            this.taskImages.map((item) => item as BaseImage),
          )}
          layout="default"
        />
        <Divider style={styles.divider} />
        <View style={styles.listContainer}>
          {this.state.annotations && this.state.annotations.length ? (
            <List.Section
              title="Annotations on this Image"
              titleStyle={styles.listTitle}>
              {this.state.annotations.map((annotationItem, index) => (
                <List.Accordion
                  key={index}
                  style={styles.listAccordion}
                  title={annotationItem.customAnnotationTypeName}
                  left={(props) => (
                    <List.Icon {...props} icon="square" style={{width: 12}} />
                  )}>
                  {annotationItem.labels.map((label, jindex) => (
                    <List.Item
                      key={jindex}
                      title={label}
                      style={styles.listItem}
                    />
                  ))}
                </List.Accordion>
              ))}
            </List.Section>
          ) : (
            <ActivityIndicator
              hidesWhenStopped={true}
              style={styles.activityIndicator}
            />
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
  listAccordion: {
    borderTopWidth: theme.borderDefault,
    borderTopColor: theme.colors.border, // theme.colors.primary,
    borderBottomWidth: theme.borderDefault,
    borderBottomColor: theme.colors.primary, // theme.colors.primary,
  },
  listItem: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: theme.borderThin,
    borderBottomColor: theme.colors.border, // theme.colors.primary,
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
});
