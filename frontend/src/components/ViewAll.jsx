import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Card, Title, Paragraph, FAB, Text} from 'react-native-paper';

const ViewAll = () => {
  const cards = [
    {
      id: 1,
      subType: 'Savings',
      accountNumber: '456XXXXXX909',
      imageUrl:
        'https://www.rbs.com/content/dam/rbs_com/rbs/Images/news/2019/october/Natewest%20reward%20black%20biometric%20card.JPG',
    },
    {
      id: 2,
      subType: 'Current',
      accountNumber: '456XXXXXX909',
      imageUrl:
        'https://www.rbs.com/content/dam/rbs_com/rbs/Images/news/2019/october/Natewest%20reward%20black%20biometric%20card.JPG',
    },
  ];

  return (
    <View style={{flex: 1, marginTop: 5}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{padding: 10}}>
        {cards.map(card => (
          <Card key={card.id} style={styles.card}>
            <Card.Cover
              source={{uri: card.imageUrl}}
              style={styles.coverImage}
            />
            <Card.Content style={styles.cardContent}>
              <Title style={styles.title}>{card.subType}</Title>

              <Paragraph style={styles.additionalInfo}>
                {card.accountNumber}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <FAB
        style={styles.fab}
        color="white"
        icon="chevron-right"
        onPress={() => {}}
      />
      <Text
        style={{
          textAlign: 'right',
          fontWeight: 'bold',
          right: 15,
        }}>
        View All
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 16,
    width: 250,
    overflow: 'hidden',
    height: '100%',
  },
  coverImage: {
    height: '100%',
    resizeMode: 'cover',
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
