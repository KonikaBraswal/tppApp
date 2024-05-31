import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage helper functions
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`${key} stored successfully`);
  } catch (error) {
    console.error(`Error storing ${key}: `, error);
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log(`${key} retrieved successfully`);
      return JSON.parse(value);
    }
    console.log(`${key} not found`);
    return null;
  } catch (error) {
    console.error(`Error retrieving ${key}: `, error);
  }
};

const deleteData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`${key} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting ${key}: `, error);
  }
};

// Initialization functions
export const initDatabase = async () => {
  await storeData('userconsent_sandbox', []);
};

export const initDatabaseCA = async () => {
  await storeData('CA_sandbox', []);
};

export const initDatabaseTransaction = async () => {
  await storeData('vrpTransactions_sandbox', []);
};

// Add details functions
export const addDetails = async (details) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  const userconsentData = await getData('userconsent_sandbox') || [];
  userconsentData.push(details);
  await storeData('userconsent_sandbox', userconsentData);
};

export const addDetailsCA = async (details) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  const caData = await getData('CA_sandbox') || [];
  caData.push(details);
  await storeData('CA_sandbox', caData);
};

export const addTransactions = async (details) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.date = currentDate;
  details.time = currentTime;

  const transactionsData = await getData('vrpTransactions_sandbox') || [];
  transactionsData.push(details);
  await storeData('vrpTransactions_sandbox', transactionsData);
};

// Update details functions
export const updateDetails = async (details, userId, columnsToUpdate) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  let userconsentData = await getData('userconsent_sandbox') || [];
  userconsentData = userconsentData.map((item) => {
    if (item.userId === userId) {
      columnsToUpdate.forEach((column) => {
        item[column] = details[column];
      });
      item.last_updated_date = currentDate;
      item.last_updated_time = currentTime;
    }
    return item;
  });

  await storeData('userconsent_sandbox', userconsentData);
};

export const updateDetailsForVrp = async (details, consentid, columnsToUpdate) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  let vrpData = await getData('vrpTransactions_sandbox') || [];
  vrpData = vrpData.map((item) => {
    if (item.consentid === consentid) {
      columnsToUpdate.forEach((column) => {
        item[column] = details[column];
      });
      item.last_updated_date = currentDate;
      item.last_updated_time = currentTime;
    }
    return item;
  });

  await storeData('vrpTransactions_sandbox', vrpData);
};

export const updateDetailsForCVrp = async (details, consentid, columnsToUpdate) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  let caData = await getData('CA_sandbox') || [];
  caData = caData.map((item) => {
    if (item.consentid === consentid) {
      columnsToUpdate.forEach((column) => {
        item[column] = details[column];
      });
      item.last_updated_date = currentDate;
      item.last_updated_time = currentTime;
    }
    return item;
  });

  await storeData('CA_sandbox', caData);
};

// Retrieve data functions
export const RetrieveData = async () => {
  return await getData('userconsent_sandbox');
};

export const RetrieveDataforVrp = async () => {
  const data = await getData('vrpTransactions_sandbox');
  return data ? data.filter(row => row.consentid === 'VRP-4206f31b-5d57-411b-86a3-bd86bcc42f49') : [];
};

export const fetchTransactionsForUserConsent = async (consentid) => {
  const data = await getData('vrpTransactions_sandbox');
  return data ? data.filter(row => row.consentid === consentid && row.status === 'AcceptedSettlementCompleted') : [];
};

export const fetchAllDataforScope = async (scope) => {
  const data = await getData('userconsent_sandbox');
  return data ? data.filter(row => row.scope === scope && row.status === 'Authorised').map(row => ({
    consentid: row.consentid,
    consentpayload: row.consentpayload,
    refreshtoken: row.refreshedtoken,
    vrppayload: row.account_details,
  })) : [];
};

export const fetchAllDataforScopeCA = async (scope) => {
  const data = await getData('CA_sandbox');
  return data ? data.filter(row => row.scope === scope) : [];
};

export const fetchRefreshedToken = async (userId) => {
  const data = await getData('userconsent_sandbox');
  const user = data ? data.find(row => row.userId === userId) : null;
  if (user) {
    globalRefreshedToken = user.refreshedtoken;
    return user.refreshedtoken;
  } else {
    globalRefreshedToken = null;
    return null;
  }
};

// UI functions
export const displayResults = async () => {
  const data = await RetrieveData();
  console.log('Retrieved data:', data);
};

const deleteAllEntries = async () => {
  await storeData('CA_sandbox', []);
};

const deleteDatabase = async () => {
  await AsyncStorage.clear();
};

export var globalRefreshedToken;

export const processRefreshedToken = () => {
  console.log('Refreshed Token:', globalRefreshedToken);
};

const Database = () => {
  return (
    <View>
      <Text>AsyncStorage Database</Text>
      <Button title="Display Results" onPress={displayResults} />
      <Button title="Delete All Entries" onPress={deleteAllEntries} />
      <Button title="Delete Database" onPress={deleteDatabase} />
    </View>
  );
};

export default Database;

