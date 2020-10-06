import React from 'react';
import PropTypes from 'prop-types';

import { ProvideAuth } from './hooks/authContext';

const AppProviders = props => {
    const { children } = props;

    return (
    <ProvideAuth>{children}</ProvideAuth>
    );
};

AppProviders.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppProviders;
