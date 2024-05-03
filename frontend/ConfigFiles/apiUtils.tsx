const uuid = require('uuid');
const config = require('../configs_AISP/config.json');
const configVRP = require('../configs_VRP/configvrp.json');

const sandboxConfig = require('../configs_AISP/Sandbox.json');

interface CommonHeaders {
  [key: string]: string;
}

//common utils---------------------------------------------------

export function generateHeaders(
  endpoint: string,
  accessToken: string | null = null,
  commonHeaders: CommonHeaders,
): CommonHeaders {
  switch (endpoint) {
    case sandboxConfig.tokenEndpoint:
      return {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...commonHeaders,
      };
    case sandboxConfig.accountRequestEndpoint:
    case sandboxConfig.accountsEndpoint:
    case sandboxConfig.accountRequestEndpointAisp:
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...commonHeaders,
      };
    case sandboxConfig.accountRequestEndpointPisp:
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-fapi-financial-id': sandboxConfig.financialId,
        'x-jws-signature': sandboxConfig.signatureJws,
        'x-idempotency-key': uuid.v4(),
        ...commonHeaders,
      };
    default:
      return commonHeaders;
  }
}

export function generateAccessTokenBody(
  grantType: any,
  clientId: any,
  clientSecret: any,
  scope: any,
) {
  return {
    grant_type: grantType,
    client_id: clientId,
    client_secret: clientSecret,
    scope: scope,
  };
}

export function generateAccountRequestHeaders(apiAccessToken: string) {
  return {
    ...configVRP.vrpHeaders,
    Authorization: `Bearer ${apiAccessToken}`,
    'x-idempotency-key': uuid.v4(),
  };
}

export function generateAccessTokenHeaders(commonHeaders: any) {
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    ...commonHeaders,
  };
}

const generateBody = (
  endpoint: string,
  data: Record<string, any>,
  permissions: string[],
): Record<string, any> => {
  switch (endpoint) {
    case sandboxConfig.tokenEndpoint:
      return {
        grant_type: sandboxConfig.grant_type,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: sandboxConfig.scope,
      };
    case sandboxConfig.accountRequestEndpoint:
      return {
        Data: {
          Permissions: permissions,
        },
        Risk: {},
      };
    default:
      return data;
  }
};

export function generateBodyForExchange(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  grantType: string,
  code: string,
): Record<string, string> {
  return {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: grantType,
    code: code,
  };
}
export function generateBodyForRefresh(
  clientId: string,
  clientSecret: string,
  grantType: string,
  refreshToken: string,
): Record<string, string> {
  return {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  };
}

//pisp utils--------------------------------------------------

interface PaymentBodyData {
  Data: {
    Initiation: {
      InstructionIdentification: string;
      EndToEndIdentification: string;
      InstructedAmount: {
        Amount: string;
        Currency: string;
      };
      DebtorAccount: any;
      CreditorAccount: {
        SchemeName: string;
        Identification: string;
        Name: string;
        SecondaryIdentification: string;
      };
      RemittanceInformation: {
        Unstructured: string;
        Reference: string;
      };
      ConsentId?: string;
    };
  };
  Risk: {
    PaymentContextCode: string;
    MerchantCategoryCode: any;
    MerchantCustomerIdentification: any;
    DeliveryAddress: any;
  };
}

export function generatePaymentStatusHeaders(apiAccessToken: string): {
  [key: string]: string;
} {
  return {
    Authorization: `Bearer ${apiAccessToken}`,
    'x-fapi-financial-id': sandboxConfig.financialId,
  };
}

export function generateHeadersForPisp(
  accessToken: string,
  id: string,
  financialId: string,
  signatureJws: string,
): CommonHeaders {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'x-fapi-financial-id': financialId,
    'x-jws-signature': signatureJws,
    'x-idempotency-key': id,
  };
}

export function generateBodyForPaymentRequest(
  debtorAccount: any,
  isPayment: boolean,
  consentID: string,
): PaymentBodyData {
  const body: PaymentBodyData = {
    Data: {
      Initiation: {
        InstructionIdentification: 'instr-identification',
        EndToEndIdentification: 'e2e-identification',
        InstructedAmount: {
          Amount: '1.00',
          Currency: 'GBP',
        },
        DebtorAccount: debtorAccount,
        CreditorAccount: {
          SchemeName: 'IBAN',
          Identification: 'BE56456394728288',
          Name: 'ACME DIY',
          SecondaryIdentification: 'secondary-identif',
        },
        RemittanceInformation: {
          Unstructured: 'Tools',
          Reference: 'Tools',
        },
      },
    },
    Risk: {
      PaymentContextCode: 'EcommerceGoods',
      MerchantCategoryCode: null,
      MerchantCustomerIdentification: null,
      DeliveryAddress: null,
    },
  };

  if (isPayment) {
    body.Data.Initiation.ConsentId = consentID;
  }

  return body;
}

export function generateDomesticPaymentRequestBody(
  consentID: string,
  debtorAccount: any,
  creditorAccount: any,
  paymentContextCode: string,
): any {
  return {
    Data: {
      ConsentId: consentID,
      Initiation: {
        InstructionIdentification: 'instr-identification',
        EndToEndIdentification: 'e2e-identification',
        InstructedAmount: {
          Amount: '1.00',
          Currency: 'GBP',
        },
        DebtorAccount: debtorAccount,
        CreditorAccount: creditorAccount,
        RemittanceInformation: {
          Unstructured: 'Tools',
          Reference: 'Tools',
        },
      },
    },
    Risk: {
      PaymentContextCode: paymentContextCode,
    },
  };
}

export function generateDomesticConsentHeaders(
  accessToken: string,
  financialId: string,
) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'x-fapi-financial-id': financialId,
  };
}

//vrp utils-------------------------------------------------

export function generateVrpPaymentBody(formData: any, consentId: string) {
  const Identification = formData.accountNumber + formData.sortCode;
  return {
    Data: {
      ConsentId: consentId,
      PSUAuthenticationMethod: 'UK.OBIE.SCANotRequired',
      Initiation: {
        CreditorAccount: {
          SchemeName: 'SortCodeAccountNumber',
          Identification: Identification,
          Name: formData.firstName,
          SecondaryIdentification: 'secondary-identif',
        },
        RemittanceInformation: {
          Unstructured: 'Tools',
          Reference: formData.reference,
        },
      },
      Instruction: {
        InstructionIdentification: 'instr-identification',
        EndToEndIdentification: 'e2e-identification',
        InstructedAmount: {
          Amount: formData.amount,
          Currency: 'GBP',
        },
        CreditorAccount: {
          SchemeName: 'SortCodeAccountNumber',
          Identification: Identification,
          Name: formData.firstName,
          SecondaryIdentification: 'secondary-identif',
        },
        RemittanceInformation: {
          Unstructured: 'Tools',
          Reference: formData.reference,
        },
      },
    },
    Risk: {},
  };
}

const generateVrpAccountRequestHeaders = (
  apiAccessToken: any,
  financialId: any,
) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiAccessToken}`,
    'x-fapi-financial-id': financialId
      ? financialId
      : sandboxConfig.financialId,
    'x-jws-signature': sandboxConfig.signatureJws,
  };
};

module.exports = {
  generateVrpAccountRequestHeaders,
  generateVrpPaymentBody,
  generateDomesticConsentHeaders,
  generateAccessTokenBody,
  generateAccountRequestHeaders,
  generateHeaders,
  generateBody,
  generateBodyForExchange,
  generateBodyForRefresh,
  generateBodyForPaymentRequest,
  generateHeadersForPisp,
  generateDomesticPaymentRequestBody,
  generatePaymentStatusHeaders,
};
