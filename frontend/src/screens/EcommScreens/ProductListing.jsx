import React, { useState } from 'react';
import * as products from '../../assets/data/product_catalogue.json';
import { Button, Searchbar, Icon } from 'react-native-paper';
import { Modal, Portal, Checkbox } from 'react-native-paper';
import { Surface, Stack, Divider, ListItem } from '@react-native-material/core';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView,KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { ScrollView, Text, Image, View, StyleSheet, TextInput, FlatList } from 'react-native';
const ProductListing = () => {
    const category = ['Mobiles', 'Books', 'Clothings', 'Beauty', 'Furniture', 'Laptops'];
    const [visible, setVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchcategory, setSearchCategory] = useState('');
    const [searchedProducts, setSearchedProducts] = useState(category);
    const showMenu = () => setVisible(true);
    const hideMenu = () => setVisible(false);

    const handleCheckboxToggle = itemValue => {
        if (selectedItems.includes(itemValue)) {
            setSelectedItems(selectedItems.filter(item => item !== itemValue));
        } else {
            setSelectedItems([...selectedItems, itemValue]);
        }
    };
    const filteredProducts = products.products.filter((product) => {
        const categoryMatch = selectedItems.length === 0 || selectedItems.some(item => product.category.includes(item));
        const searchMatch = searchcategory === '' || product.category.toLowerCase().includes(searchcategory.toLowerCase());
        return categoryMatch || searchMatch;

    });
    
    const onChangeSearch = query => {
        setSearchQuery(query);
        const filtered = category.filter(item =>
            item.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        );
        setSearchedProducts(filtered);
    };
    const searchCategory=(category)=>{
        console.log("p",category);
        setSearchCategory(category);
        
    };
    const rows = [];

    for (let i = 0; i < searchedProducts.length; i += 3) {
        const rowProducts = searchedProducts.slice(i, i + 3);

        const row = (
            <Stack
                key={`row_${i}`}
                direction="row"
                //spacing={10}
                style={SelectBankStyle.row}>
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





    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={{ uri: item.imgs[0] }} style={styles.image} />
            <Text style={styles.name}>{item.title}</Text>
            {/* <Text style={styles.description}>{item.specs}</Text> */}
            <Text style={styles.price}>${item.price}</Text>
        </View>
    );
    return (
        <>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid
                enableAutomaticScroll
                extraScrollHeight={Platform.OS === 'ios' ? 30 : 0}>
                <View
                    style={{
                        backgroundColor: '#5a287d',
                        padding: 10,
                    }}>
                    <Searchbar
                        placeholder="Search any product"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        icon={() => <Icon source="magnify" color="black" size={20} />}
                        style={{
                            borderRadius: 5,
                            backgroundColor: '#f4ebfe',
                        }}
                    />
                </View>
                <View style={styles.rowContainer}>
                    <Button icon="chevron-down" mode="contained" onPress={showMenu}>
                        Filter
                    </Button>
                    <Portal>
                        <Modal
                            visible={visible}
                            onDismiss={hideMenu}
                            contentContainerStyle={styles.modalContainer}>
                            {category.map((item, index) => (
                                <Checkbox.Item
                                    key={index}
                                    label={item}
                                    status={
                                        selectedItems.includes(item) ? 'checked' : 'unchecked'
                                    }
                                    onPress={() => handleCheckboxToggle(item)}
                                />
                            ))}
                        </Modal>
                    </Portal>
                </View>
                
                {searchQuery !== '' && (
                    <Stack fill left style={{ backgroundColor: 'white', padding: 10 }}>
                        <Surface elevation={10} category="medium">
                            {rows.map((row, index) => (
                                <View key={`row_${index}`}>{row}</View>
                            ))}
                        </Surface>
                    </Stack>
                )}
                <ScrollView>
                   <View style={styles.container}>
                    <FlatList
                    data={filteredProducts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    inverted={true}
                    contentContainerStyle={styles.container}
                />
                </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
        borderRadius: 8, // Border radius to make it rounded
        borderWidth: 1, // Border width
        borderColor: '#ccc',
        flex:1
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
    searchbar: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0%'),
        borderWidth: hp('1%'),
        borderRadius: wp('5%'),
        backgroundColor: 'white'
    },
    input: {
        fontSize: wp('5%'),
        backgroundColor: 'white',
        height: 40, // Set the height of the search bar
        fontSize: 16, // Font size of the text input
        paddingHorizontal: 8
    }
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

    image: {
        width: 80,

        height: 80,

        resizeMode: 'contain',

        // flexWrap:"wrap"
    },
});
export default ProductListing;