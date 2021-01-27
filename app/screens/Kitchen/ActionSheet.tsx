import React, {createRef} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

const actionSheetRef: any = createRef();

export const Kitchen = () => {
  let actionSheet;

  return (
    <View
      style={{
        justifyContent: 'center',
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => {
          actionSheetRef.current?.setModalVisible();
        }}>
        <Text>Open ActionSheet</Text>
      </TouchableOpacity>

      <ActionSheet ref={actionSheetRef}>
        <View>
          <Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>
        </View>
      </ActionSheet>
    </View>
  );
};
