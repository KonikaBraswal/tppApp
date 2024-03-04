import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Title, IconButton} from 'react-native-paper';

const SuccessfulTransaction = ({route}) => {
  const navigation = useNavigation();
  const status = route.params.status;
  console.log(status);
  const handlePress = () => {
    if (status === 'AcceptedSettlementCompleted') {
      navigation.navigate('Added Bank Accounts');
    } else {
      navigation.navigate('Transfer Money');
    }
  };
  return (
    <View style={styles.container}>
      {status === 'AcceptedSettlementCompleted' ? (
        <>
          <Title style={{fontWeight: 'bold'}}>Successful Payment</Title>
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
        </>
      ) : (
        <>
          <Title style={{fontWeight: 'bold'}}>Unsuccessful Payment</Title>
          <IconButton
            icon="close-circle-outline"
            iconColor="red"
            containerColor="rgba(255, 0, 0, 0.2)"
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
              Your transaction could not be completed. Please try again.
            </Text>
          </View>
        </>
      )}

      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.linkText}>
          {status === 'AcceptedSettlementCompleted'
            ? 'Go to Accounts and Transactions'
            : 'Retry Transaction'}
        </Text>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30,
    fontSize: 18,
    borderRadius: 8,
  },
};

export default SuccessfulTransaction;
