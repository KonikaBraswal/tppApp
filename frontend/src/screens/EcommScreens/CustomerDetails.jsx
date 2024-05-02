import { Image } from "react-native-elements";


const CustomerDetails=({customerDetails})=>{

    return (
        <View>
            <Image source={require('../../assets/images/ecomm-images/customer.jpeg')}></Image>

            <Text>
                Your data has been shared
            </Text>
            
        </View>
    );
};

export default CustomerDetails;