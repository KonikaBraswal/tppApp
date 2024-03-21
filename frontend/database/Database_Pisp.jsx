import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = 'pisp_database';

// Function to initialize the database if it doesn't exist
const initDatabase = async () => {
  try {
    const existingData = await AsyncStorage.getItem(DB_KEY);
    if (!existingData) {
      const initialData = {
        pisp_response: [],
      };
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(initialData));
    }
  } catch (error) {
    console.error('Error initializing database: ', error);
  }
};

// Function to add a new response to the database
const addResponse = async (response) => {
  try {
    const existingData = await AsyncStorage.getItem(DB_KEY);
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      parsedData.pisp_response.push(response);
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(parsedData));
    }
  } catch (error) {
    console.error('Error adding response to database: ', error);
  }
};

// Function to save consent ID into the database
const saveConsentId = async (consentId) => {
  try {
    const existingData = await AsyncStorage.getItem(DB_KEY);
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      parsedData.pisp_response.push({ consent_id: consentId });
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(parsedData));
    }
  } catch (error) {
    console.error('Error saving consent ID to database: ', error);
  }
};

// Initialize the database
initDatabase();

export { addResponse, saveConsentId };
