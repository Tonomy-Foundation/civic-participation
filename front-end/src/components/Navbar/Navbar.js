import React, { useState } from 'react'
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";
import logo from '../../assets/image/logo.png';
import { useHistory } from "react-router-dom";
import { ConsumeAuth } from '../../hooks/authContext';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    navbar: {
        width: '100%',
        height: 85,
        backgroundColor: '#C4C4C4',
    },
    logo: {
        width: 60,
        height: 60
    },
    logoImage: {
        margin: 'auto',
        display: 'block',
        maxHeight: '100%',
        maxWidth: '100%'
    },
    logoContainer: {
        marginLeft: 80,
        alignItems: "center",
        cursor: "pointer"
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "flex-end",
        marginRight: 80
    },
}))

const LogoTitle = withStyles({
    root: {
        color: '#1261A3',
        fontWeight: 500,
        fontSize: '30px',
    }
})(Typography);

const CreateButton = withStyles({
    root: {
        backgroundColor: '#1261A3',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 36,
        padding: '0 20px',
        marginLeft: '50px',
        '&:hover': {
            backgroundColor: '#1261A3'
        }
    },
    label: {
        textTransform: 'capitalize',
        fontSize: '14px',
        fontWeight: '500'
    },
})(Button);

const DashboardButton = withStyles({
    root: {
        border: 0,
        color: '#1261A3',
        height: 36,
        padding: '0 20px',
        '&:hover': {
            backgroundColor: '#C4C4C4'
        }
    },
    label: {
        textTransform: 'none',
        fontSize: '18px',
        fontWeight: 'normal'
    },
})(Button);

export default function Navbar() {
    const classes = useStyles();
    const history = useHistory();
    const authContext = ConsumeAuth();

    function clickLogo() {
        history.push('/');
    }

    async function logout() {
        await authContext.logout();
        history.push('/login');
    }

    return (
        <div className={classes.root}>
            <Grid item container className={classes.navbar} alignItems="center" justify="flex-start">
                <Grid item container xs alignItems="center">
                    <Grid item container className={classes.logoContainer} onClick={clickLogo}>
                        <Grid item className={classes.logo}>
                            <img src={logo} alt="Civic Participation Tool" className={classes.logoImage} />
                        </Grid>
                        <LogoTitle>The Hague</LogoTitle>
                    </Grid>
                </Grid>
                <Grid item container xs alignItems="center">
                    <Grid item container className={classes.buttonContainer}>
                        <DashboardButton onClick={logout}>Logout</DashboardButton>
                        <DashboardButton onClick={() => history.push('/vote')}>Vote</DashboardButton>
                        <DashboardButton onClick={() => history.push('/dashboard')}>Dashboard</DashboardButton>
                        <CreateButton onClick={() => history.push('/proposal-create')}>CREATE</CreateButton>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
