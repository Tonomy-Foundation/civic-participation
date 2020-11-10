import React from "react";
import PropTypes from "prop-types";

import { ProvideAuth } from "./hooks/authContext";
import { ProvideVote } from "./hooks/voteContext";

const AppProviders = (props) => {
  const { children } = props;

  return (
    <ProvideAuth>
      <ProvideVote>{children}</ProvideVote>
    </ProvideAuth>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
