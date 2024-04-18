import * as React from 'react';
import * as products from '../../assets/data/product_catalogue.json';
import {Button} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//import SearchBar from './searchbar';
import {
  ScrollView,
  Text,
  Image,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
const ProductListing = () => {
  const handleSubmit = () => {
    console.log(products);
  };
  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Image source={{uri: item.image}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>
  );
  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          // Add any other props or event handlers as needed
        />
      </View>
      <FlatList
        data={products.categories.flatMap(category => category.products)}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.container}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderRadius: 8, // Border radius to make it rounded
    borderWidth: 1, // Border width
    borderColor: '#ccc',
  },
  item: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 8,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  searchbar: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0%'),
    borderWidth: hp('1%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
  },
  input: {
    fontSize: wp('5%'),
    backgroundColor: 'white',
    height: 40, // Set the height of the search bar
    fontSize: 16, // Font size of the text input
    paddingHorizontal: 8,
  },
});
export default ProductListing;
