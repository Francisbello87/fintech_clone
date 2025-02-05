import React from 'react';



import SortableList from './sortable-list';
import { View } from 'react-native';
import { MARGIN } from './config';
import Tile from './tile';

const tiles = [
  {
    id: 'spent',
  },
  {
    id: 'cashback',
  },
  {
    id: 'recent',
  },
  {
    id: 'cards',
  },
];

const WidgetList = () => {
  return (
    <View
      style={{
        paddingHorizontal: MARGIN,
        marginBottom: 80,
      }}>
      <SortableList
        editing={true}
        onDragEnd={(positions) => console.log(JSON.stringify(positions, null, 2))}>
        {[...tiles].map((tile, index) => (
          <Tile onLongPress={() => true} key={tile.id + '-' + index} id={tile.id} />
        ))}
      </SortableList>
    </View>
  );
};

export default WidgetList;