import * as React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {Appbar} from 'react-native-paper';
import PreviewGrid from 'react-native-preview-images';
import Animated from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSheet from 'reanimated-bottom-sheet';
import {Canvas} from '../../components/Canvas';
import {theme} from '/theme';

export const AnnotationView = (props: any) => {
  const {navigation, route} = props;
  const {selectedImage, previewGridRef} = route.params;
  const sheetRef = React.useRef<BottomSheet>(null);
  const previewGrid = React.useRef<PreviewGrid>(previewGridRef).current;
  // console.log(selectedImage.metas);
  previewGrid?.setState({modalVisible: false});

  const closeAnnotationView = () => {
    navigation.goBack();
    previewGrid?.setState({modalVisible: true});
  };

  const renderHeader = () => (
    <Appbar
      theme={theme}
      dark={true}
      style={{
        backgroundColor: theme.colors.transparent,
        shadowColor: theme.colors.transparent,
      }}>
      <Appbar.Content
        titleStyle={{
          textAlign: 'justify',
          fontWeight: 'normal',
          color: theme.colors.surface,
        }}
        title="Annotate the image"></Appbar.Content>
      <Appbar.Action icon="check" onPress={closeAnnotationView} />
    </Appbar>
  );

  // previewGrid

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.dark}}>
      {renderHeader()}
      <Canvas images={[]} currentIndex={0} />
    </SafeAreaView>
  );
};
