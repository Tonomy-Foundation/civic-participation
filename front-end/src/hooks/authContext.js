import React, { useState,  useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import Civic from '../services/Civic';

const authContext = createContext();

function useProvideAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    let civic = new Civic(); 

    const accountLogin = async ({username, password}) => {
        try{
            const loginData = await civic.accountLogin(username, password)
            setIsLoggedIn(true)
            return [loginData, null]
        } catch (error) {
            return [null, error]
        }
    };

    const accountCreate = async ({username, password, firstname, lastname}) => {
        try{
            const accountData = await civic.accountCreate(username, password, `${firstname} ${lastname}`)
            return [accountData, null]
        } catch (error) {
            return [null, error]
        }
    };


    return {
        accountCreate,
        accountLogin,
        isLoggedIn,
        setIsLoggedIn
    };
}

export function ProvideAuth({ children }) {
    const organization = useProvideAuth();

    return (
    <authContext.Provider value={organization}>
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
