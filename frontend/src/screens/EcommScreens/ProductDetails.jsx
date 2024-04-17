// ProductDetails.js

import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import imagesArray from '../../assets/data/ecomm-images';

const ProductDetails = () => {
  // const product=props.product;
  const product = {
    id: '3',
    name: 'Adidas Originals Trefoil T-Shirt',
    description: 'A classic Adidas t-shirt with the iconic Trefoil logo.',
    brand: 'Adidas',
    category: 'Clothings',
    subcategory: 'T-Shirts',
    price: 24.99,
    currency: 'USD',
    specifications: {
      material: '100% cotton',
      color: 'Black',
      sizes: 'XS-XL',
    },
    reviews: [
      {
        id: '7',
        author: 'Sophia Martinez',
        rating: 5,
        text: 'Great quality t-shirt, very comfortable and fits perfectly.',
        timestamp: '2023-04-18T11:30:00Z',
      },
      {
        id: '9',
        author: 'Michael Johnson',
        rating: 4,
        text: 'Nice design and good fit, but the fabric could be a bit softer.',
        timestamp: '2023-04-20T09:00:00Z',
      },
    ],
    related_products: [
      {
        id: '2',
        name: 'Nike Air Max 270',
        price: 129.99,
      },
    ],
  };
  const productImages = imagesArray.find(object => object.id === product.id);
  return (
    <ScrollView>
      <View style={{padding: 20}}>
        <Card>
          <Card.Cover source={productImages.images[0]} />
        </Card>

        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
          {product.name}
        </Text>
        <Text style={{fontSize: 16, marginBottom: 10}}>
          Brand: {product.brand}
        </Text>
        <Text style={{fontSize: 16, marginBottom: 10}}>
          Category: {product.category}
        </Text>
        <Text style={{fontSize: 16, marginBottom: 10}}>
          Price: ${product.price.toFixed(2)}
        </Text>
        <Text style={{fontSize: 16, marginBottom: 10}}>
          Description: {product.description}
        </Text>
        <Text style={{fontSize: 16, marginBottom: 10}}>Specifications:</Text>
        <View>
          {Object.entries(product.specifications).map(([key, value]) => (
            <Text key={key} style={{marginLeft: 10}}>
              {key}: {value}
            </Text>
          ))}
        </View>
        {product.reviews.length > 0 && (
          <View>
            <Text style={{fontSize: 16, marginTop: 20, marginBottom: 10}}>
              Reviews:
            </Text>
            {product.reviews.map(review => (
              <View key={review.id} style={{marginBottom: 10}}>
                <Text>
                  {review.author} - {review.rating} stars
                </Text>
                <Text>{review.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  imageContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
export default ProductDetails;
