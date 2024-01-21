import React, { useState, useEffect } from "react";
import { View,StyleSheet,Text} from "react-native";
import { Surface, Stack ,ListItem } from "@react-native-material/core";
import { Image} from "react-native";
import { TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import SelectBankStyle from "../styles/SelectBankStyles";
// import { SearchBar } from '@rneui/themed';
import {Searchbar} from "react-native-paper";
import Header from './Header';
import {Icon} from 'react-native-paper';

 const allbanks = [{ id: 1, name: "Natwest", icon: require("../assets/icons/natwest.png") },
{ id: 2, name: "Barclays", icon: require("../assets/icons/barclays.png") },
{ id: 3, name: "Lloyds", icon: require("../assets/icons/lloyds.png") },
{ id: 4, name: "HSBC", icon: require("../assets/icons/hsbc.png") },
{ id: 5, name: "Monzo", icon: require("../assets/icons/monzo.png") },
{ id: 6, name: "Santander", icon: require("../assets/icons/santander.png") },
{ id: 7, name: "Revolut", icon: require("../assets/icons/revolut.png") },
{ id: 8, name: "Starling", icon: require("../assets/icons/starling.png") },];

const SelectBank = () => {
// const navigation = useNavigation();
const [banklist, setbanklist] = useState([]);
useEffect(() => {
    setbanklist(allbanks);
}, []);
const [searchQuery, setSearchQuery] = React.useState("");
const [filteredBanks, setFilteredBanks] = useState(allbanks);
const onChangeSearch = (query) => {
setSearchQuery(query);
const filtered = allbanks.filter((bank) =>
bank.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
);
setFilteredBanks(filtered);
};
const handlePress = () => {
// navigation.navigate("ConsentScreen"); //routed to consentscreen
};
const rows = [];
for (let i = 0; i < filteredBanks.length; i += 3) {
const rowBanks = filteredBanks.slice(i, i + 3);
const row = (
<Stack key={`row_${i}`} direction="row" spacing={10} style={SelectBankStyle.row}>
{rowBanks.map((bank) => (
<TouchableOpacity key={bank.id} onPress={handlePress}>
<Surface elevation={8} category="medium" style={SelectBankStyle.surface}>
<Image source={bank.icon} style={SelectBankStyle.image} />
</Surface>
</TouchableOpacity>
 ))}
</Stack>
 );
rows.push(row);
}

return (
<>
<View>
<View style={{ backgroundColor: '#5a287d', padding: 30 }}>
  <Searchbar
    placeholder="Search"
    onChangeText={onChangeSearch}
    value={searchQuery}
    icon={() => <Icon
      source="magnify"
      color="black"
      size={20}
    />}
    style={{
      borderRadius: 5,
      backgroundColor: 'white', // Set white background for the input
      paddingLeft: 16, // Adjust padding as needed
      paddingRight: 16, // Adjust padding as needed
    }}

  />
</View>
<Header/>
</View>
<Text>Common Banks</Text>
<Stack fill left>
  {rows}
</Stack>
<Text>All Banks</Text>
</>
);
};
export default SelectBank;

const SelectBankStyle = StyleSheet.create({


    row: {

      flexDirection:"row",
      justifyContent:"space-evenly",

      alignItems:"flex-start",

      flexWrap:"wrap",

    },

    surface: {

      width: 110,

      height: 110,

      justifyContent: "center",

      alignItems: "center",

      borderWidth: 0.1,

      borderColor: "black",
      margin:5

    },

    image: {

      width: 100,

      height: 100,

      resizeMode: "contain",

      // flexWrap:"wrap"

    },

  }

);
