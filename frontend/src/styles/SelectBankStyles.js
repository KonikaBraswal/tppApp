import { StyleSheet } from "react-native"

const SelectBankStyle = StyleSheet.create({

    container: {

      flex: 1,

      justifyContent: "center",

      alignItems: "center",

    },

    row: {

      justifyContent: "center",

      alignItems: "center",

      flexWrap:"wrap",

      marginHorizontal: -5,

    },

    surface: {

      width: 110,

      height: 110,

      justifyContent: "center",

      alignItems: "center",

      borderWidth: 1,

      borderColor: "white",

      borderRadius: 5,

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

export default SelectBankStyle;