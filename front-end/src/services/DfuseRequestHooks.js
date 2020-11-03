import ecc from 'eosjs-ecc';

const interceptorHooks = {
    stateTable: {
        pre: () => { },
        post: () => { }
    },
    searchTransactions: {
        pre: () => { },
        post: () => { }
    },
}

// https://stackoverflow.com/questions/45425169/intercept-fetch-api-responses-and-request-in-javascript
const fetch = window.fetch;
window.fetch = async function (...args) {
    const url = args[0];
    const requestOptions = args[1];

    if (requestOptions.method === 'GET' && url.includes('v0/state/table')) {
        args = await interceptorHooks.stateTable.pre(...args);
    } else if (requestOptions.method === 'GET' && url.includes('/v0/search/transactions')) {
        args = await interceptorHooks.searchTransactions.pre(...args);
    }

    const result = await fetch(...args);

    if (requestOptions.method === 'GET' && url.includes('v0/state/table')) {
        await interceptorHooks.stateTable.post(result);
    } else if (requestOptions.method === 'GET' && url.includes('/v0/search/transactions')) {
        await interceptorHooks.searchTransactions.post(result);
    }

    return result;
}

function authHeader(accountName, permission, privKey, pubKey) {
    let now = new Date();
    now = now.toISOString();
    const sign = ecc.sign(now, privKey);

    return {
        AuthName: accountName,
        AuthPerm: permission,
        AuthKey: pubKey,
        AuthSignature: sign,
        AuthData: now
    }
}

function addAuthHeader(accountName, permission, privKey, pubKey) {
    return (...args) => {
        // const url = args[0];
        const requestOptions = args[1];

        requestOptions.headers = {
            ...requestOptions.headers,
            ...authHeader(accountName, permission, privKey, pubKey)
        }

        args[1] = requestOptions;
        return args;
    }
}

export function setInterceptors(accountName, permission, privKey, pubKey) {
    interceptorHooks.stateTable.pre = async (...args) => {
        return addAuthHeader(accountName, permission, privKey, pubKey)(...args);
    }

    // interceptorHooks.stateTable.post = async(results) => {
    //     console.log('stateTablePostHook', results)
    // }

    interceptorHooks.searchTransactions.pre = async (...args) => {
        return addAuthHeader(accountName, permission, privKey, pubKey)(...args);
    }

    // interceptorHooks.searchTransactions.post = async(results) => {
    //     console.log('searchTransactionsPostHook', results)
    // }
}