import React, { useState,  useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import Civic from '../services/Civic';

const authContext = createContext();

function useProvideAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    let civic = new Civic(); 

    return {
        civic,
        isLoggedIn,
        setIsLoggedIn
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
