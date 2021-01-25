import React from 'react';
// import {TouchableOpacity} from 'react-native';
import {Appbar, Avatar, useTheme} from 'react-native-paper';

// Vector icons
import Icon from 'react-native-vector-icons/FontAwesome5';

import {AppRoutes} from '/navigation/routes';

import AppLogo from '/components/AppLogo';

function _renderOtherActions({scene, navigation}: any, theme: any) {
  // display app header actions depending off the focused screen
  switch (scene.route.name) {
    case AppRoutes.TASK_DETAILS:
      return (
        <Appbar.Action
          icon={() => (
            <Icon name="pen" color={theme.colors.secondary} size={20} />
          )}
          disabled={true}
          animated={false}
          onPress={() => {
            // Handle edit
          }}
        />
      );
    case AppRoutes.CAMERA_VIEW:
      return (
        <Appbar.Action
          icon={() => (
            <Icon name="images" color={theme.colors.secondary} size={20} />
          )}
          disabled={true}
          animated={false}
          onPress={() => {
            // Handle edit
          }}
        />
      );
    default:
      return null;
  }
}

function _renderDefaultHeader(
  {scene, previous, navigation}: any,
  title: any,
  theme: any,
) {
  return (
    <Appbar.Header theme={{colors: {primary: theme.colors.surface}}}>
      {previous ? (
        <Appbar.BackAction
          onPress={navigation.goBack}
          color={theme.colors.dark}
        />
      ) : (
        <Avatar.Image size={40} source={AppLogo} />
      )}

      <Appbar.Content
        title={previous ? title : 'CAT Mobile'}
        titleStyle={{
          fontWeight: 'bold',
        }}
        style={{
          alignItems: 'center',
        }}
      />
      {previous ? (
        _renderOtherActions({scene, navigation}, theme)
      ) : (
        <Appbar.Action
          icon={() => <Icon name="bars" size={25} />}
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      )}
    </Appbar.Header>
  );
}

export const Header = (props: any) => {
  const {scene, previous, navigation} = props;
  // Theme options
  const theme = useTheme();

  const {options} = scene.descriptor;

  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  const {name: routeName, params} = scene.route;

  switch (routeName) {
    case AppRoutes.CAMERA_VIEW:
      return null;
    default:
      return _renderDefaultHeader(props, title, theme);
  }
};
