import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import {Surface, Stack} from '@react-native-material/core';
import {Title, IconButton} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Icon, ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';

const VRPDetails = ({route}) => {
  //   const { Data } = route.params || {};
  const status = route.params?.data ;
  console.log("VRp",status);
  const navigation = useNavigation();
  if (!status) {
    return (
      <View>
        <Text>No data available</Text>
      </View>
    );
  }
  const handlePress = () => {
    if (status === 'AcceptedSettlementCompleted') {
      navigation.navigate('ConsentsforVRP');
    } else {
      navigation.navigate('GrantedForm');
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
                fontSize: RFValue(16),
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
                fontSize: RFValue(16),
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
            ? 'VRP Consents'
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
      fontSize: RFValue(18),
      borderRadius: 8,
    },
  };

export default VRPDetails;