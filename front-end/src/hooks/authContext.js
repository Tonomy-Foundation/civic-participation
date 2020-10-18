import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import Civic from '../services/Civic';
import { getUserStorage, setUserStorage, clearUserStorage } from './storage';

let civic = new Civic();
const authContext = createContext();

function useProvideAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const user = getUserStorage();
    if (user) {
        // TODO next line should use await
        civic.accountLoginWithKey(user.accountName, user.commonName, user.privKey)
        setIsLoggedIn(true);
    }

    async function login(accountName, password) {
        await civic.accountLogin(accountName, password);
        setUserStorage(accountName, civic.account.commonName, civic.account.privateKey);
        setIsLoggedIn(true);
    }

    async function createAccount(accountName, password, commonName) {
        await civic.accountCreate(accountName, password, commonName);
        setUserStorage(accountName, commonName, civic.account.privateKey);
        setIsLoggedIn(true);
    }

    async function logout() {
        clearUserStorage();
        setIsLoggedIn(false);
    }

    return {
        civic,
        isLoggedIn,
        login,
        createAccount,
        logout
    };
}

export function ProvideAuth({ children }) {
    const authProvider = useProvideAuth();

    return (
        <authContext.Provider value={authProvider}>
            {children}
        </authContext.Provider>
    );
}

export const ConsumeAuth = () => {
    return useContext(authContext);
};

ProvideAuth.propTypes = {
    children: PropTypes.node.isRequired,
};
