import React, { useState, useEffect } from 'react';
import { Button, Searchbar, Icon, Modal, Portal, Checkbox, Switch, Surface, Stack, Divider, ListItem } from 'react-native-paper';
import { Keyboard, Pressable, TouchableOpacity, VirtualizedList, ScrollView, Text, Image, View, StyleSheet, TextInput, FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as products from '../../assets/data/product_catalogue.json';
import imgarray from '../../assets/data/images';
import ProductDetails from '../../screens/EcommScreens/ProductDetails';

const ProductListing = () => {
  const navigation = useNavigation();
  const category = ['Mobiles', 'Books', 'Clothings', 'Beauty', 'Furniture', 'Laptops'];
  const [visible, setVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchcategory, setSearchCategory] = useState('');
  const [switchOn, setSwitchOn] = useState(true);
  const [searchedProducts, setSearchedProducts] = useState(category);
  const [filteredProducts, setFilteredProducts] = useState(products.products);
  
  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);

  const handleCheckboxToggle = itemValue => {
    if (selectedItems.includes(itemValue)) {
      setSelectedItems(selectedItems.filter(item => item !== itemValue));
    } else {
      setSelectedItems([...selectedItems, itemValue]);
    }
    setSwitchOn(false);
  };

  useEffect(() => {
    const filtered = products.products.filter(product => {
      return (
        selectedItems.length === 0 ||
        selectedItems.some(item => product.category.includes(item))
      );
    });
    setFilteredProducts(filtered);
  }, [selectedItems]);

  const onChangeSearch = query => {
    setSearchQuery(query);
    setSearchCategory('');
    const filtered = category.filter(item =>
      item.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
    setSearchedProducts(filtered.length > 0 ? filtered : ['No results found']);
    setSelectedItems([]);
    setSwitchOn(false);
  };

  const showProducts = () => {
    setSwitchOn(!switchOn);
    setFilteredProducts(products.products);
    setSelectedItems([]);
  };

  const searchCategory = category => {
    setSearchCategory(category);
    Keyboard.dismiss();
    setSearchQuery('');
    const p = products.products.filter(product => {
      return (
        category === '' ||
        product.category.toLowerCase().includes(category.toLowerCase())
      );
    });
    setFilteredProducts(p);
    setSwitchOn(false);
  };

  const rows = [];
  if (searchedProducts.length === 1 && searchedProducts[0] === 'No results found') {
    const row = (
      <Stack direction="row" style={SelectBankStyle.row}>
        <Surface category="medium" style={SelectBankStyle.surface}>
          <Text style={{color: 'red'}}>No results found</Text>
        </Surface>
      </Stack>
    );
    rows.push(row);
  } else {
    for (let i = 0; i < searchedProducts.length; i += 3) {
      const rowProducts = searchedProducts.slice(i, i + 3);
      const row = (
        <Stack key={`row_${i}`} direction="row" style={SelectBankStyle.row}>
          {rowProducts.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => searchCategory(item)}>
              <Surface category="medium" style={SelectBankStyle.surface}>
                <Text>{item}</Text>
              </Surface>
            </TouchableOpacity>
          ))}
        </Stack>
      );
      rows.push(row);
    }
  }

  const renderitem = ({ item, index }) => {
    const marginBottom = index === filteredProducts.length - 1 ? wp('90%') : 10;
    const productImages = imgarray.find(object => object.id === item.id);
    return (
      <View style={[styles.item, { marginBottom }]}>
        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Product Details', { product: item })}>
          <Image source={productImages.images[0]} style={styles.image} resizeMethod="resize" />
        </TouchableOpacity>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.price}>£{item.price}</Text>
      </View>
    );
  };

  return (
    <ScrollView>
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#5a287d', padding: 10 }}>
          <Searchbar
            placeholder="Search any product"
            onChangeText={onChangeSearch}
            value={searchQuery}
            icon={() => <Icon name="magnify" color="black" size={20} />}
            style={{ borderRadius: 5, backgroundColor: '#f4ebfe' }}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.toggle}>
            <Text style={{ fontSize: 15 }}>All</Text>
            <Switch value={switchOn} onValueChange={() => showProducts()} />
          </View>
          <Button icon="chevron-down" mode="contained" onPress={showMenu}>
            Filter
          </Button>
          <Portal>
            <Modal visible={visible} onDismiss={hideMenu} contentContainerStyle={styles.modalContainer}>
              {category.map((item, index) => (
                <Checkbox.Item
                  key={index}
                  label={item}
                  status={selectedItems.includes(item) ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxToggle(item)}
                />
              ))}
            </Modal>
          </Portal>
        </View>

        {searchQuery !== '' && (
          <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="always" automaticallyAdjustContentInsets={false} keyboardDismissMode="on-drag">
              <Stack fill left style={{ backgroundColor: 'white', padding: 10 }}>
                <Surface elevation={10} category="medium">
                  {rows.map((row, index) => (
                    <View key={`row_${index}`}>{row}</View>
                  ))}
                </Surface>
              </Stack>
            </ScrollView>
          </View>
        )}

        <View style={styles.container}>
          <FlatList
            data={filteredProducts}
            renderItem={renderitem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.container}
          />
        </View>
      </View>
    </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flexGrow: 1,
    marginBottom: 10,
  },
  item: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fff',
  },
  modalContainer: {
    position: 'absolute',
    right: 20,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: wp('5%'),
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  toggle: {
    padding: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const SelectBankStyle = StyleSheet.create({
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  surface: {
    backgroundColor: 'white',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'white',
    margin: 10,
  },
});

export default ProductListing;


