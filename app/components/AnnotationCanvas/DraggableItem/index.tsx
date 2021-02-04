import React from 'react';
import {Circle, G, Line, Rect, Text} from 'react-native-svg';

const DraggableItem = (props: any) => {
  const {isFocused, draggableItem, onPressIn}: any = props;
  switch (draggableItem.svgForm) {
    case 'circle':
      return (
        <G
          onPressIn={onPressIn}
          onResponderRelease={() => {
            // setFocusedItem(undefined);
          }}>
          <Circle
            x={draggableItem.origin.x} // - 5 + '%'
            y={draggableItem.origin.y} // - 10 + '%'
            r={draggableItem.origin.width + '%'}
            stroke={draggableItem.color}
            strokeWidth={1}
            opacity={isFocused ? 0.6 : 1}
            fill={isFocused ? 'grey' : 'transparent'}></Circle>
          <Text
            x={draggableItem.origin.x - draggableItem.origin.width} //  - 5 + '%'
            y={draggableItem.origin.y - draggableItem.origin.height - 2} //  - 11 + '%'
            textAnchor="middle"
            fontWeight="normal"
            fontSize="6"
            fill={draggableItem.color}>
            {draggableItem.label?.name ?? String(draggableItem.label)}
          </Text>
        </G>
      );
    case 'line':
      return (
        <G
          onPressIn={onPressIn}
          onResponderRelease={() => {
            // setFocusedItem(undefined);
          }}>
          <Line
            x1={draggableItem.origin.x} // - 5 + '%'
            y1={draggableItem.origin.y} // - 10 + '%'
            x2={draggableItem.origin.x + draggableItem.origin.width + 20} // - 5 + '%'
            y2={draggableItem.origin.y} // - 10 + '%'
            stroke={draggableItem.color}
            strokeWidth={isFocused ? 8 : 6}
            opacity={isFocused ? 0.6 : 0.4}
            fill={isFocused ? 'black' : 'transparent'}></Line>
          <Text
            x={draggableItem.origin.x - 2} //  - 5 + '%'
            y={draggableItem.origin.y - 8} //  - 11 + '%'
            textAnchor="start"
            fontWeight="normal"
            fontSize="6"
            fill={draggableItem.color}>
            {draggableItem.label?.name ?? String(draggableItem.label)}
          </Text>
        </G>
      );
    default:
      return (
        <G
          onPressIn={onPressIn}
          onResponderRelease={() => {
            // setFocusedItem(undefined);
          }}>
          <Rect
            x={draggableItem.origin.x} // - 5 + '%'
            y={draggableItem.origin.y} // - 10 + '%'
            width={draggableItem.origin.width + '%'}
            height={draggableItem.origin.height + '%'}
            stroke={draggableItem.color}
            strokeWidth={1}
            opacity={isFocused ? 0.6 : 1}
            fill={isFocused ? 'grey' : 'transparent'}></Rect>
          <Text
            x={draggableItem.origin.x} //  - 5 + '%'
            y={draggableItem.origin.y - 2} //  - 11 + '%'
            textAnchor="start"
            fontWeight="normal"
            fontSize="6"
            fill={draggableItem.color}>
            {draggableItem.label?.name ?? String(draggableItem.label)}
          </Text>
        </G>
      );
  }
};

export default DraggableItem;
