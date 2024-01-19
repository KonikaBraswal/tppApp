// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";

// const App = () => {
//   const clientid="E5t8THqOBzaFVmAJS0TZJDzMTybULU_s6egSniBXoGY";
//   const clientSecret="_TwFnBaQJNQqbrNJPDY9yhnudD3yHcgVJ6aDjN0eXlo";
//   const consentUrl = "https://api.sandbox.natwest.com/authorize";
//   const redirectUri = encodeURIComponent("http://localhost:8080");

//   const handleButtonClick = async () => {
//     try {
//       const response = await fetch("https://ob.sandbox.natwest.com/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: "grant_type=client_credentials&client_id=E5t8THqOBzaFVmAJS0TZJDzMTybULU_s6egSniBXoGY=&client_secret=_TwFnBaQJNQqbrNJPDY9yhnudD3yHcgVJ6aDjN0eXlo=&scope=accounts",
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Token Response:", data.access_token);

        

//         // Use the obtained access_token for the authenticated request
//         const authResponse = await fetch(
//           "https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/account-access-consents",
//           {
//             method: "POST",
//             //mode:'cors',
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${data.access_token}`,
//             },
//             body: JSON.stringify({
//               Data: {
//                 Permissions: [
//                   "ReadAccountsDetail",
//                   "ReadBalances",
//                   "ReadTransactionsCredits",
//                   "ReadTransactionsDebits",
//                   "ReadTransactionsDetail",
//                 ],
//               },
//               Risk: {},
//             }),
//           }
//         );

//         if (authResponse.ok) {
//           const authData = await authResponse.json();
//           console.log("Consent Id", authData.Data.ConsentId);
          
        

//           // Step 3: Replace URL with variables
//           const consentUrlWithVariables = `${consentUrl}?client_id=${clientid}=&response_type=code id_token&scope=openid accounts&redirect_uri=${redirectUri}&request=${authData.Data.ConsentId}`;

//           // Print the URL with variables
//           console.log(
//             "Step 3 - Consent URL with Variables:",
//             consentUrlWithVariables
//           );

//           Linking.openURL(consentUrlWithVariables); // or 'https://www.google.com'


//           Alert.alert("Success", "Authenticated request sent successfully");
//         } else {
//           // Handle errors in authenticated request
//           Alert.alert("Error", "Failed to fetch data with access token");
//         }
//       } else {
//         // Handle errors in token request
//         Alert.alert("Error", "Failed to fetch token");
//       }
//     } catch (error) {
//       // Handle network errors
//       console.error("Error:", error);
//       Alert.alert("Error", "Network error");
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>React Native Button Example</Text>
//       <Button onPress={handleButtonClick} />
//     </View>
//   );
// };

// const Button = ({ onPress }) => {
//   return (
//     <TouchableOpacity onPress={onPress}>
//       <View
//         style={{
//           backgroundColor: "blue",
//           padding: 10,
//           borderRadius: 5,
//           marginTop: 10,
//         }}
//       >
//         <Text style={{ color: "white" }}>Click me</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default App;