import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const ApiLogDetails = ({ route }) => {
  const { log } = route.params; // Get log data from navigation route
  const responseData = JSON.parse(log.response);
  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          Api Log Details
        </Text>
        <Text>{`Date: ${responseData.headers.date}`}</Text>
        <Text>{`API Name: ${log.api_name}`}</Text>
        <Text>{`Scope: ${responseData.data.scope}`}</Text>
        <Text>{`Status: ${responseData.status}`}</Text>
        <Text>{`Method: ${responseData.config.method}`}</Text>
        <Text>{`Response: ${log.response}`}</Text>
      </View>
    </ScrollView>
  );
};

export default ApiLogDetails;
