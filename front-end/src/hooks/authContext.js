import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import Civic from '../services/Civic';
import { getUserStorage, setUserStorage, clearUserStorage } from './storage';

let civic = new Civic();
const authContext = createContext();

function useProvideAuth() {
    const [isLoggedInValue, setIsLoggedIn] = useState(false);
    const [isGov, setIsGov] = useState(false);

    async function isLoggedIn() {
        if (isLoggedInValue === true) return true;

        const user = getUserStorage();
        if (user) {
            await civic.accountLoginWithKey(user.accountName, user.commonName, user.privKey)
            setIsGov(user.isGov);
            setIsLoggedIn(true);
            return true;
        } else {
            return isLoggedInValue;
        }
    }

    async function login(accountName, password) {
        const login = await civic.accountLogin(accountName, password);
        setUserStorage(accountName, civic.account.commonName, civic.account.privateKey, login.isGov);
        setIsGov(login.isGov);
        setIsLoggedIn(true);
    }

    async function createAccount(accountName, password, commonName) {
        const create = await civic.accountCreate(accountName, password, commonName);
        setUserStorage(accountName, commonName, civic.account.privateKey, create.isGov);
        setIsGov(create.isGov);
        setIsLoggedIn(true);
    }

    async function logout() {
        clearUserStorage();
        setIsLoggedIn(false);
    }

    return {
        civic,
        isGov,
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
