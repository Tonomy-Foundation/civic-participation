const { default: fetch } = require('node-fetch');
const ssiClient = require('../ssi/ssi_client');
/**
 * Intercepts redirect from SSI provider to our app,
 * 1. decodes JWT
 * 2. add needed information in headers/response
 * 3. redirect the app to front-end
 * 
 */
module.exports = async function (req, res) {
    const {
        url: ssiServerUrl,
        clientId,
        callbackUrl,
        name: appName,
        credentialType
    } = ssiClient;
    // ssiServerUrl already contains '/' at the end
    const url = `${ssiServerUrl}api/utils/jwt/${clientId}`;
    const requestData = {
        credentialType,
        callbackUrl,
        sub: "credential-verify-request",
    };
    const data = JSON.stringify(requestData);
    console.log(data);
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if (response.status >= 400 && response.status < 600) {
                throw new Error('Bad response from server');
            }
            return response;
        })
        const token = await response.text();
        res.send({ token });
    } catch (e) {
        res.status(400).send(`Error creating token, ${e}`);
    }
}