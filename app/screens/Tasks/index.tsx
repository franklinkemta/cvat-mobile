import React from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Caption, Paragraph, useTheme} from 'react-native-paper';

import {CardItem} from '../../components/CardItem';

import {AppRoutes} from '/navigation/routes';

import {theme} from '/theme';

import AsyncStorage from '@react-native-async-storage/async-storage';

// todo implement store
// import {tasks as dummyTasks} from '/data';

// return the first image of the task images as preview image
const getPreviewImage = (images: any[]): BaseImage => {
  const index = Math.floor(Math.random() * Math.floor(images.length));
  // this return is wonderfull
  return images[index] as BaseImage;
};

// type TaskItemProps = React.ComponentProps<typeof CardItem>;

type TasksProps = CardItemProps & {
  navigation: any; // StackNavigationProp<StackNavigatorParamlist>;
  route: any;
};

type TasksState = {
  tasks: Tasks[];
  refreshing: boolean;
};

function keyExtractor(item: CardItemProps, index: number) {
  return item.id.toString();
}

function renderItem({item}: {item: CardItemProps}) {
  return <CardItem {...item} />;
}

function renderHeading() {
  return (
    <View style={styles.heading}>
      <Paragraph style={styles.paragraph}>{'My Tasks'}</Paragraph>
      <Caption style={[styles.paragraph, styles.caption]}>
        {'Tasks created or assigned to me'}
      </Caption>
    </View>
  );
}

export class Tasks extends React.PureComponent<TasksProps, TasksState> {
  // const theme = useTheme();

  state = {
    tasks: [],
    refreshing: false,
  };

  loadTasks = async () => {
    let storedTasks: Task[];

    console.log('Loading tasks from local storage');
    try {
      const storageValue = await AsyncStorage.getItem('@storedTasks');
      if (storageValue) {
        console.log('Storage tasks found');
        storedTasks = JSON.parse(storageValue) || [];
      } else {
        console.log('No storage tasks found');
        storedTasks = [];
      }
    } catch (error) {
      console.log('loading error', error);
      storedTasks = [];
    }

    // load tasks from storage
    console.log('Formating task list'); // dummyTasks.map
    const tasks = storedTasks.map((task: any) => ({
      ...task,
      image: getPreviewImage(task.images),
      imagesCount: task.images.length,
      resultsCount: task.results?.length,
      onPress: (id: string) => {
        // console.log('task id', id);
        this.props.navigation &&
          this.props.navigation.navigate(AppRoutes.TASK_DETAILS, {
            ...task, // send the task to result view by route.params
            // Todo Implement task details fetch from server
          });
      },
    }));
    this.setState({
      tasks: tasks,
    });
  };

  // Pull to refresh
  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadTasks()
      .then(() => {
        this.setState({refreshing: false});
      })
      .catch((error: any) => {
        console.log('loading tasks error', error);
        this.setState({refreshing: false});
      });
  };

  componentDidMount() {
    this.loadTasks();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          ListHeaderComponent={renderHeading}
          ListHeaderComponentStyle={{
            paddingHorizontal: theme.paddingXDefault,
          }}
          contentContainerStyle={{backgroundColor: theme.colors.background}}
          style={{backgroundColor: theme.colors.background}}
          data={this.state.tasks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={() => (
            <View style={{height: StyleSheet.hairlineWidth}} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    paddingVertical: 30,
    borderBottomWidth: theme.borderDefault, // 0.3,
    borderBottomColor: theme.colors.primary, // 'lightgrey',
  },
  paragraph: {
    fontWeight: 'bold',
    fontSize: 15,
    justifyContent: 'center',
    textAlign: 'center',
  },
  caption: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
});
