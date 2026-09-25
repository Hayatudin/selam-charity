// cPanel Phusion Passenger Entry Point
const path = require('path');

// 1. Preserve Passenger's injected port/socket
const passengerPort = process.env.PORT;

// 2. Load environment variables from .env if dotenv is installed
try {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '.env') });
} catch (e) {
  console.warn('⚠️ dotenv module not found yet.');
}

// 3. Ensure Passenger's socket/port takes absolute precedence
if (passengerPort) {
  process.env.PORT = passengerPort;
}

require('./dist/index.js');
