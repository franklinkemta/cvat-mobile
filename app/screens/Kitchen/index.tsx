import * as React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {AppRoutes} from '/navigation/routes';
import {alertMessage} from '/utils';

export class Kitchen extends React.Component<any> {
  // console.log('Opening kitchen');
  sheetRef = React.createRef<BottomSheet>();

  renderContent = () => (
    <View
      style={{
        backgroundColor: 'red',
        padding: 16,
        height: 450,
      }}>
      <Text>Swipe down to close</Text>
    </View>
  );

  componentDidMount() {
    if (this.props.route?.name == AppRoutes.KITCHEN) {
      alertMessage(
        'Welcome to the kitchen',
        'Currently testing some features in this version of the app',
      );
    }
  }

  render() {
    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: 'papayawhip',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            title="Open Bottom Sheet"
            onPress={() => this.sheetRef.current?.snapTo(0)}
          />
        </View>
        <BottomSheet
          ref={this.sheetRef}
          snapPoints={[450, 300, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
      </>
    );
  }
}
