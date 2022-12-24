import { createMock } from '@golevelup/ts-jest';
import { Request, Response } from 'express';
import * as nacl from 'tweetnacl';
import { InteractionMiddleware } from './interaction.middleware';

// Example PING request body
const pingRequestBody = JSON.stringify({
  id: '338658045108770755',
  token: 'ThisIsATokenFromDiscordThatIsVeryLong',
  type: 1,
  version: 1
});
// Example APPLICATION_COMMAND request body
const applicationCommandRequestBody = JSON.stringify({
  id: '660457381700735858',
  token: 'ThisIsATokenFromDiscordThatIsVeryLong',
  type: 2,
  version: 1,
  data: {
    id: '508078358061543774',
    name: 'test'
  }
});

type SignedRequest = {
  body: string;
  signature: string;
  timestamp: string;
};

function signRequestWithKeyPair(body: string, privateKey: Uint8Array): SignedRequest {
  const timestamp = String(Math.round(new Date().getTime() / 1000));
  const signature = Buffer.from(
    nacl.sign.detached(Uint8Array.from(Buffer.concat([Buffer.from(timestamp), Buffer.from(body)])), privateKey)
  ).toString('hex');
  return {
    body,
    signature,
    timestamp
  };
}

describe('InteractionMiddleware', () => {
  // Generate a "valid" keypair
  const validKeyPair = nacl.sign.keyPair();
  // Generate an "invalid" keypair
  const invalidKeyPair = nacl.sign.keyPair();

  let mockRequest;
  let mockResponse;
  const nextFn = jest.fn();

  const middleware = new InteractionMiddleware(validKeyPair.publicKey);

  const sendExampleRequest = (headers: object, body = '{}') => {
    mockRequest = createMock<Request>({ headers, body: body as any, header: name => headers[name.toLowerCase()] });
    mockResponse = createMock<Response>();
    middleware.use(mockRequest, mockResponse, nextFn);
  };

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('verify key middleware', () => {
    it('valid ping', async () => {
      // Sign and verify a valid ping request
      const signedRequest = signRequestWithKeyPair(pingRequestBody, validKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': signedRequest.signature,
          'x-signature-timestamp': signedRequest.timestamp,
          'content-type': 'application/json'
        },
        signedRequest.body
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockResponse.end).toHaveBeenCalledWith(
        JSON.stringify({
          type: 1
        })
      );
    });

    it('valid application command', async () => {
      // Sign and verify a valid application command
      const signedRequest = signRequestWithKeyPair(applicationCommandRequestBody, validKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': signedRequest.signature,
          'x-signature-timestamp': signedRequest.timestamp,
          'content-type': 'application/json'
        },
        signedRequest.body
      );
      expect(mockRequest.body).toEqual(signedRequest.body);
      expect(nextFn).toHaveBeenCalled();
    });

    it('valid other body', async () => {
      // Sign and verify a valid application command
      const signedRequest = signRequestWithKeyPair(applicationCommandRequestBody, validKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': signedRequest.signature,
          'x-signature-timestamp': signedRequest.timestamp,
          'content-type': 'application/json'
        },
        JSON.parse(signedRequest.body) as any
      );
      expect(nextFn).toHaveBeenCalled();
    });

    it('invalid key', async () => {
      // Sign a request with a different private key and verify with the valid public key
      const signedRequest = signRequestWithKeyPair(pingRequestBody, invalidKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': signedRequest.signature,
          'x-signature-timestamp': signedRequest.timestamp,
          'content-type': 'application/json'
        },
        signedRequest.body
      );
      expect(mockResponse.statusCode).toBe(401);
    });

    it('invalid body', async () => {
      // Sign a valid request and verify with an invalid body
      const signedRequest = signRequestWithKeyPair(pingRequestBody, validKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': signedRequest.signature,
          'x-signature-timestamp': signedRequest.timestamp,
          'content-type': 'application/json'
        },
        'example invalid body'
      );
      expect(mockResponse.statusCode).toBe(401);
    });

    it('buffered body', async () => {
      // Sign a valid request and verify with buffer body
      const signedRequest = signRequestWithKeyPair(pingRequestBody, validKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': signedRequest.signature,
          'x-signature-timestamp': signedRequest.timestamp,
          'content-type': 'application/json'
        },
        Buffer.from(signedRequest.body) as any
      );
      expect(mockResponse.statusCode).not.toBe(401);
      expect(nextFn).toHaveBeenCalled();
    });

    it('streaming body', async () => {
      // Sign a valid request and verify with streaming body data
      const signedRequest = signRequestWithKeyPair(pingRequestBody, validKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': signedRequest.signature,
          'x-signature-timestamp': signedRequest.timestamp,
          'content-type': 'application/json'
        },
        null
      );
      mockRequest.emit('data', Buffer.from(signedRequest.body));
      mockRequest.emit('end');
      expect(mockRequest.on).toBeCalledWith('data', expect.any(Function));
      expect(mockRequest.on).toBeCalledWith('end', expect.any(Function));
    });

    it('invalid signature', async () => {
      // Sign a valid request and verify with an invalid signature
      const signedRequest = signRequestWithKeyPair(pingRequestBody, validKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': 'example invalid signature',
          'x-signature-timestamp': signedRequest.timestamp,
          'content-type': 'application/json'
        },
        signedRequest.body
      );
      expect(mockResponse.statusCode).toBe(401);
    });

    it('invalid timestamp', async () => {
      // Sign a valid request and verify with an invalid timestamp
      const signedRequest = signRequestWithKeyPair(pingRequestBody, validKeyPair.secretKey);
      sendExampleRequest(
        {
          'x-signature-ed25519': signedRequest.signature,
          'x-signature-timestamp': String(Math.round(new Date().getTime() / 1000) - 10000),
          'content-type': 'application/json'
        },
        signedRequest.body
      );
      expect(mockResponse.statusCode).toBe(401);
    });

    it('missing headers', async () => {
      // Verify a request without the required headers
      sendExampleRequest(
        {
          'content-type': 'application/json'
        },
        pingRequestBody
      );
      expect(mockResponse.statusCode).toBe(401);
    });
  });
});
