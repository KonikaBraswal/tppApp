// ApiFactory.ts
import config from '../configs_AISP/config.json';
import SanboxApiClient from './SanboxApiClient';
//import RestApiClient from "./RestApiClient"; // Import the missing RestApiClient

let permissions: string[] = [];

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

  createApiClient(type: string) {
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
        return new SanboxApiClient(
          this.baseUrl,
          this.clientId,
          this.clientSecret,
          this.commonHeaders, // Assuming RestApiClient uses commonHeaders, adjust accordingly
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
