import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet,FlatList} from 'react-native';
import {Card, Title, Paragraph, Text, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {RetrieveData} from '../../database/Database';
import AndroidClient from '../../DatabaseFactory/AndroidClientDb';

const ViewAll = () => {
  const androidClientAisp = new AndroidClient("NWG", "Sandbox", "accounts");
  const navigation = useNavigation();
  const [retrievedData, setRetrievedData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("heloooooooooooooooooooooooooo");
        const data = await androidClientAisp.displayData();
        // if (!Array.isArray(data)) {
        //   console.error('Expected data to be an array, received:', typeof data);
        //   data = []; // Fallback to an empty array
        // }
        console.log("hiiiiiiiiiiiiiiiiiii",data);
        console.log("Daaataaaa",data);
        const filteredData = data.filter(entry => entry.scope === "accounts");
        console.log("accountssssssss",filteredData); 
        setRetrievedData(filteredData);
        console.log("minaaaaallll",retrievedData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
   // Helper function to determine the image source based on AccountId
   const getImageSource = (subtype) => {
    if (!subtype) {
      console.error('Invalid subtype:', subtype);
      return require('../assets/images/bank.png'); // Default image
    }
    switch (subtype) {
      case 'CurrentAccount':
        return require('../assets/images/card2.png');
      default:
        return require('../assets/images/card1.jpg');
    }
  };
  

  return (
<View style={{flex: 1, marginTop: 5}}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{padding: 8}}
  >
    {retrievedData.map((item, index) => {
      const accounts = (() => {
        if (!item.accountsList) {
          console.error('accountsListString is null or undefined');
          return [];
        }
        try {
          const parsedAccounts = JSON.parse(item.accountsList);
          return parsedAccounts.Account || [];
        } catch (error) {
          console.error('Error parsing accountsList:', error);
          return [];
        }
      })();

      return accounts.map((account, idx) => (
        <Card
          key={`${index}-${idx}`} // Ensures each card has a unique key
          style={styles.card}
          onPress={() => {
            navigation.navigate('View Added Bank Details', {
              AccountId: account.AccountId,
            });
          }}
        >
          {/* Conditionally select the cover image based on AccountSubType */}
          <Card.Cover
            source={getImageSource(account.AccountSubType)}
            style={styles.coverImage}
          />
          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>{account.AccountSubType}</Title>
            {/* Display Identification and Nickname from the first account in the accounts array */}
            <Paragraph style={styles.additionalInfo}>
              {account.Account[0]?.Identification}
            </Paragraph>
            <Paragraph style={styles.additionalInfo}>
              {account.Nickname}
            </Paragraph>
          </Card.Content>
        </Card>
      ));
    })}
    {/* "View All" Card */}
    <Card style={{elevation: 3, backgroundColor: 'transparent'}}>
      <Card.Content>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 40,
            fontWeight: 'bold',
            fontSize: RFValue(18),
            color: '#5a287d',
          }}
        >
          View All
        </Text>
        <IconButton
          mode="contained-tonal"
          icon="chevron-right"
          color="#5a287d"
          containerColor="rgba(90, 40, 125, 0.3)"
          size={26}
          style={{
            marginLeft: 15,
          }}
          onPress={() => navigation.navigate('Added Bank Accounts')}
        />
      </Card.Content>
    </Card>
  </ScrollView>
</View>
    // //hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii refer this

  //   <View style={styles.container}>
  //   <FlatList
  //     data={retrievedData}
  //     keyExtractor={(item, index) => index.toString()}
  //     renderItem={({item}) => {
  //       const accounts = parseAccountsList(item.accountsList);
  //       return accounts.map((account, idx) => (
  //         <View key={idx} style={styles.accountContainer}>
  //           <Text style={styles.text}>Account ID: {account.AccountId}</Text>
  //           <Text style={styles.text}>Account SubType: {account.AccountSubType}</Text>
  //         </View>
  //       ));
  //     }}
  //   />
  // </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 16,
    width: 275,
    overflow: 'hidden',
    height: '100%',
  },
  coverImage: {
    height: '110%',
    resizeMode: 'cover',
    marginTop: -10,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: RFValue(15),
    marginBottom: -6,
  },
  additionalInfo: {
    color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(200, 225, 204, 0.5)',
  },
});
export default ViewAll;
