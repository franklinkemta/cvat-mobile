import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {TaskCreate, Camera} from '/screens';

import {AppRoutes} from '/navigation/routes';

// import header
import {Header} from '../../../components/Header';

const Stack = createStackNavigator();

export const TaskCreateStackTab = () => {
  return (
    <Stack.Navigator
      initialRouteName={AppRoutes.TASK_CREATE}
      headerMode="screen"
      screenOptions={{
        header: ({scene, previous, navigation}) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}>
      <Stack.Screen
        name={AppRoutes.TASK_CREATE}
        component={TaskCreate}
        options={{headerTitle: 'Create Task'}}
      />
      <Stack.Screen
        name={AppRoutes.CAMERA_VIEW}
        component={Camera}
        options={{headerTitle: 'Add photos to tasks'}}
      />
    </Stack.Navigator>
  );
};
