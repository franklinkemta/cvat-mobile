import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import {Tasks, TaskDetails} from '/screens';

import {AppRoutes} from '/navigation/routes';

// import header
import {Header} from '../../../components/Header';

const Stack = createStackNavigator();

export const TasksStackTab = () => {
  return (
    <Stack.Navigator
      initialRouteName={AppRoutes.TASKS}
      headerMode="screen"
      screenOptions={{
        header: ({scene, previous, navigation}) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}>
      <Stack.Screen
        name={AppRoutes.TASKS}
        component={Tasks}
        options={({route}) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? AppRoutes.TASKS;
          return {headerTitle: routeName};
        }}
      />
      <Stack.Screen
        name={AppRoutes.TASK_DETAILS}
        component={TaskDetails}
        options={{headerTitle: 'Details'}}
      />
    </Stack.Navigator>
  );
};
