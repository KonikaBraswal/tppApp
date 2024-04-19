import React from 'react';
import {View, FlatList, Image, StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {IconButton} from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth * 0.9;

const ImageCarousel = props => {
  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Image source={item} style={styles.image} />
        {props.data.images.length > 1 && (
          <IconButton
            icon="chevron-right"
            mode="contained-tonal"
            size={20}
            iconColor="#000"
            style={styles.chevron}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={props.data.images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: itemWidth,
    height: 250,
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'contain',
  },

  chevron: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
  },
});

export default ImageCarousel;
