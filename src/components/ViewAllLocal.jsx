import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Card, Title, Paragraph, Text, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
// import {RetrieveData} from '../../database/Database';
// import { fetchAISPData } from '../../database/LocalDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewAllLocal = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const filterDataByScope = data => {
    return data.filter(obj => obj.scope === 'accounts');
  };
//   useEffect(() => {
//     // fetchAISPData()
//     //   .then(data => {
//     //     setCards(data); // Update the state with the fetched data
//     //   })
//     //   .catch(error => {
//     //     console.error('Error fetching AISP data:', error);
//     //   });
//     const retrievedData = await AsyncStorage.getItem(`localaisp_${accID}`);
//  }, []); 
useEffect(() => {
    const fetchAsyncData = async () => {
      try {
        const data = await AsyncStorage.getItem(`localaisp_{accID}`);
        console.log("locallllllllllllll data",data);
        if (data !== null) {
          // Data retrieval was successful
          const parsedData = JSON.parse(data);
          const cardsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
          setCards(cardsArray);
          console.log('Retrieved AISP Data:', cardsArray);
        } else {
          // No data found for the specified key
          console.log(`No data found for accID={accID} in AsyncStorage.`);
        }
      } catch (error) {
        console.error('Error retrieving AISP data:', error);
        // Handle errors as needed
      }
    };

    fetchAsyncData(); // Call the async function inside useEffect

  }, []); 
  
  return (
    <View style={{ flex: 1, marginTop: 5 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}>
        {cards.map(card => (
          <Card
            key={card.accID}
            style={styles.card}
            onPress={() => {
              navigation.navigate('Local Transactions');
            }}>
            {card.accsubType === 'CurrentAccount' ? (
              <Card.Cover
                source={require('../assets/images/card2.png')}
                style={styles.coverImage}
              />
            ) : (
              <Card.Cover
                source={require('../assets/images/card1.jpg')}
                style={styles.coverImage}
              />
            )}
            <Card.Content style={styles.cardContent}>
              <Title style={styles.title}>{card.accsubType}</Title>

              <Paragraph style={styles.additionalInfo}>
                {card.accnum}
              </Paragraph>
              <Paragraph style={styles.additionalInfo}>
                {card.debtorname}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
        <Card key="viewAllCard" style={{ elevation: 3 }}>
          <Card.Content>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
                fontWeight: 'bold',
                fontSize: RFValue(18),
                color: '#5a287d',
              }}>
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
export default ViewAllLocal;