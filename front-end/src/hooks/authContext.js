import React, { useState,  useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import Civic from '../services/Civic';

const authContext = createContext();

function useProvideAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    let civic = new Civic(); 

    const login = async ({username, password}) => {
        try{
            await civic.accountLogin(username, password)
        } catch (e) {
            return {
                success: false,
                message: e
            }
        }

        return {
            success: true
        }
    };


    return {
        login,
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
