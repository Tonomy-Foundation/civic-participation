const accountController = require('../controllers/accounts.controller');
const AccountType = require('../models/account.type');
const Accountability = require('../services/Accountability');
const ecc = require('eosjs-ecc');
const crypto = require('crypto')


let accountability = new Accountability();

/**
 * Creates an account if it does not exist and add they common name to the database
 * @param {string} accountName
 * @param {string} pubKey
 * @param {string} commonName
 * @return {AccountExtended}
 */
module.exports = async function(req, res, next) {
    const accountName = req.body.accountName
    const commonName = req.body.commonName
    const pubKey = req.body.pubKey

    const privKey = keyFromName('yvo', 'Password123').privKey

    accountability.login({
        name: 'yvo',
        permission: 'active',
        privKey: privKey,
    })

    await createNewPerson(accountability, accountName, commonName, pubKey);

    const blockchainAccount = await accountability.getAccount(accountName);

    const accountExtendedObject = {...blockchainAccount, commonName: commonName, type: AccountType.Human, isGov: false }

    res.send(accountExtendedObject);
}

module.exports.createNewPerson = createNewPerson;
module.exports.keyFromName = keyFromName;

async function createNewPerson(accountability, accountName, commonName, key) {
    const data = newPersonData("eosio", accountName, key, key);

    await accountability.transact("eosio", "newperson", data);
    await accountController.insert({
        accountName: accountName,
        commonName: commonName,
        accountType: AccountType.Human,
    });
    console.log("Person ", accountName, " created");
}

function newPersonData(creator, name, key, owner = "gov") {
    const data = {
        creator: creator,
        name: name,
        owner: {
            threshold: 1,
            keys: [],
            accounts: [{
                permission: {
                    actor: "gov",
                    permission: "active"
                },
                weight: 1
            }],
            waits: []
        },
        active: {
            threshold: 1,
            keys: [{
                key: key,
                weight: 1
            }],
            accounts: [],
            waits: []
        }
    }
    if (owner !== "gov") {
        data.owner.accounts = []
        data.owner.keys = [{
            key: owner,
            weight: 1
        }]
    }
    return data;
}

function keyFromName(name, password) {
    const privKey = ecc.seedPrivate(crypto.createHash("sha256").update(name + password).digest("hex"));
    return {
        privKey,
        pubKey: ecc.privateToPublic(privKey)
    }
}