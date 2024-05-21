import React from 'react';
import { View, FlatList, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ImageCarousel = (props) => {
  const { width: screenWidth } = useWindowDimensions();
  const itemWidth = screenWidth * 0.9;

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item(itemWidth)}>
        <Image source={item} style={styles.image} />
        {props.data.images.length > 1 && (
          <IconButton
            icon="chevron-right"
            mode="contained-tonal"
            size={20}
            iconColor="#000"
            containerColor="#D3D3D3"
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
  item: (width) => ({
    width: width,
    height: 250,
    marginHorizontal: wp('1.2%'),
    paddingVertical: hp('0.2%'),
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fff',
    elevation: 6,
  }),
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
    transform: [{ translateY: -10 }],
  },
});

export default ImageCarousel;
