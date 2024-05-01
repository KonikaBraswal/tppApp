import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ApiLogsList = ({ route }) => {
  const { logs } = route.params; // Get logs data from navigation route
  const navigation = useNavigation(); // Hook for navigation

  const handleLogPress = (log) => {
    navigation.navigate('ApiLogDetails', { log }); // Navigate to LogDetailsPage with log data
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Api Logs List
      </Text>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLogPress(item)}>
            <Text>{`Date: ${item.date}, Time: ${item.time}, API Name: ${item.api_name}, Status: ${item.status}, Scope: ${item.scope}`}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ApiLogsList;
