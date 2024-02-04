import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Card, Title, Paragraph, Text, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import readNatwestAccount from '../assets/data/accounts.json';
import readNatwestBalance from '../assets/data/balances.json';

const NatwestAccountData = readNatwestAccount?.Data?.Account;
const NatwestBalanceData = readNatwestBalance?.Data?.Balance;

const ViewAll = () => {
  const navigation = useNavigation();

  const cards = [
    {
      AccountId: '48901b2d-f748-40a9-b8e4-5a206590b6a5',
      subType: 'Savings',
      accountNumber: '456XXXXXXXX909',
      balance: '19606.40 GBP',
      imageUrl: require('../assets/images/card2.png'),
    },
    {
      AccountId: 'ffa1dee0-2fbf-4362-abf6-37dbfeee2de20',
      subType: 'Current',
      accountNumber: '507XXXXXXXXX602',
      balance: '15060.90 GBP',
      imageUrl: require('../assets/images/card1.jpg'),
    },
  ];

  return (
    <View style={{flex: 1, marginTop: 5}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{padding: 8}}>
        {cards.map(card => (
          <Card
            key={card.AccountId}
            style={styles.card}
            onPress={() => {
              navigation.navigate('View Details', {
                AccountId: card.AccountId,
              });
            }}>
            <Card.Cover source={card.imageUrl} style={styles.coverImage} />
            <Card.Content style={styles.cardContent}>
              <Title style={styles.title}>{card.subType} Account</Title>

              <Paragraph style={styles.additionalInfo}>
                {card.accountNumber}
              </Paragraph>
              <Paragraph style={styles.additionalInfo}>
                {card.balance}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
        <Card style={{elevation: 3}}>
          <Card.Content>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
                fontWeight: 'bold',
                fontSize: 18,
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
              onPress={() => navigation.navigate('Bank Accounts')}
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
    width: 270,
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
    fontSize: 16,
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