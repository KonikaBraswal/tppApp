// ApiFactory.ts
import axios from 'axios';
import config from '../configs_AISP/config.json';
import sandboxConfig from '../configs_AISP/Sandbox.json';
import {Linking} from 'react-native';
import {TextInput, Button, View, Text} from 'react-native';
import SanboxApiClient from './SanboxApiClient';
import '../global.js';
import MockApiClient from './MockApiClient';
//import RestApiClient from "./RestApiClient"; // Import the missing RestApiClient
// console.log("inside api factoryuuyyyyyyyyyyyyyyy",global.env);
let permissions: string[] = [];
// console.log(global.env);


class ApiFactory {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: string;

  constructor() {
    this.baseUrl = config.baseUrl;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.commonHeaders = config.contentType;
  }
  // type=global.env;
  createApiClient(type:string) {
    console.log("typeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",type);
    switch (type) {
      case 'sandbox':
        return new SanboxApiClient(
          this.baseUrl,
          this.clientId,
          this.clientSecret,
          this.commonHeaders,
        );
      // Add other cases if needed
      case 'local':
        return new MockApiClient(
        );
      case 'sit':
        return new SanboxApiClient(
          this.baseUrl,
          this.clientId,
          this.clientSecret,
          this.commonHeaders, // Assuming RestApiClient uses commonHeaders, adjust accordingly
        );
      default:
        throw new Error(`Invalid API client type: ${type}`);
    }
  }
}

export default ApiFactory;
