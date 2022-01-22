const { writeFileSync } = require('fs');
const { generateKeyPairSync } = require('crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: ''
  }
});

writeFileSync(`${process.cwd()}/keys/private.pem`, privateKey);
writeFileSync(`${process.cwd()}/keys/public.pem`, publicKey);