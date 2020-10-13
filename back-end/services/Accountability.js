const { Api, JsonRpc, RpcError, Serialize } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const ecc = require('eosjs-ecc');
const { createDfuseClient } = require('@dfuse/client');
const fs = require('fs');
const path = require('path');
const { wait, copyObj } = require('./objects');

// Only needed for nodejs execution for eosjs and @dfuse/client
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');
const ws = require('ws');

const settings = require('../settings');

class Accountability {
    rpc; // read from blockchain with eosjs
    api; // interact with blockchain with eosjs
    dfuseClient; // use enhanced blockchain api
    account; // { name, permission, pubKey}

    /** 
     * @param {Object} network
     * @param {string} network.nodeos - http origin nameo of nodeos with http api enabled
     * @param {DfuseOptions} network.dfuseOptions - dfuse API options
     */
    constructor(network = { nodeos: settings.eosio.nodeos, dfuseOptions: settings.dfuseOptions }) {
        this.rpc = fetch ? new JsonRpc(network.nodeos, { fetch }) : new JsonRpc(network.nodeos);
        if (settings.isLiveEnvironment()) settings.secure = true;
        if (fetch) {
            dfuseOptions.httpClientOptions = {
                fetch: fetch
            }
        }
        if (ws) {
            dfuseOptions.graphqlStreamClientOptions = {
                socketOptions: {
                    webSocketFactory: (url) => ws(url, ["graphql-ws"])
                }
            }
            dfuseOptions.streamClientOptions = {
                socketOptions: {
                    webSocketFactory: (url) => ws(url)
                }
            }
        }
        this.dfuseClient = createDfuseClient(dfuseOptions);
    }

    /** 
     * Adds account and private key to object for sending transactions
     * @param {Object} account
     * @param {string} account.name - account name
     * @param {string} account.permission - account permission to use
     * @param {string} account.privKey - private key
     */
    login(account) {
        let accountCopy = copyObj(account);

        const signatureProvider = new JsSignatureProvider([accountCopy.privKey]);
        accountCopy.pubKey = ecc.privateToPublic(accountCopy.privKey);

        delete accountCopy.privKey;
        this.account = accountCopy;

        const rpc = this.rpc;
        this.api = TextEncoder ?
            new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }) :
            new Api({ rpc, signatureProvider });
    }

    /**
     * Gets information about an account, with extended response type with common name
     * @param {string} accountName - account to fetch information
     * @response {AccountExtended}
     */
    async getAccount(accountName) {
        const account = await this.rpc.get_account(accountName)
        return account
    }

    /** 
     * Sends a transaction to the blockchain
     * @param {string} receiver - account on which to call contract execution
     * @param {string} action - action to execut
     * @param {obj} data - arguments for the action to execute with
     * @param {Object} [options] - configuration parameters (optional)
     * @param {string} [options.status] - throw error if tx status is not this
     * @returns {Object} transaction object
     */
    async transact(receiver, action, data, options) {
        try {
            const tx = await this.api.transact({
                actions: [{
                    account: receiver,
                    name: action,
                    authorization: [{
                        actor: this.account.name,
                        permission: this.account.permission,
                    }],
                    data: data,
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
            if (options) {
                if (tx.processed.error_code) throw Error("Failed with error code: " + tx.processed.error_code);
                if (options.status && tx.processed.receipt.status !== options.status) throw Error("Tx status is " + tx.processed.receipt.status);
            }
            return tx;
        } catch (e) {
            console.log('\nCaught exception: ' + e);
            if (e instanceof RpcError)
                console.error(JSON.stringify(e.json, null, 2));
            else {
                console.error(e)
                throw Error(e);
            }
        }
    }

    /**
     * Deploys a smart contract to an account on the blockchain
     * @param {string} contractAccount - account on which to deploy contract
     * @param {string} contractDir - relative or absolute contract directory with wasm and abi files
     * @param {Object} [options] - configuration parameters (optional)
     * @param {string} [options.status] - throw error if tx status is not this
     * @returns {Object} transaction object
     */
    async deploy(contractAccount, contractDir, options) {
        const { wasmPath, abiPath } = getDeployableFilesFromDir(contractDir)

        const wasm = fs.readFileSync(wasmPath).toString(`hex`);
        const buffer = new Serialize.SerialBuffer({
            textEncoder: this.api.textEncoder,
            textDecoder: this.api.textDecoder,
        })

        let abi = JSON.parse(fs.readFileSync(abiPath, `utf8`))
        const abiDefinition = this.api.abiTypes.get(`abi_def`)
        abi = abiDefinition.fields.reduce((acc, { name: fieldName }) =>
            Object.assign(acc, {
                [fieldName]: acc[fieldName] || []
            }),
            abi
        )
        abiDefinition.serialize(buffer, abi)

        try {
            const tx = await this.api.transact({
                actions: [{
                    account: "eosio",
                    name: "setcode",
                    authorization: [{
                        actor: this.account.name,
                        permission: this.account.permission,
                    }],
                    data: {
                        account: contractAccount,
                        vmtype: 0,
                        vmversion: 0,
                        code: wasm
                    },
                }, {
                    account: "eosio",
                    name: "setabi",
                    authorization: [{
                        actor: this.account.name,
                        permission: this.account.permission,
                    }],
                    data: {
                        account: contractAccount,
                        abi: Buffer.from(buffer.asUint8Array()).toString(`hex`)
                    },
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
            if (options) {
                if (tx.processed.error_code) throw Error("Failed with error code: " + tx.processed.error_code);
                if (options.status && tx.processed.receipt.status !== options.status) throw Error("Tx status is " + tx.processed.receipt.status);
            }

            await wait(1000)
            return tx;
        } catch (e) {
            console.log('\nCaught exception: ' + e);
            if (e instanceof RpcError)
                console.error(JSON.stringify(e.json, null, 2));
            else
                throw Error(e);
        }
    }

    async setabi(contractAccount, contractDir, options) {
        const { wasmPath, abiPath } = getDeployableFilesFromDir(contractDir)

        const wasm = fs.readFileSync(wasmPath).toString(`hex`);
        const buffer = new Serialize.SerialBuffer({
            textEncoder: this.api.textEncoder,
            textDecoder: this.api.textDecoder,
        })

        let abi = JSON.parse(fs.readFileSync(abiPath, `utf8`))
        const abiDefinition = this.api.abiTypes.get(`abi_def`)
        abi = abiDefinition.fields.reduce((acc, { name: fieldName }) =>
            Object.assign(acc, {
                [fieldName]: acc[fieldName] || []
            }),
            abi
        )
        abiDefinition.serialize(buffer, abi)

        try {
            const tx = await this.api.transact({
                actions: [{
                    account: "eosio",
                    name: "setabi",
                    authorization: [{
                        actor: this.account.name,
                        permission: this.account.permission,
                    }],
                    data: {
                        account: contractAccount,
                        abi: Buffer.from(buffer.asUint8Array()).toString(`hex`)
                    },
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
            if (options) {
                if (tx.processed.error_code) throw Error("Failed with error code: " + tx.processed.error_code);
                if (options.status && tx.processed.receipt.status !== options.status) throw Error("Tx status is " + tx.processed.receipt.status);
            }

            await wait(1000)
            return tx;
        } catch (e) {
            console.log('\nCaught exception: ' + e);
            if (e instanceof RpcError)
                console.error(JSON.stringify(e.json, null, 2));
            else
                throw Error(e);
        }
    }
}

function getDeployableFilesFromDir(dir) {
    const dirCont = fs.readdirSync(dir)
    const wasmFileName = dirCont.find(filePath => filePath.match(/.*\.(wasm)$/gi))
    const abiFileName = dirCont.find(filePath => filePath.match(/.*\.(abi)$/gi))
    if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${dir}`)
    if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${dir}`)
    return {
        wasmPath: path.join(dir, wasmFileName),
        abiPath: path.join(dir, abiFileName),
    }
}


module.exports = Accountability