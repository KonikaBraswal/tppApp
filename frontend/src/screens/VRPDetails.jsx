import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Surface,Stack } from '@react-native-material/core';
import LinearGradient from 'react-native-linear-gradient';

const VRPDetails = ({ route }) => {
//   const { Data } = route.params || {};
  const Data= route.params?.data;
  if (!Data) {
    return (
      <View>
        <Text>No data available</Text>
      </View>
    );
  }
  const formattedAmount = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(parseFloat(Data.Data.Instruction.InstructedAmount.Amount));

  return (
    <Stack fill center spacing={4}>
    <Surface elevation={2} category="medium" style={{ width: '95%', height: '50%' }}>
      <Surface
        elevation={20}
        category="medium"
        style={{ width: '100%', height: '25%' }}
      >
    
        <LinearGradient
          colors={['#5a287d', '#74429e']} 
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ marginLeft: 6, color: 'white', fontSize: 30}}>
            {formattedAmount}
          </Text>
        
        </LinearGradient>
      </Surface>
      <Surface
        elevation={20}
        category="medium"
        style={{ width: '100%', height: '50%'}}
      >
        {/* Use LinearGradient for a fluid color effect */}
        <LinearGradient
          colors={['#5a287d', '#9d6dbb']} // Add more colors as needed
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
  <View style={{ flex: 1 }}>
    <Text style={{ marginLeft: 10, color: 'white', fontSize: 15 }}>
      Name
    </Text>
  </View>
  <Text style={{ flex: 2, marginLeft: 6, marginRight: -4, color: 'white', fontSize: 15 }}>
    {Data.Data.Initiation.CreditorAccount.Name}
  </Text>
</View>
<View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
  <View style={{ flex: 1 }}>
    <Text style={{ marginLeft: 10, color: 'white', fontSize: 12 }}>
      Consent ID
    </Text>
  </View>
  <Text style={{ flex: 2, marginLeft: 6, marginRight: 10, color: 'white', fontSize: 15 }}>
    {Data.Data.ConsentId}
  </Text>
</View>
<View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
  <View style={{ flex: 1 }}>
    <Text style={{ marginLeft: 10, color: 'white', fontSize: 12 }}>
      Payment Status
    </Text>
  </View>
  <Text style={{ flex: 2, marginLeft: 6, marginRight: 10, color: 'white', fontSize: 15 }}>
    {Data.Data.Status}
  </Text>
</View>

        </LinearGradient>
      </Surface>
    </Surface>
  </Stack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default VRPDetails;
