import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const voteContext = createContext();

function useProvideVote() {
    const [proposals, setProposals] = useState([]);

    return {
        proposals,
        setProposals,
    };
}

export function ProvideVote({ children }) {
    const voteProvider = useProvideVote();

    return (
        <voteContext.Provider value={voteProvider}>
            {children}
        </voteContext.Provider>
    );
}

export const ConsumeVote = () => {
    return useContext(voteContext);
};

ProvideVote.propTypes = {
    children: PropTypes.node.isRequired,
};