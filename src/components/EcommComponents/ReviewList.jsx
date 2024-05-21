import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Rating } from 'react-native-ratings';
import { IconButton } from 'react-native-paper';

const ReviewList = ({ name, rating, content, title }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleAccordion}
        style={styles.touchableContainer}
      >
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <IconButton icon="check-decagram-outline" iconColor="green" size={24} />
            <Text style={styles.name}>{name}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Rating type="custom" ratingCount={5} startingValue={rating} imageSize={20} readonly />
            <IconButton
              icon={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              onPress={toggleAccordion}
            />
          </View>
        </View>

        {expanded && (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  touchableContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 12,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  content: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 8,
    color: '#000',
    textAlign: 'justify',
  },
});

export default ReviewList;
