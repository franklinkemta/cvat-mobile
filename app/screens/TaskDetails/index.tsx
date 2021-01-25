import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// import tabs
import {InfoTab} from './Tabs/info.tab';
import {ResultTab} from './Tabs/results.tab';

// Import tabs labels
import {Tabs as TaskTabs} from './Tabs/tabs';
import {useTheme} from 'react-native-paper';

// Let define a type to be sure we received the navigation elements
type Props = {
  route: any;
  navigation: any;
};

const Tab = createMaterialTopTabNavigator();

export const TaskDetails = (props: Props) => {
  const {route, navigation} = props;
  const theme = useTheme();
  // here we can get the task so we can share it with inner tabs
  const task: Task = route.params;

  return (
    <Tab.Navigator
      initialRouteName={TaskTabs.TASK_RESULTS_TAB}
      swipeEnabled={false}
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: theme.borderDefault,
        },
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.secondary,
      }}>
      <Tab.Screen
        name={TaskTabs.TASK_RESULTS_TAB}
        options={{tabBarLabel: 'Annotations'}}>
        {() => <ResultTab {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name={TaskTabs.TASK_INFO_TAB}
        options={{tabBarLabel: 'INFOS'}}>
        {() => <InfoTab {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
