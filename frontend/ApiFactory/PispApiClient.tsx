import axios, {AxiosResponse} from 'axios';
import config from '../configs/config.json';
import sandboxConfig from '../configs/Sandbox.json';
import {Linking, Alert} from 'react-native';

class PispApiClient{
    private baseUrl: string;
    private clientId: string;
    private clientSecret: string;
    private commonHeaders: any; // Replace 'any' with the actual type of commonHeader
    constructor(
      baseUrl: string,
      clientId: string,
      clientSecret: string,
      commonHeaders: any,
    ) {
      this.baseUrl = baseUrl;
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.commonHeaders = commonHeaders;
    }

}
export default PispApiClient