import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AppBar, IconComponentProvider, Icon } from "@react-native-material/core";
import { MaterialCommunityIcons } from "@react-native-material/core";

const Header = ({ navigation }) => (
  <>
    <AppBar style={{backgroundColor:'#5a287d'}}title="Select your bank">
    </AppBar>
  </>
);

export default Header;
