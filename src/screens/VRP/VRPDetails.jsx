// // import React, {useEffect, useState} from 'react';
// // import {View, Text, StyleSheet} from 'react-native';
// // import {Surface, Stack} from '@react-native-material/core';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import LinearGradient from 'react-native-web-linear-gradient';
// // import {Button, Icon, ActivityIndicator} from 'react-native-paper';
// // import {useNavigation} from '@react-navigation/native';
// // import {
// //   widthPercentageToDP as wp,
// //   heightPercentageToDP as hp,
// // } from 'react-native-responsive-screen';
// // import {RFValue} from 'react-native-responsive-fontsize';

// // const VRPDetails = ({route}) => {
// //   //   const { Data } = route.params || {};
// //   const [loading, setLoading] = useState(true);
// //   const navigation = useNavigation();
// //   const Data = route.params?.data;
// //   if (!Data) {
// //     return (
// //       <View>
// //         <Text>No data available</Text>
// //       </View>
// //     );
// //   }
// //   return (
// //     <Stack fill center spacing={4} style={{backgroundColor: 'white'}}>
// //       <Surface category="medium" style={{width: '95%', height: '75%'}}>
// //         <Surface
// //           elevation={20}
// //           category="medium"
// //           style={{width: '100%', height: '25%', borderRadius: 50}}>
// //           <LinearGradient
// //             colors={['#5a287d', '#74429e']}
// //             style={{
// //               flex: 1,
// //               alignItems: 'center',
// //               justifyContent: 'center',
// //             }}>
// //             <Text
// //               style={{marginLeft: 6, color: 'white', fontSize: RFValue(30)}}>
// //               £{Data.amount}
// //             </Text>
// //           </LinearGradient>
// //         </Surface>
// //         <Surface
// //           elevation={20}
// //           category="medium"
// //           style={{width: '100%', height: '50%'}}>
// //           <LinearGradient
// //             colors={['#5a287d', '#9d6dbb']} // Add more colors as needed
// //             style={{
// //               flex: 1,
// //               alignItems: 'center',
// //               justifyContent: 'center',
// //             }}>
// //             <View
// //               style={{
// //                 flexDirection: 'row',
// //                 alignItems: 'flex-start',
// //                 marginBottom: 10,
// //               }}>
// //               <View style={{flex: 1}}>
// //                 <Text
// //                   style={{
// //                     marginLeft: 10,
// //                     color: 'white',
// //                     fontSize: RFValue(15),
// //                   }}>
// //                   Name
// //                 </Text>
// //               </View>
// //               <Text
// //                 style={{
// //                   flex: 2,
// //                   marginLeft: 6,
// //                   marginRight: -4,
// //                   color: 'white',
// //                   fontSize: RFValue(15),
// //                 }}>
// //                 {Data.firstName}
// //               </Text>
// //             </View>
// //             <View
// //               style={{
// //                 flexDirection: 'row',
// //                 alignItems: 'flex-start',
// //                 marginBottom: 10,
// //               }}>
// //               <View style={{flex: 1}}>
// //                 <Text
// //                   style={{
// //                     marginLeft: 10,
// //                     color: 'white',
// //                     fontSize: RFValue(15),
// //                   }}>
// //                   ID
// //                 </Text>
// //               </View>
// //               <Text
// //                 style={{
// //                   flex: 2,
// //                   marginLeft: 6,
// //                   marginRight: 10,
// //                   color: 'white',
// //                   fontSize: RFValue(15),
// //                 }}>
// //                 {Data.accountNumber}
// //               </Text>
// //             </View>
// //             <View
// //               style={{
// //                 flexDirection: 'row',
// //                 alignItems: 'flex-start',
// //                 marginBottom: 10,
// //               }}>
// //               <View style={{flex: 1}}>
// //                 <Text
// //                   style={{
// //                     marginLeft: 10,
// //                     color: 'white',
// //                     fontSize: RFValue(15),
// //                   }}>
// //                   Sort Code
// //                 </Text>
// //               </View>
// //               <Text
// //                 style={{
// //                   flex: 2,
// //                   marginLeft: 6,
// //                   marginRight: 10,
// //                   color: 'white',
// //                   fontSize: RFValue(15),
// //                 }}>
// //                 {Data.sortCode}
// //               </Text>
// //             </View>

// //             <View
// //               style={{
// //                 flexDirection: 'row',
// //                 alignItems: 'flex-start',
// //                 marginBottom: 10,
// //               }}>
// //               <View style={{flex: 1}}>
// //                 <Text
// //                   style={{
// //                     marginLeft: 10,
// //                     color: 'white',
// //                     fontSize: RFValue(15),
// //                   }}>
// //                   Reference
// //                 </Text>
// //               </View>
// //               <Text
// //                 style={{
// //                   flex: 2,
// //                   marginLeft: 6,
// //                   marginRight: 10,
// //                   color: 'white',
// //                   fontSize: RFValue(15),
// //                 }}>
// //                 {Data.reference}
// //               </Text>
// //             </View>
// //           </LinearGradient>
// //           <Surface
// //             elevation={20}
// //             category="medium"
// //             style={{width: '100%', height: '30%'}}>
// //             <LinearGradient
// //               colors={['#c8e1cc', '#c8e1cc']}
// //               style={{
// //                 flex: 1,
// //                 alignItems: 'center',
// //                 justifyContent: 'center',
// //               }}>
// //               <Button
// //                 icon={() => (
// //                   <Icon source="check-bold" color="green" size={50} />
// //                 )}></Button>
// //               <Text
// //                 style={{
// //                   fontSize: RFValue(20),
// //                   color: 'green',
// //                   textAlign: 'center',
// //                 }}>
// //                 Completed
// //               </Text>
// //             </LinearGradient>
// //           </Surface>
// //         </Surface>
// //         <Button
// //           mode="contained"
// //           labelStyle={{
// //             color: 'green',
// //             fontSize: RFValue(18),
// //             paddingTop: wp('1%'),
// //           }}
// //           style={{
// //             backgroundColor: '#c8e1cc',
// //             margin: wp('10%'),
// //             color: 'green',
// //           }}
// //           onPress={() => {
// //             navigation.navigate('ConsentsforVRP');
// //           }}>
// //           Go back to Consents
// //         </Button>
// //       </Surface>
// //     </Stack>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 16,
// //   },
// //   header: {
// //     fontSize: RFValue(20),
// //     fontWeight: 'bold',
// //     marginBottom: 16,
// //   },
// //   section: {
// //     marginBottom: 8,
// //   },
// //   label: {
// //     fontWeight: 'bold',
// //     marginRight: 8,
// //   },
// // });

// // export default VRPDetails;
// import React, {useEffect, useState} from 'react';
// import {View, Text, StyleSheet} from 'react-native';
// import {Surface, Stack} from '@react-native-material/core';
// // import LinearGradient from 'react-native-linear-gradient';
// import LinearGradient from 'react-native-web-linear-gradient';
// import {Button, Icon, ActivityIndicator} from 'react-native-paper';
// import {useNavigation} from '@react-navigation/native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {RFValue} from 'react-native-responsive-fontsize';

// const VRPDetails = ({route}) => {
//   //   const { Data } = route.params || {};
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();
//   const Data = route.params?.data;
//   if (!Data) {
//     return (
//       <View>
//         <Text>No data available</Text>
//       </View>
//     );
//   }
//   return (
//     <Stack fill center spacing={4} style={{backgroundColor: 'white'}}>
//       <Surface category="medium" style={{width: '95%', height: '75%'}}>
//         <Surface
//           elevation={20}
//           category="medium"
//           style={{width: '100%', height: '25%', borderRadius: 50}}>
//           <LinearGradient
//             colors={['#5a287d', '#74429e']}
//             style={{
//               flex: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <Text
//               style={{marginLeft: 6, color: 'white', fontSize: RFValue(30)}}>
//               £{Data.amount}
//             </Text>
//           </LinearGradient>
//         </Surface>
//         <Surface
//           elevation={20}
//           category="medium"
//           style={{width: '100%', height: '50%'}}>
//           <LinearGradient
//             colors={['#5a287d', '#9d6dbb']} // Add more colors as needed
//             style={{
//               flex: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'flex-start',
//                 marginBottom: 10,
//               }}>
//               <View style={{flex: 1}}>
//                 <Text
//                   style={{
//                     marginLeft: 10,
//                     color: 'white',
//                     fontSize: RFValue(15),
//                   }}>
//                   Name
//                 </Text>
//               </View>
//               <Text
//                 style={{
//                   flex: 2,
//                   marginLeft: 6,
//                   marginRight: -4,
//                   color: 'white',
//                   fontSize: RFValue(15),
//                 }}>
//                 {Data.firstName}
//               </Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'flex-start',
//                 marginBottom: 10,
//               }}>
//               <View style={{flex: 1}}>
//                 <Text
//                   style={{
//                     marginLeft: 10,
//                     color: 'white',
//                     fontSize: RFValue(15),
//                   }}>
//                   ID
//                 </Text>
//               </View>
//               <Text
//                 style={{
//                   flex: 2,
//                   marginLeft: 6,
//                   marginRight: 10,
//                   color: 'white',
//                   fontSize: RFValue(15),
//                 }}>
//                 {Data.accountNumber}
//               </Text>
//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'flex-start',
//                 marginBottom: 10,
//               }}>
//               <View style={{flex: 1}}>
//                 <Text
//                   style={{
//                     marginLeft: 10,
//                     color: 'white',
//                     fontSize: RFValue(15),
//                   }}>
//                   Sort Code
//                 </Text>
//               </View>
//               <Text
//                 style={{
//                   flex: 2,
//                   marginLeft: 6,
//                   marginRight: 10,
//                   color: 'white',
//                   fontSize: RFValue(15),
//                 }}>
//                 {Data.sortCode}
//               </Text>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'flex-start',
//                 marginBottom: 10,
//               }}>
//               <View style={{flex: 1}}>
//                 <Text
//                   style={{
//                     marginLeft: 10,
//                     color: 'white',
//                     fontSize: RFValue(15),
//                   }}>
//                   Reference
//                 </Text>
//               </View>
//               <Text
//                 style={{
//                   flex: 2,
//                   marginLeft: 6,
//                   marginRight: 10,
//                   color: 'white',
//                   fontSize: RFValue(15),
//                 }}>
//                 {Data.reference}
//               </Text>
//             </View>
//           </LinearGradient>
//           <Surface
//             elevation={20}
//             category="medium"
//             style={{width: '100%', height: '30%'}}>
//             <LinearGradient
//               colors={['#c8e1cc', '#c8e1cc']}
//               style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <Button
//                 icon={() => (
//                   <Icon source="check-bold" color="green" size={50} />
//                 )}></Button>
//               <Text
//                 style={{
//                   fontSize: RFValue(20),
//                   color: 'green',
//                   textAlign: 'center',
//                 }}>
//                 Completed
//               </Text>
//             </LinearGradient>
//           </Surface>
//         </Surface>
//         <Button
//           mode="contained"
//           labelStyle={{
//             color: 'green',
//             fontSize: RFValue(18),
//             paddingTop: wp('1%'),
//           }}
//           style={{
//             backgroundColor: '#c8e1cc',
//             margin: wp('10%'),
//             color: 'green',
//           }}
//           onPress={() => {
//             navigation.navigate('ConsentsforVRP');
//           }}>
//           Go back to Consents
//         </Button>
//       </Surface>
//     </Stack>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     fontSize: RFValue(20),
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   section: {
//     marginBottom: 8,
//   },
//   label: {
//     fontWeight: 'bold',
//     marginRight: 8,
//   },
// });

// export default VRPDetails;
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import {Surface, Stack} from '@react-native-material/core';
// import LinearGradient from 'react-native-linear-gradient';
import LinearGradient from 'react-native-web-linear-gradient';
import {Button, Icon, ActivityIndicator,Title,IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';

const VRPDetails = ({route}) => {
  //   const { Data } = route.params || {};
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const status = route.params?.data;
  console.log("VRPPPPPPPPPPPP DETAILSSSSSSSSSSSS",status);
  if (!status) {
    return (
      <View>
        <Text>No data available</Text>
      </View>
    );
  }
  const handlePress = () => {
    if (status === 'AcceptedSettlementCompleted') {
      navigation.navigate('ConsentsforVRP');
    } else {
      navigation.navigate('GrantedForm');
    }
  };
  return (
    <View style={styles.container}>
    {status === 'AcceptedSettlementCompleted' ? (
      <>
        <Title style={{fontWeight: 'bold'}}>Successful Payment</Title>
        <IconButton
          icon="check-bold"
          iconColor="#fff"
          containerColor="green"
          size={30}
        />
        <View>
          <Text
            style={{
              marginTop: 10,
              fontSize: RFValue(16),
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
            You have successfully transferred money from ONEBank App
          </Text>
        </View>
      </>
    ) : (
      <>
        <Title style={{fontWeight: 'bold'}}>Unsuccessful Payment</Title>
        <IconButton
          icon="close-circle-outline"
          iconColor="red"
          containerColor="rgba(255, 0, 0, 0.2)"
          size={30}
        />
        <View>
          <Text
            style={{
              marginTop: 10,
              fontSize: RFValue(16),
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
            Your transaction could not be completed. Please try again.
          </Text>
        </View>
      </>
    )}

    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.linkText}>
        {status === 'AcceptedSettlementCompleted'
          ? 'VRP Consents'
          : 'Retry Transaction'}
      </Text>
    </TouchableOpacity>
  </View>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 40,
  },

  linkText: {
    backgroundColor: '#c8e1cc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30,
    fontSize: RFValue(18),
    borderRadius: 8,
  },
};

export default VRPDetails;
