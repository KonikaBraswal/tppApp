import React from 'react';
import {View, Text} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';

const CartItem = ({route}) => {
  const {product} = route.params;

  return (
    <View>
      <Card>
        <Card.Content>
          <Title>ABC</Title>
        </Card.Content>
      </Card>
    </View>
  );
};

export default CartItem;
