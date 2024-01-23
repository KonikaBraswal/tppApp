// import React from "react";
// import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from "react-native";
// import { Divider, Surface, FAB } from "@react-native-material/core";
// import { Icon } from 'react-native-paper';

// const Landing = () => {
//   const cards = [
//     { id: 1, name: "Natwest", icon: require("../assets/icons/natwest.png") },
//     { id: 2, name: "Barclays", icon: require("../assets/icons/barclays.png") },
//     { id: 3, name: "Lloyds", icon: require("../assets/icons/lloyds.png") },
//     { id: 5, name: "Monzo", icon: require("../assets/icons/monzo.png") },
//     { id: 6, name: "Santander", icon: require("../assets/icons/santander.png") },
//   ];

//   const renderCard = ({ item }) => (
//     <Surface elevation={6} category="medium" style={styles.surface}>
//       <Image source={item.icon} style={styles.icon} />
//     </Surface>
//   );

//   const cardWidth = 75; // Adjust the width of your cards
//   const snapToInterval = cardWidth + 10; // Including margin between cards
//   const Payments = { name: 'Payments', image: require("../assets/icons/payments.png") };
//   const VRP = { name: 'VRP', image: require("../assets/icons/VRP.png") };

//   return (
//     <View style={styles.container}>
//       <Divider style={{ marginLeft: 10 }} leadingInset={16} />
//       <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black', margin: 10 }}>Added Banks</Text>
//       <Divider style={{ marginTop: 10 }} leadingInset={16} />
//       <FlatList
//         data={cards}
//         renderItem={renderCard}
//         keyExtractor={(item) => String(item.id)}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         pagingEnabled
//         snapToInterval={snapToInterval}
//         contentContainerStyle={styles.flatListContainer}
//       />
//       <View style={styles.bottomContainer}>
//         <Image style={styles.addbank} source={require("../assets/icons/bank.png")} />
//         <FAB
//           icon={() => <Icon
//             source="plus"
//             color="white"
//             size={20}
//           />}
//           style={{ alignSelf: "center", backgroundColor: "black", marginTop: 10 }}
//         />
//         <Text style={{ marginBottom: 10 }} >Add Bank Account</Text>
//       </View>
//       <View style={styles.lastrowBackground}>
//         <View style={styles.lastrow}>
//           <TouchableOpacity>
//             <Surface elevation={1} category="medium" style={styles.cardsurface}>
//               <Text style={{fontWeight:'bold',marginTop:10}}>Payments</Text>
//               <Image source={Payments.image} style={styles.images} />
//             </Surface>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Surface elevation={1} category="medium" style={styles.cardsurface}>
//               <Text style={{fontWeight:'bold',marginTop:10}}>VRP</Text>
//               <Image source={VRP.image} style={styles.images} />
//             </Surface>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",// Set the background color to #5a28d for the entire screen
//   },
//   surface: {
//     width: 75,
//     height: 75,
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 15,
//   },
//   icon: {
//     width: 70,
//     height: 70,
//     resizeMode: 'contain',
//   },
//   addbank: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   flatListContainer: {
//     paddingHorizontal: 10, // Adjust the horizontal padding
//   },
//   bottomContainer: {
//     alignSelf: 'center',
//     alignItems: 'center',
//   },
//   lastrowBackground: {
//     position: 'absolute',
//         bottom : 0, // Adjust the top position as needed
//         width: '100%', // Adjust the width as needed
//         height: 300, // Adjust the height as needed
//         backgroundColor: '#5a287d',
//         borderRadius: 10, // Add borderRadius for a rounded corner effect
//   },
//   lastrow: {
//     flexDirection: "row",
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   cardsurface: {
//     width: 120, // Adjust the width of the card surface
//     height: 120, // Adjust the height of the card surface
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 15,
//   },
//   images: {
//     width: 110, // Adjust the width of the image
//     height: 110, // Adjust the height of the image
//     resizeMode: 'contain',
//   }
// });

// export default Landing;


import React from "react";
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Divider, Surface, FAB } from "@react-native-material/core";
import { Icon } from 'react-native-paper';

const Landing = () => {
  const cards = [
    { id: 1, name: "Natwest", icon: require("../assets/icons/natwest.png") },
    { id: 2, name: "Barclays", icon: require("../assets/icons/barclays.png") },
    { id: 3, name: "Lloyds", icon: require("../assets/icons/lloyds.png") },
    { id: 5, name: "Monzo", icon: require("../assets/icons/monzo.png") },
    { id: 6, name: "Santander", icon: require("../assets/icons/santander.png") },
  ];

  const renderCard = ({ item }) => (
    <Surface elevation={6} category="medium" style={styles.surface}>
      <Image source={item.icon} style={styles.icon} />
    </Surface>
  );

  const cardWidth = 75; // Adjust the width of your cards
  const snapToInterval = cardWidth + 10; // Including margin between cards
  const Payments = { name: 'Payments', image: require("../assets/icons/payments.png") };
  const VRP = { name: 'VRP', image: require("../assets/icons/VRP.png") };

  return (
    <View style={styles.container}>
      <Divider style={{ marginLeft: 10 }} leadingInset={16} />
      <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black', margin: 10 }}>Added Banks</Text>
      <Divider style={{ marginTop: 10 }} leadingInset={16} />
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={snapToInterval}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.addBankContainer}>
        <Image style={styles.addbank} source={require("../assets/icons/bank.png")} />
        <FAB
          icon={() => <Icon
            source="plus"
            color="white"
            size={20}
          />}
          style={{ alignSelf: "center", backgroundColor: "black", marginTop: 10 }}
        />
        <Text style={{ marginBottom: 10 }} >Add Bank Account</Text>
      </View>
      <View style={styles.lastrowBackground}>
        <View style={styles.lastrow}>
          <TouchableOpacity>
            <Surface elevation={1} category="medium" style={styles.cardsurface}>
              <Text style={{ color:"black",fontWeight: 'bold', marginTop: 10 }}>Payments</Text>
              <Image source={Payments.image} style={styles.images} />
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity>
            <Surface elevation={1} category="medium" style={styles.cardsurface}>
              <Text style={{  color:"black",fontWeight: 'bold', marginTop: 10 }}>VRP</Text>
              <Image source={VRP.image} style={styles.images} />
            </Surface>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5a28d",
  },
  surface: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  addbank: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  addBankContainer: {
    alignItems: 'center',
  },
  lastrowBackground: {
    backgroundColor: '#5a287d',
    width:'100%',
    height:300,
    borderRadius: 10,
    marginTop:100
  },
  lastrow: {
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cardsurface: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  images: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
});

export default Landing;

