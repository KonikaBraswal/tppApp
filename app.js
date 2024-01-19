// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import ApiFactory from './ApiFactory';
import AccountInfo from './AccountInfo'; // Import the new component

const App = () => {
  const apiFactory = new ApiFactory();
  const permissions = [
    "ReadAccountsDetail",
    "ReadBalances",
    "ReadTransactionsCredits",
    "ReadTransactionsDebits",
    "ReadTransactionsDetail",
  ];

  const [isModalVisible, setModalVisible] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [accountData, setAccountData] = useState(null);

  const handleButtonClick = async () => {
    try {
      const sandboxApiClient = apiFactory.createApiClient('sandbox');
      const data = await sandboxApiClient.retrieveAccessToken(permissions);
      console.log('Sandbox API 1 Data:', data);

      // Show modal to get user input
      setModalVisible(true);

    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const sandboxApiClient = apiFactory.createApiClient('sandbox');
      const start = userInput.indexOf('=') + 1;
      const end = userInput.indexOf('&');
      const authToken = userInput.slice(start, end);

      console.log(authToken);
      const account = await sandboxApiClient.exchangeAccessToken(authToken);

      console.log('Balance:', account);
      setAccountData(account); // Store account data in state
      setModalVisible(false);
    } catch (error) {
      console.error('Error:', error.message);
      // Handle the error as needed
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Fetch Balance</Text>
      <TouchableOpacity onPress={handleButtonClick}>
        <View
          style={{
            backgroundColor: 'blue',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'white' }}>Click me</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>Enter auth code</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
              onChangeText={(text) => setUserInput(text)}
              value={userInput}
            />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </Modal>

      {/* Use the AccountInfo component to display account data */}
      <AccountInfo accountData={accountData} />
    </View>
  );
};

export default App;




// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
// import ApiFactory from './ApiFactory';
// import config from './config.json';

// const App = () => {
//   const apiFactory = new ApiFactory();
//   const permissions = [
//     "ReadAccountsDetail",
//     "ReadBalances",
//     "ReadTransactionsCredits",
//     "ReadTransactionsDebits",
//     "ReadTransactionsDetail",
//   ];

//   const [isModalVisible, setModalVisible] = useState(false);
//   const [userInput, setUserInput] = useState('');

//   const handleButtonClick = async () => {
//     try {
//       const sandboxApiClient = apiFactory.createApiClient('sandbox');
//       const data = await sandboxApiClient.retrieveAccessToken(permissions);
//       console.log('Sandbox API 1 Data:', data);

//       // Show modal to get user input
//       setModalVisible(true);

//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//         const sandboxApiClient = apiFactory.createApiClient('sandbox');
//         const start=userInput.indexOf('=');
//         const end=userInput.indexOf('&');
//         const authToken=userInput.slice(start+1,end);
//         console.log(authToken);
//       const account = await sandboxApiClient.exchangeAccessToken(authToken);

//       console.log('Balance:', account);
//       setModalVisible(false);
//     } catch (error) {
//       console.error('Error:', error.message);
//       // Handle the error as needed
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Fetch Balance</Text>
//       <TouchableOpacity onPress={handleButtonClick}>
//         <View
//           style={{
//             backgroundColor: 'blue',
//             padding: 10,
//             borderRadius: 5,
//             marginTop: 10,
//           }}
//         >
//           <Text style={{ color: 'white' }}>Click me</Text>
//         </View>
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
//             <Text>Enter auth code</Text>
//             <TextInput
//               style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
//               onChangeText={(text) => setUserInput(text)}
//               value={userInput}
//             />
//             <Button title="Submit" onPress={handleSubmit} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default App;

