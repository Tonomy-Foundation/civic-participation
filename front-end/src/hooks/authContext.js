import React, { useState, useContext, createContext } from "react";
import PropTypes from "prop-types";

import Civic from "../services/Civic";
import SSIClient from "../services/SSI";
import { clearProposalsStorage, getUserStorage, setUserStorage, clearUserStorage } from "./storage";

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

const ssiClient = new SSIClient(SSIInfo.id, SSIInfo.sharedSecret, options);
ssiClient.credentialType = 'FullNameDataCredential';

let civic = new Civic();
const authContext = createContext();

function useProvideAuth() {
  const [isLoggedInValue, setIsLoggedIn] = useState(false);
  const [isGov, setIsGov] = useState(false);

  async function isLoggedIn() {
    if (isLoggedInValue === true) return true;

    const user = getUserStorage();
    if (user) {
      await civic.accountLoginWithKey(
        user.accountName,
        user.commonName,
        user.privKey
      );
      setIsGov(user.isGov);
      setIsLoggedIn(true);
      return true;
    } else {
      return isLoggedInValue;
    }
  }

  async function login(accountName, password) {
    const login = await civic.accountLogin(accountName, password);
    setUserStorage(
      accountName,
      civic.account.commonName,
      civic.account.privateKey,
      login.isGov
    );
    setIsGov(login.isGov);
    setIsLoggedIn(true);
  }

  async function createAccount(accountName, password, commonName) {
    const create = await civic.accountCreate(accountName, password, commonName);
    setUserStorage(
      accountName,
      commonName,
      civic.account.privateKey,
      create.isGov
    );
    setIsGov(create.isGov);
    setIsLoggedIn(true);
  }

  async function logout() {
    clearUserStorage();
    clearProposalsStorage();
    setIsLoggedIn(false);
  }

  return {
    civic,
    isGov,
    isLoggedIn,
    isLoggedInValue,
    login,
    createAccount,
    logout,
    ssiClient,
  };
}

export function ProvideAuth({ children }) {
  const authProvider = useProvideAuth();

  return (
    <authContext.Provider value={authProvider}>{children}</authContext.Provider>
  );
}

export const ConsumeAuth = () => {
  return useContext(authContext);
};

ProvideAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
