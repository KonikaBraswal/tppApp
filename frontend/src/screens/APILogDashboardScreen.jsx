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




























// import React from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const ApiLogsList = ({ route }) => {
//   const { logs } = route.params; // Get logs data from navigation route
//   const navigation = useNavigation(); // Hook for navigation

//   const handleLogPress = (log) => {
//     navigation.navigate('ApiLogDetails', { log }); // Navigate to LogDetailsPage with log data
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
//         Api Logs List
//       </Text>
//       <FlatList
//         data={logs}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleLogPress(item)}>
//             <Text>{`Date: ${item.date}, Time: ${item.time}, API Name: ${item.api_name}, Status: ${item.status}, Scope: ${item.scope}`}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default ApiLogsList;



















export default ApiLogDetails;




















































// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { Card, Title, Paragraph } from 'react-native-paper';
// import { getAISPApiEndpoint } from './path/to/ApiFactory_AISP/ConfigUtils'; 
// import { getPISPApiEndpoint } from './path/to/ApiFactory_PISP/ConfigUtils'; 
// import { getVRPApiEndpoint } from './path/to/ApiFactory_VRP/ConfigUtils';

// const APILogDashboardScreen = () => {
//   const [loading, setLoading] = useState(true);
//   const [apiMetrics, setApiMetrics] = useState({
//     requestCount: 0,
//     responseTime: 0,
//     errorRate: 0,
//     latency: 0,
//     trafficVolume: 0,
//     apiUsageTrends: '+0%',
//     userEngagementMetrics: 'N/A',
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       // Fetch data for AISP, PISP, and VRP APIs
//       const aispEndpoint = getAISPApiEndpoint();
//       const pispEndpoint = getPISPApiEndpoint();
//       const vrpEndpoint = getVRPApiEndpoint();

//       // Example: Fetching AISP data (similar for PISP and VRP)
//       const aispResponse = await fetch(aispEndpoint);
//       const aispData = await aispResponse.json();
//       // Update state with AISP data
//       setApiMetrics((prevMetrics) => ({ ...prevMetrics, ...aispData }));

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Card style={styles.card}>
//         <Card.Content>
//           <Title>API Metrics</Title>
//           <Paragraph>Request Count: {apiMetrics.requestCount}</Paragraph>
//           <Paragraph>Response Time: {apiMetrics.responseTime} ms</Paragraph>
//           <Paragraph>Error Rate: {apiMetrics.errorRate}%</Paragraph>
//           <Paragraph>Latency: {apiMetrics.latency} ms</Paragraph>
//           <Paragraph>Traffic Volume: {apiMetrics.trafficVolume} MB</Paragraph>
//           <Paragraph>API Usage Trends: {apiMetrics.apiUsageTrends}</Paragraph>
//           <Paragraph>User Engagement Metrics: {apiMetrics.userEngagementMetrics}</Paragraph>
//         </Card.Content>
//       </Card>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   card: {
//     width: '90%',
//     elevation: 4,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default APILogDashboardScreen;
