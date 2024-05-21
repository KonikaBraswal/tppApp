import React, { useState, useEffect } from 'react';
import * as products from '../../assets/data/product_catalogue.json';
import { Button, Checkbox, Switch, Modal } from 'react-native-paper';
import {
  Keyboard,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import imgarray from '../../assets/data/images';
import { useNavigation } from '@react-navigation/native';

const ProductListing = () => {
  const navigation = useNavigation();
  const category = [
    'Mobiles',
    'Books',
    'Clothings',
    'Beauty',
    'Furniture',
    'Laptops',
  ];
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
      item.toLowerCase().includes(query.toLowerCase()),
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
    const p = products.products.filter(product =>
      product.category.toLowerCase().includes(category.toLowerCase()),
    );
    setFilteredProducts(p);
    setSwitchOn(false);
  };

  const rows = [];
  if (
    searchedProducts.length === 1 &&
    searchedProducts[0] === 'No results found'
  ) {
    const row = (
      <View style={styles.row}>
        <Text style={{ color: 'red' }}>No results found</Text>
      </View>
    );
    rows.push(row);
  } else {
    for (let i = 0; i < searchedProducts.length; i += 3) {
      const rowProducts = searchedProducts.slice(i, i + 3);

      const row = (
        <View key={`row_${i}`} style={styles.row}>
          {rowProducts.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                searchCategory(item);
              }}>
              <View style={styles.surface}>
                <Text>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
      rows.push(row);
    }
  }

  function renderitem({ item, index }) {
    const marginBottom =
      index === filteredProducts.length - 1 ? styles.itemLast : styles.item;
    const productImages = imgarray.find(object => object.id === item.id);
    return (
      <View style={[styles.itemContainer, { marginBottom }]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Product Details', { product: item })}>
          <Image
            source={productImages.images[0]}
            style={styles.image}
            resizeMethod="resize"
          />
        </TouchableOpacity>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.price}>£{item.price}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ backgroundColor: '#5a287d', padding: 10 }}>
        <input
          placeholder="Search any product"
          onChange={e => onChangeSearch(e.target.value)}
          value={searchQuery}
          style={{
            borderRadius: 5,
            backgroundColor: '#f4ebfe',
            padding: 8,
            fontSize: 16,
          }}
        />
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.toggle}>
          <Text style={{ fontSize: 15 }}>All</Text>
          <Switch
            value={switchOn}
            onChange={() => {
              showProducts();
            }}
          />
        </View>
        <Button mode="contained" onClick={showMenu}>
          Filter
        </Button>
        {visible && (
          <Modal visible={visible} onClose={hideMenu}>
            {category.map((item, index) => (
              <Checkbox
                key={index}
                label={item}
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxToggle(item)}
              />
            ))}
          </Modal>
        )}
      </View>

      {searchQuery !== '' && (
        <View style={styles.container}>
          <Stack fill left style={{ backgroundColor: 'white', padding: 10 }}>
            {rows.map((row, index) => (
              <View key={`row_${index}`}>{row}</View>
            ))}
          </Stack>
        </View>
      )}

      <View style={styles.container}>
        {filteredProducts.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('Product Details', { product: item })}>
            {renderitem({ item, index })}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flexGrow: 1,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fff',
  },
  itemLast: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 60,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fff',
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
    marginBottom: 5,
  },
  price: {
    fontSize: 16
    //fontWeight: 'bold',
    //color: 'green',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  searchbar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  input: {
    fontSize: 16,
    backgroundColor: 'white',
    height: 40,
    paddingHorizontal: 8,
  },
  toggle: {
    padding: 1,
    display: 'flex',
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
  text: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    borderColor: '#ccc',
    marginBottom: 10,
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
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default ProductListing;

