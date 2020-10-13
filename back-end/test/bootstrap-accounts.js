const mongoose = require('mongoose');

const Accountability = require('../services/Accountability');
const settings = require('../settings');
const accountController = require('../controllers/accounts.controller');
const { createNewPerson, keyFromName } = require('../routes/create_account');
const AccountType = require('../models/account.type');

let accountability = new Accountability();
let eosioAccount = {
    privKey: settings.eosio.accounts.eosio.privKey,
    name: "eosio",
    permission: "active"
}

async function main() {
    console.log("starting blockchain initialization");

    await mongoose.connect(settings.mongodb.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("Connected to database");

    // Set up the system contract
    await accountability.login(eosioAccount);
    await deploySystemContract();

    // Create some people
    await accountability.login(eosioAccount);
    await createNewPerson(accountability, "yvo", "Yvo Hunink", keyFromName('yvo', 'Password123').pubKey);
    await createNewPerson(accountability, "hidde", "Hidde Kamst", keyFromName('hidde', 'Password123').pubKey);
    await createNewPerson(accountability, "tijn", "Tijn Kyuper", keyFromName('tijn', 'Password123').pubKey);

    // Create some new orgs
    await createNewOrg("gov", "The Ministry of The Hague", ["hidde", "tijn", "yvo"], 0.66);
    await createNewOrg("civic", "Civic Participation Tool", ["gov"], 1);
    await createNewOrg('dfuseiohooks', "System event indexer", ["gov"], 1);

    // Update the system contract to be controlled by the government
    await updateEosioAuth();

    await accountability.login({
        privKey: keyFromName('yvo', 'Password123').privKey,
        name: 'civic',
        permission: 'active'
    });
    await deployCivicContract();

    // Set the abi of dfuseiohooks event handler account
    await accountability.login({
        privKey: keyFromName('yvo', 'Password123').privKey,
        name: 'dfuseiohooks',
        permission: 'active'
    });
    await deployDfuseiohooks();

    console.log("fin")
    process.exit(0)
}

Promise.resolve(main()).catch(err => {
    console.error(err)
    process.exit(1)
})


async function deploySystemContract() {
    await accountability.deploy("eosio", "../contracts/eosio.bios");
    console.log("eosio.bios contract deployed");
    await accountController.insert({
        accountName: "eosio",
        name: "System governance",
        accountType: AccountType.Org
    });
}

async function deployCivicContract() {
    await accountability.deploy("civic", "../contracts/civic");
    console.log("civic contract deployed");
}

async function deployDfuseiohooks() {
    await accountability.setabi("dfuseiohooks", "../contracts/dfuseiohooks");
    console.log("dfuseiohooks abi set");
}

async function updateEosioAuth() {
    let data = {
        account: "eosio",
        permission: "active",
        parent: "owner",
        auth: {
            accounts: [{
                permission: { actor: "gov", permission: "active" },
                weight: 1
            }],
            keys: [],
            threshold: 1,
            waits: []
        }
    }
    await accountability.transact("eosio", "updateauth", data);

    const eosioOwnerAccount = {
        privKey: settings.eosio.accounts.eosio.privKey,
        name: "eosio",
        permission: "owner"
    }
    await accountability.login(eosioOwnerAccount);
    data = {
        account: "eosio",
        permission: "owner",
        parent: "",
        auth: {
            accounts: [{
                permission: { actor: "gov", permission: "owner" },
                weight: 1
            }],
            keys: [],
            threshold: 1,
            waits: []
        }
    }
    await accountability.transact("eosio", "updateauth", data);
    console.log('Updated eosio auth to be owned by gov');
}

async function createNewOrg(accountName, commonName, owners, thresholdPercent) {
    const data = newOrgData("eosio", accountName, owners, thresholdPercent);
    await accountability.transact("eosio", "neworg", data);
    let updateAccount = {
        accountName: accountName,
        commonName: commonName,
        accountType: AccountType.Org,
    }
    await accountController.insert(updateAccount);
    console.log("Organization ", accountName, " created");
}

function newOrgData(creator, commonName, owners, thresholdPercent) {
    let data = {
        creator: creator,
        name: commonName,
        owner: {
            threshold: Math.min(Math.floor(owners.length * thresholdPercent) + 1, owners.length),
            keys: [],
            accounts: [],
            waits: []
        },
        active: {
            threshold: 1,
            keys: [],
            accounts: [],
            waits: []
        }
    }

    for (owner of owners) {
        data.owner.accounts.push({
            permission: {
                actor: owner,
                permission: "active"
            },
            weight: 1
        })
        data.active.accounts.push({
            permission: {
                actor: owner,
                permission: "active"
            },
            weight: 1
        })
    }
    return data;
}