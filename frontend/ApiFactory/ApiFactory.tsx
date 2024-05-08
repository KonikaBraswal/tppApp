// ApiFactory.ts
import MockApiFactory from './MockApiFactory';
import SanboxApiFactory from './SandboxApiFactory';
class ApiFactory {
  createApiClient(type: string, scope:any) {
    switch (type) {
      case 'sandbox':
        console.log(type);
        return new SanboxApiFactory(scope);
      // Add other cases if needed
      case 'local':
        console.log(type,"API Factory");
        return new MockApiFactory(scope
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
