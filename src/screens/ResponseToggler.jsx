// ResponseToggler.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResponseToggler = ({ keyText, valueText }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleVisibility} style={styles.header}>
        <Text style={styles.keyText}>{keyText}</Text>
        <Icon name={isVisible ? 'expand-less' : 'expand-more'} size={20} color="#5a287d" />
      </TouchableOpacity>
      {isVisible && <View style={styles.valueContainer}>{valueText}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    padding: 10,
    borderRadius: 5,
  },
  keyText: {
    fontWeight: 'bold',
    fontSize: RFValue(16),
    color: '#5a287d',
  },
  valueContainer: {
    marginLeft: 10,
    marginTop: 5,
  },
});

export default ResponseToggler;
