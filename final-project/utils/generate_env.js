import fs from 'fs';
import crypto from 'crypto';

const secret = crypto.randomBytes(48).toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .substring(0, 64);

const pepper = crypto.randomBytes(32).toString('hex');

const envContent = `PORT=8000
SECRET="${secret}"
PEPPER="${pepper}"
`;

fs.writeFileSync('.env', envContent);
console.log('.env file generated successfully!');