import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Title, IconButton} from 'react-native-paper';

const SuccessfullTransaction = () => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('View Details', {
      AccountId: '48901b2d-f748-40a9-b8e4-5a206590b6a5',
    });
  };
  return (
    <View style={styles.container}>
      <Title>Successful Payment</Title>
      <IconButton
        icon="check-bold"
        iconColor="#fff"
        containerColor="green"
        size={30}
      />
      <View>
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}>
          You have successfully transferred money from ONEBank App
        </Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.linkText}>Go to Accounts and Transactions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 40,
  },

  linkText: {
    backgroundColor: '#c8e1cc',
    padding: 10,
    marginTop: 30,
    fontSize: 18,
    borderRadius: 8,
  },
};

export default SuccessfullTransaction;
