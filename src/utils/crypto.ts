/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from 'crypto-js';

export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_CRYPTO_SECRET!
  ).toString();
};

export const decryptData = (ciphertext: string): any => {
  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    process.env.NEXT_PUBLIC_CRYPTO_SECRET!
  );
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};