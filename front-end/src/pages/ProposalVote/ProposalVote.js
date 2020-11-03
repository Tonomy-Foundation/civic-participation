import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
// import { useHistory } from 'react-router-dom';
// import { ConsumeAuth } from '../../hooks/authContext';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

export default function Login() {
    const classes = useStyles();
    // const authContext = ConsumeAuth();
    // const history = useHistory();

    useEffect(() => {
        async function main() {
            // TODO uncomment out after UI completed

            // if (!await authContext.isLoggedIn()) {
            //     history.push('/login');
            //     return;
            // }
        }
        main();
    }, [])
    return (
        <div className={classes.root}>
            <Navbar />
            <div>
                Proposal vote
            </div>
        </div>
    )
}
