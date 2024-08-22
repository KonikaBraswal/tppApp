import React, {useEffect, useState, useRef, useCallback} from 'react';
import {ScrollView, View, StyleSheet, Animated, Dimensions} from 'react-native';
import {Card, Title, Paragraph, Text, IconButton} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchAISPData = async () => {
  try {
    const data = await AsyncStorage.getItem('aispData');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching AISP data from AsyncStorage:', error);
    return [];
  }
};

const ViewAllLocal = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);

  const fetchData = async () => {
    try {
      const data = await fetchAISPData();
      setCards(data);
    } catch (error) {
      console.error('Error fetching AISP data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const screenWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: screenWidth,
        duration: 7000,
        useNativeDriver: true,
      }),
    ).start();
  }, [translateX, screenWidth]);

  return (
    <View style={{flex: 1, marginTop: 5}}>
      {cards.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{padding: 8}}>
          {cards.map(card => (
            <Card
              key={card.accID}
              style={styles.card}
              onPress={() => {
                navigation.navigate('Local Transactions');
              }}>
              {card.accsubType === 'CurrentAccount' ? (
                <Card.Cover
                  source={require('../assets/images/card1.png')}
                  style={styles.coverImage}
                />
              ) : (
                <Card.Cover
                  source={require('../assets/images/card2.png')}
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
          <Card key="viewAllCard" style={{elevation: 3}}>
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
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'rgba(232, 232, 232, 0.3)',
              alignContent: 'center',
              width: '100%',
              padding: hp('1%'),
            }}>
            <Animated.View
              style={[styles.contentContainer, {transform: [{translateX}]}]}>
              <Text style={styles.text}>No Added Bank Accounts</Text>
              <IconButton icon="bank-plus" iconColor="#5a287d" />
            </Animated.View>
          </View>
        </View>
      )}
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
  text: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#5a287d',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewAllLocal;
