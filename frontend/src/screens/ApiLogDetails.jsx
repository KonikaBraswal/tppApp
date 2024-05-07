// import React from 'react';
// import { View, Text, ScrollView } from 'react-native';

// const ApiLogDetails = ({ route }) => {
//   const { log } = route.params; // Get log data from navigation route
//   const responseData = JSON.parse(log.response);
//   return (
//     <ScrollView>
//       <View style={{ flex: 1, padding: 20 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
//           Api Log Details
//         </Text>
//         <Text>{`Date: ${responseData.headers.date}`}</Text>
//         <Text>{`API Name: ${log.api_name}`}</Text>
//         <Text>{`Scope: ${responseData.data.scope}`}</Text>
//         <Text>{`Status: ${responseData.status}`}</Text>
//         <Text>{`Method: ${responseData.config.method}`}</Text>
//         <Text>{`Response: ${log.response}`}</Text>
//       </View>
//     </ScrollView>
//   );
// };

// export default ApiLogDetails;

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Title, Caption, Divider } from 'react-native-paper';

const ApiLogDetails = ({ route }) => {
  const { log } = route.params; 
  const responseData = JSON.parse(log.response);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>API Log Details</Title>
        <Divider style={styles.divider} />
        <Caption style={styles.caption}>{`Date: ${responseData.headers.date}`}</Caption>
        <Caption style={styles.caption}>{`API Name: ${log.api_name}`}</Caption>
        <Caption style={styles.caption}>{`Scope: ${responseData.data.scope}`}</Caption>
        <Caption style={styles.caption}>{`Status: ${responseData.status}`}</Caption>
        <Caption style={styles.caption}>{`Method: ${responseData.config.method}`}</Caption>
        <Divider style={styles.divider} />
        <Text style={styles.response}>{`Response: ${log.response}`}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    marginBottom: 5,
  },
  divider: {
    marginVertical: 15,
  },
  response: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ApiLogDetails;

