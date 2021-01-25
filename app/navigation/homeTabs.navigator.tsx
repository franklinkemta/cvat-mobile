import React, {useEffect, useState} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

// import vectors icons for tabs
import Icon from 'react-native-vector-icons/FontAwesome5';

import {TasksStackTab} from '../screens/Home/Tabs/tasksStack.tab';
import {TaskCreateStackTab} from '../screens/Home/Tabs/taskCreateStack.tab';

import {Tabs as HomeTabs, HomeTabsContext} from '/screens/Home/Tabs/tabs';

// Let define a type to be sure we received the navigation elements
type Props = {
  route: any;
  navigation: any;
  theme: any;
};

const Tab = createMaterialBottomTabNavigator();

export const HomeTabsNavigator = (props: any) => {
  const [routeName, setRouteName] = useState('');

  // todo take it from the state
  const theme = useTheme();

  useEffect(() => {
    const routeName =
      getFocusedRouteNameFromRoute(props.route) ?? HomeTabs.TASKS_STACK_TAB;
    // console.log(routeName, props.route);
    // update the current routeName when the componentUpdate
    setRouteName(routeName);
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <HomeTabsContext.Provider value={{routeName: routeName}}>
        <Tab.Navigator
          initialRouteName={HomeTabs.TASKS_STACK_TAB}
          shifting={true}
          sceneAnimationEnabled={false}
          barStyle={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderTopWidth: theme.borderThin, // 0.3,
            borderBottomWidth: theme.borderThin, // 0.3,
          }}
          inactiveColor={theme.colors.dark}
          activeColor={theme.colors.primary}>
          <Tab.Screen
            name={HomeTabs.TASKS_STACK_TAB}
            component={TasksStackTab}
            options={{
              tabBarLabel: 'Tasks',
              tabBarIcon: ({focused, color}) => (
                <Icon
                  name={focused ? 'clone' : 'copy'}
                  size={20}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name={HomeTabs.TASK_CREATE_STACK_TAB}
            component={TaskCreateStackTab}
            options={{
              tabBarLabel: 'Create Task',
              tabBarIcon: ({focused, color}) => (
                <Icon
                  name={focused ? 'pen-square' : 'edit'}
                  size={20}
                  color={color}
                />
              ),
            }}></Tab.Screen>
        </Tab.Navigator>
      </HomeTabsContext.Provider>
    </SafeAreaView>
  );
};
