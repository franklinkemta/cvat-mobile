import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Caption, Paragraph, useTheme} from 'react-native-paper';

import {CardItem} from '../../components/CardItem';

import {AppRoutes} from '/navigation/routes';

import {theme} from '/theme';

// todo implement store
import {tasks as dummyTasks} from '/data';

// return the first image of the task images as preview image
const getRandomPreviewImage = (images: any[]): BaseImage => {
  const index = Math.floor(Math.random() * Math.floor(images.length));
  // this return is wonderfull
  return images[index] as BaseImage;
};

// type TaskItemProps = React.ComponentProps<typeof CardItem>;

type Props = CardItemProps & {
  navigation: any; // StackNavigationProp<StackNavigatorParamlist>;
  route: any;
};

function keyExtractor(item: CardItemProps) {
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

export const Tasks = (props: Props): React.ReactElement => {
  const theme = useTheme();

  const data: any = dummyTasks.map((task) => ({
    ...task,
    image: getRandomPreviewImage(task.images),
    imagesCount: task.images.length,
    resultsCount: task.results?.length,
    onPress: (id: string) => {
      // console.log('task id', id);
      props.navigation &&
        props.navigation.navigate(AppRoutes.TASK_DETAILS, {
          ...task, // send the task to result view by route.params
          // Todo Implement task details fetch from server
        });
    },
  }));

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeading}
        ListHeaderComponentStyle={{
          paddingHorizontal: theme.paddingXDefault,
        }}
        contentContainerStyle={{backgroundColor: theme.colors.background}}
        style={{backgroundColor: theme.colors.background}}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => (
          <View style={{height: StyleSheet.hairlineWidth}} />
        )}
      />
    </SafeAreaView>
  );
};

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
