// For demo: generate with openssl
// openssl genrsa -out private.pem 2048
// openssl rsa -in private.pem -pubout -out public.pem

const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, '../../private.pem'));
const publicKey = fs.readFileSync(path.join(__dirname, '../../public.pem'));

module.exports = { privateKey, publicKey };
