
import AndroidClient from "./AndroidClient";
import WebClient from "./WebClient";
import DatabaseConfig from '../ConfigFiles/DatabaseConfig.json';
class DatabaseFactory {
    private company:string;
    private apiClient:string;


  constructor() {
    this.company=DatabaseConfig.companyName;
    this.apiClient=DatabaseConfig.apiClient;

  }

  createDatabaseClient(platform: string) {
    switch (platform) {
      case 'android':
        return new AndroidClient(
            this.company,
            this.apiClient,
          
        );
      case 'web':
        return new WebClient(
        );
      
      default:
        throw new Error(`Invalid API client type: ${platform}`);
    }
  }
}

export default DatabaseFactory;
