const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SMART_CONTRACT_NETWORK = process.env.SMART_CONTRACT_NETWORK || 'development';

var constants = {
  JWT_SECRET: JWT_SECRET,
  SMART_CONTRACT_NETWORK: SMART_CONTRACT_NETWORK,
}

module.exports = constants;