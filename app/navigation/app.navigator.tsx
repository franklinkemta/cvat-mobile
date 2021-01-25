import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {HomeTabsNavigator} from '/navigation/homeTabs.navigator';
import {DrawerContent} from '/components/Drawer';
import {AppRoutes} from './routes';

export type AppNavigatorParams = {
  [AppRoutes.AUTH]: undefined;
  [AppRoutes.HOME]: undefined;
};

// Init the drawer
const Drawer = createDrawerNavigator();

export const AppNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={() => <DrawerContent />}
      drawerPosition="right">
      <Drawer.Screen name={AppRoutes.HOME} component={HomeTabsNavigator} />
    </Drawer.Navigator>
  );
};
