import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  Divider,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';

import AppLogo from '../AppLogo';

import styles from './styles';
import {theme} from '/theme';
import {AppRoutes} from '/navigation/routes';

enum appInfos {
  displayName = 'CAT Mobile',
  version = '1.0.0',
  tasks = 0,
  labels = 0,
}

const LabelsIcon = (color: any, size: any) => (
  <Icon name="clone" size={size} color={color} />
);
const SettingsIcon = (color: any, size: any) => (
  <Icon name="clone" size={size} color={color} />
);

export function DrawerContent(props: any) {
  const [devOptionsEnabled, setDevOptionsEnabled] = useState(false); // our place for cuisining the stuffs :)
  const {navigation}: any = props;
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.appInfoSection}>
          <Avatar.Image size={50} style={styles.logo} source={AppLogo} />
          <Title style={styles.title}>{appInfos.displayName}</Title>
          <Caption style={styles.caption}>v.{appInfos.version}</Caption>
          {devOptionsEnabled && (
            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  {appInfos.tasks}
                </Paragraph>
                <Caption style={styles.caption}>Tasks</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  {appInfos.labels}
                </Paragraph>
                <Caption style={styles.caption}>Labels</Caption>
              </View>
            </View>
          )}
        </View>
      </View>

      <Divider style={styles.divider} />

      <Drawer.Section style={styles.drawerSection}>
        {devOptionsEnabled && (
          <DrawerItem
            key={AppRoutes.HOME}
            focused
            activeBackgroundColor="transparent"
            activeTintColor="rgba(1, 87, 155, 1)"
            icon={({color, size}) => (
              <Icon name="square" size={size} color={color} />
            )}
            label="Home"
            onPress={() => {
              navigation.navigate(AppRoutes.HOME);
            }}
          />
        )}
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="sliders-h" size={size} color={color} />
          )}
          label="Preferences"
          inactiveTintColor="grey"
          onPress={() => {}}
        />
      </Drawer.Section>

      <Drawer.Section title="Preferences" style={styles.drawerSection}>
        <TouchableRipple
          onPress={() => {
            setDevOptionsEnabled(!devOptionsEnabled);
          }}>
          <View style={styles.preference}>
            <Text>Developper options</Text>
            <View pointerEvents="none">
              <Switch color={theme.colors.accent} value={devOptionsEnabled} />
            </View>
          </View>
        </TouchableRipple>
        {devOptionsEnabled && (
          <>
            <Divider style={styles.divider} />
            <DrawerItem
              key={AppRoutes.KITCHEN}
              icon={({color, size}) => (
                <Icon name="utensils" size={size} color={color} />
              )}
              label="Kitchen"
              activeTintColor="#f1c40f"
              inactiveTintColor="#37474f"
              onPress={() => {
                navigation.navigate(AppRoutes.KITCHEN);
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="list" size={size} color={color} />
              )}
              inactiveTintColor="grey"
              label="Labels list"
              onPress={() => {}}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="sign-in-alt" size={size} color={color} />
              )}
              label="Exit"
              onPress={() => {
                navigation.closeDrawer();
                if (devOptionsEnabled) {
                  navigation.navigate(AppRoutes.HOME);
                  setDevOptionsEnabled(false);
                }
              }}
            />
          </>
        )}
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}
