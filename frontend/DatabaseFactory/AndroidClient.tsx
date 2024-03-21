import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const androidDb=SQLite.openDatabase({name:'android.db',location:'default'})
class AndroidClient{
    private companyName: string;
    private apiClient: string;
  
    constructor(companyName: string, apiClient: string) {
      this.companyName = companyName;
      this.apiClient = apiClient;
    }

    
}
export default AndroidClient;