import React from 'react';
import {View} from 'react-native';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
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
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.appInfoSection}>
          <Avatar.Image size={50} style={styles.logo} source={AppLogo} />
          <Title style={styles.title}>{appInfos.displayName}</Title>
          <Caption style={styles.caption}>v.{appInfos.version}</Caption>
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
        </View>
      </View>

      <Divider style={styles.divider} />

      <Drawer.Section style={styles.drawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="square" size={size} color={color} />
          )}
          label="Labels"
          onPress={() => {}}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="sliders-h" size={size} color={color} />
          )}
          label="Preferences"
          onPress={() => {}}
        />
      </Drawer.Section>

      <Drawer.Section title="Developper options">
        <TouchableRipple onPress={() => {}}>
          <View style={styles.preference}>
            <Text>Production</Text>
            <View pointerEvents="none">
              <Switch value={true} color="grey" />
            </View>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={() => {}}>
          <View style={styles.preference}>
            <Text>Localhost</Text>
            <View pointerEvents="none">
              <Switch value={false} />
            </View>
          </View>
        </TouchableRipple>
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}
