import React, { Fragment } from 'react';
import { useHistory } from "react-router-dom";

import { ConsumeAuth } from "../../hooks/authContext";
import { getQueryStringParams, parseJwt } from '../../utils';

export default function SSI(props) {
    const history = useHistory();
    const authContext = ConsumeAuth();
    if (history.location.search) {
        // contains response prop
        const parsedQueryParam = getQueryStringParams(history.location.search);
        const decodedToken = parsedQueryParam.response ? parseJwt(parsedQueryParam.response) : {}
        console.log('response token decoded', decodedToken.data);
        return (
            <Fragment>
                <h1>Hello {decodedToken.data.firstname} {decodedToken.data.familyname}</h1>
            </Fragment>
        );
    }

    return <div>We are unable to get your information. Please contact customer care for further assistance</div>;
}

