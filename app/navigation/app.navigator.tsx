import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {HomeTabsNavigator} from '/navigation/homeTabs.navigator';
import {DrawerContent} from '/components/Drawer';
import {AppRoutes} from './routes';
import {Kitchen} from '/screens';

export type AppNavigatorParams = {
  // [AppRoutes.AUTH]: undefined;
  // [AppRoutes.HOME]: undefined;
};

// Init the drawer
const Drawer = createDrawerNavigator();

export const AppNavigator = () => {
  return (
    <Drawer.Navigator
      hideStatusBar={false}
      drawerType="slide"
      lazy={true}
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerPosition="right"
      initialRouteName={AppRoutes.HOME}>
      <Drawer.Screen name={AppRoutes.HOME} component={HomeTabsNavigator} />
      <Drawer.Screen name={AppRoutes.KITCHEN} component={Kitchen} />
    </Drawer.Navigator>
  );
};
