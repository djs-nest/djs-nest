import * as nacl from 'tweetnacl';
import { concatUint8Arrays, valueToUint8Array } from './uint.util';

/**
 * Validates a payload from Discord against its signature and key.
 *
 * @param rawBody - The raw payload data
 * @param signature - The signature from the `X-Signature-Ed25519` header
 * @param timestamp - The timestamp from the `X-Signature-Timestamp` header
 * @param clientPublicKey - The public key from the Discord developer dashboard
 * @returns Whether or not validation was successful
 */
export function verifyKey(
  rawBody: Uint8Array | ArrayBuffer | Buffer | string,
  signature: Uint8Array | ArrayBuffer | Buffer | string,
  timestamp: Uint8Array | ArrayBuffer | Buffer | string,
  clientPublicKey: Uint8Array | ArrayBuffer | Buffer | string
): boolean {
  try {
    const timestampData = valueToUint8Array(timestamp);
    const bodyData = valueToUint8Array(rawBody);
    const message = concatUint8Arrays(timestampData, bodyData);

    const signatureData = valueToUint8Array(signature, 'hex');
    const publicKeyData = valueToUint8Array(clientPublicKey, 'hex');
    return nacl.sign.detached.verify(message, signatureData, publicKeyData);
  } catch (ex) {
    return false;
  }
}
