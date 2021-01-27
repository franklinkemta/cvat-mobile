import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {TouchableRipple, useTheme} from 'react-native-paper';

import {ParallaxImage} from 'react-native-snap-carousel';

import styles from './styles';

function getItemTitle(metas: any, index: number) {
  if (typeof metas == 'string') return metas;
  else return metas.name ?? index;
}

export const CarouselItem = (props: CarouselItemProps): React.ReactElement => {
  const theme = useTheme();
  const {url, metas, index, parallaxProps} = props;
  return (
    <TouchableRipple
      rippleColor={theme.colors.ripple}
      onPress={() => (props.onTap ? props.onTap(index) : undefined)}>
      <View style={{...props.itemStyles}}>
        <ParallaxImage
          source={{uri: url}}
          containerStyle={styles.imageContainer}
          style={styles.image}
          showSpinner={true}
          spinnerColor="dodgerblue"
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <Text style={styles.title} numberOfLines={2}>
          {getItemTitle(metas, index)}
        </Text>
      </View>
    </TouchableRipple>
  );
};

export default CarouselItem;
