const Accountability = require('../services/Accountability');
const accountability = new Accountability();
const ecc = require('eosjs-ecc');

module.exports.getAuthorizor = async function(req) {
    const { authname, authperm, authkey, authsignature, authdata } = req.headers;

    const blockchainAccount = await accountability.getAccount(authname);

    if (!blockchainAccount) {
        throw new Error('Authorizing account not found');
    }

    const blockchainActivePermission = blockchainAccount.permissions.find(element => element.perm_name === authperm);

    if (!blockchainActivePermission) {
        throw new Error('Authorizing account permission not found');
    }

    const signDate = new Date(authdata);
    const now = new Date();
    if (now.getTime() - signDate.getTime() > 15 * 1000) {
        throw new Error("Signature has expired");
    }

    if (!ecc.verify(authsignature, authdata, authkey)) throw new Error("Invalid signature")

    return {
        accountName: authname,
        permission: authperm
    }
}