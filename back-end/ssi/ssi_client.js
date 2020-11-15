const SSIClient = require('./SSIClient');

const SSIInfo = {
    "id": 3,
    "name": "civic-integration",
    "uuid": "74f4f840-4b6b-449d-b475-bdd2876b8b53"
};

const ssiCallbackUrl = 'https://civic.conscious-cities.com/ssi?response=';

const options = {
    name: SSIInfo.name,
    callbackUrl: ssiCallbackUrl,
};
// TODO: for now sharedSecret is empty but we will need this in future
const ssiClient = new SSIClient(SSIInfo.id, SSIInfo.sharedSecret, options);
ssiClient.credentialType = 'FullNameDataCredential';

module.exports = ssiClient;