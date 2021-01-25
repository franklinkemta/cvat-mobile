import {range} from 'lodash';
import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {
  Surface,
  Caption,
  Text,
  TouchableRipple,
  useTheme,
  Paragraph,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';

// styles
import styles from './styles';

export const CardItem = (props: CardItemProps) => {
  const theme = useTheme();

  return (
    <Surface style={styles.container}>
      <TouchableRipple
        rippleColor={theme.colors.rippleColor}
        onPress={() => (props.onPress ? props.onPress(props.id) : undefined)}>
        <View style={styles.row}>
          <View style={styles.header}>
            <Icon
              name="dot-circle"
              style={{marginRight: 3}}
              size={16}
              color={theme.colors.dark}
            />
            <Paragraph style={styles.title}>{props.name}</Paragraph>
          </View>
          <View style={styles.header}>
            <Text style={[styles.author, {color: theme.colors.caption}]}>
              {props.author.name}
            </Text>

            <Text style={[styles.createDate, {color: theme.colors.caption}]}>
              {props.createDate}
            </Text>
          </View>

          <Image
            source={props.image}
            style={[
              styles.image,
              {
                borderColor: theme.colors.border,
                borderWidth: 0.3,
                backgroundColor: theme.colors.caption,
              },
            ]}
          />
          <View style={styles.bottomRow}>
            <TouchableOpacity
              onPress={() => {}}
              hitSlop={{top: 10, bottom: 10}}>
              <View style={styles.iconContainer}>
                <Icon name="images" size={15} color={theme.colors.primary} />
                <Caption style={styles.iconDescription}>
                  {props.imagesCount}
                </Caption>
              </View>
            </TouchableOpacity>
            {props.resultsCount ? (
              <TouchableOpacity
                onPress={() => {}}
                hitSlop={{top: 10, bottom: 10}}>
                <View style={styles.iconContainer}>
                  <Icon
                    name="exclamation-triangle"
                    size={15}
                    color={theme.colors.danger}
                  />
                  <Caption style={styles.iconDescription}>
                    {props.resultsCount}
                  </Caption>
                </View>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            {props.completed ? (
              <TouchableOpacity
                onPress={() => {}}
                hitSlop={{top: 10, bottom: 10}}>
                <View style={styles.iconContainer}>
                  <Icon name="check" size={15} color={theme.colors.success} />
                </View>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
};
