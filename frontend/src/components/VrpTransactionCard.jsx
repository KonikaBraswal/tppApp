// TransactionCard.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VrpTransactionCard = ({ transaction }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Transaction ID: {transaction.DomesticVRPId}</Text>
      <Text style={styles.text}>Status: {transaction.Status}</Text>
      <Text style={styles.text}>Amount: {transaction.Instruction.InstructedAmount.Amount} {transaction.Instruction.InstructedAmount.Currency}</Text>
      <Text style={styles.text}>Debtor Name: {transaction.DebtorAccount.Name}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default VrpTransactionCard;
