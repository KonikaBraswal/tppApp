// Footer.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-paper';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <Icon style={styles.icon}  source="home-outline" color={'#551a8b'} size={40} />
          <Text style={styles.iconText}>Home</Text>
        </View>
        <View style={styles.iconWrapper}>
          <Icon style={styles.icon} source="account-outline" color={'#551a8b'} size={40} />
          <Text style={styles.iconText}>Profile</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  icon:{
   height:10,
   width:10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%', // Adjust as needed
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    color: '#551a8b',
    fontSize: 15,
  },
});

export default Footer;
