import React, { useState } from "react";
import { List, Icon } from "react-native-paper";
import { Surface, Stack, ListItem, TextInput } from "@react-native-material/core"; // assuming you have a TextInput component
import readCustomerData from '../../DatabaseFactory/MockData/customerprofile.json';
import { TouchableOpacity } from "react-native-gesture-handler";

const CustomerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(formattedAddress);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
  };

  // Construct the full name, handling the case where middle_names is null
  const fullName = readCustomerData.data.name.given_name +
    (readCustomerData.data.name.middle_names ? " " + readCustomerData.data.name.middle_names : "") +
    " " + readCustomerData.data.name.family_name;

  const address = (readCustomerData.data.address.residence.line1 ? readCustomerData.data.address.residence.line1 : "") +
    (readCustomerData.data.address.residence.line2 ? ", " + readCustomerData.data.address.residence.line2 : "") +
    (readCustomerData.data.address.residence.line3 ? ", " + readCustomerData.data.address.residence.line3 : "") +
    (readCustomerData.data.address.residence.line4 ? ", " + readCustomerData.data.address.residence.line4 : "") +
    (readCustomerData.data.address.residence.line5 ? ", " + readCustomerData.data.address.residence.line5 : "") +
    (readCustomerData.data.address.residence.country ? ", " + readCustomerData.data.address.residence.country : "") +
    (readCustomerData.data.address.residence.postalCode ? ", " + readCustomerData.data.address.residence.postalCode : "");

  const formattedAddress = address.startsWith(', ') ? address.substring(2) : address;

  return (
    <Stack fill center spacing={4}>
      <Surface
        elevation={6}
        category="medium"
        style={{ width: '90%', height: '90%', backgroundColor: '#c8e1cc' }}
      >
        <Surface elevation={6} category="medium" style={{ width: '100%', height: '15%', backgroundColor: '#c8e1cc', justifyContent: 'center' }}>
          <List.Item
            title={fullName}
            titleStyle={{ fontSize: 20 }}
            left={props => <List.Icon {...props} icon={() => <Icon source="account" color="black" size={40} />} />}
          />
        </Surface>
        <Surface elevation={6}
          category="medium"
          style={{ width: '95%', height: '18%', margin: 10, marginTop: 50 }}>
          <List.Item
            title={`Deliver to`}
            description={
              isEditing ?
                <TextInput
                  value={description}
                  style={{backgroundColor:'white'}}
                  onChangeText={handleDescriptionChange}
                /> :
                formattedAddress
            }
            titleStyle={{ fontSize: 20 }}
            right={props => (
              <TouchableOpacity  onPress={toggleEditing}>
              <List.Icon
                {...props}
                icon={() => <Icon source="pencil" color="black" size={25} />}
                onPress={toggleEditing}
              />
              </TouchableOpacity>
            )}
          />
        </Surface>
        <Surface elevation={6}
          category="medium"
          style={{ width: '95%', height: '35%', marginTop: 50, margin: 10 }}>
          <List.Item
            title={`Contact Details`}
            titleStyle={{ fontSize: 20 }}
          />
          <ListItem title={readCustomerData.data.contactDetails.email} leading={
            <Icon source="email" color="black" size={20} />
          } />
          <ListItem title={readCustomerData.data.contactDetails.home_phone_number} leading={
            <Icon source="phone-classic" color="black" size={20} />
          } />
          <ListItem title={readCustomerData.data.contactDetails.mobile_phone_number} leading={
            <Icon source="phone" color="black" size={20} />
          } />

        </Surface>
      </Surface>
    </Stack>
  );
};

export default CustomerProfile;
