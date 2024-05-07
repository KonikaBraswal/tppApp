// ApiFactory.ts
import MockApiFactory from './MockApiFactory';
import SanboxApiFactory from './SandboxApiFactory';
class ApiFactory {
  createApiClient(type: string) {
    switch (type) {
      case 'sandbox':
        console.log(type);
        return new SanboxApiFactory('accounts'
        );
      // Add other cases if needed
      case 'local':
        console.log(type,"API Factory");
        return new MockApiFactory('accounts'
        );
      case 'sit':
        return new MockApiFactory('accounts'
        );
      default:
        console.log("Invalid Type ",type);
        throw new Error(`Invalid API client type: ${type}`);
    }
  }
}

export default ApiFactory;
