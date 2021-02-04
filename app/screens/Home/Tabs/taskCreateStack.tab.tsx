import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {TaskCreate, Camera} from '/screens';

import {AppRoutes} from '/navigation/routes';

// import header
import {Header} from '../../../components/Header';
import {AnnotationCanvas} from '../../AnnotationCanvas';

const Stack = createStackNavigator();

export const TaskCreateStackTab = () => {
  return (
    <Stack.Navigator
      initialRouteName={AppRoutes.TASK_CREATE}
      headerMode="screen"
      screenOptions={{
        header: (props: any) => (
          <Header {...props} />
          /*
          header: ({scene, previous, navigation}: any) => (
          <Header
            scene={scene}
            previous={previous}
            navigation={navigation}
            {...props}
          />
          */
        ),
      }}>
      <Stack.Screen
        name={AppRoutes.TASK_CREATE}
        component={TaskCreate}
        options={{headerTitle: 'Create Task'}}
      />
      <Stack.Screen
        name={AppRoutes.CAMERA}
        component={Camera}
        options={{
          headerTitle: 'Add photos to tasks',
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name={AppRoutes.ANNOTATION_CANVAS}
        component={AnnotationCanvas}
        options={{
          headerTitle: 'Annotate the image',
          animationEnabled: true,
          cardShadowEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
