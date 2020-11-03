import React, { useState } from 'react'
import { Grid, Typography, Button } from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import SearchIcon from '@material-ui/icons/Search';
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
    searchContainer: {
        maxWidth: 385,
        maxHeight: 67,
        minWidth: 330,
        border: '1px solid #fff',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: "center"
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        "& .MuiInput-underline:before": {
            borderColor: '#009688'
        },
        "& .MuiSelect-icon": {
            top: 'calc(50% - 15px)'
        },
        '& .MuiNativeSelect-select:focus': {
            backgroundColor: '#C4C4C4'
        },
    },
    inputLabel: {
        color: "rgba(0, 0, 0, 0.5393)",
        "&.Mui-focused": {
            color: "#599C6D"
        }
    },
    searchIcon: {
        width: 35,
        height: 35,
        backgroundColor: '#009688',
        padding: 7,
        borderRadius: '50%',
        color: '#fff',
        marginLeft: 58
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
        marginLeft: '50px',
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
    const [selectedProposal, setSelectedProposal] = useState('');
    const history = useHistory();
    const authContext = ConsumeAuth();

    const handleChange = (event) => {
        setSelectedProposal(event.target.value);
    };

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
                <Grid item container xs={4} alignItems="center">
                    <Grid item container className={classes.logoContainer} onClick={clickLogo}>
                        <Grid item className={classes.logo}>
                            <img src={logo} alt="Civic Participation Tool" className={classes.logoImage} />
                        </Grid>
                        <LogoTitle>Civic</LogoTitle>
                    </Grid>
                </Grid>
                <Grid item container xs={4} alignItems="center" justify="center">
                    <Grid item container className={classes.searchContainer}>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="search-proposal" className={classes.inputLabel}>Status</InputLabel>
                                <NativeSelect
                                    value={selectedProposal}
                                    onChange={handleChange}
                                    id="search-proposal"
                                >
                                    <option value="Search all proposals">Search all proposals</option>
                                    <option value="Proposed">Proposed</option>
                                    <option value="Reviewing by gov">Reviewing by gov</option>
                                    <option value="Approved by gov">Approved by gov</option>
                                    <option value="Rejected by gov">Rejected by gov</option>
                                    <option value="Voteable">Voteable</option>
                                    <option value=" Vote passed"> Vote passed</option>
                                    <option value="Vote failed">Vote failed</option>
                                    <option value="Executing by gov">Executing by gov</option>
                                    <option value="Closed">Closed</option>
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        <Grid item className={classes.searchIcon}>
                            <SearchIcon />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={4} alignItems="center">
                    <Grid item container className={classes.buttonContainer}>
                        <DashboardButton onClick={logout}>Logout</DashboardButton>
                        <DashboardButton onClick={() => history.push('/dashboard')}>Dashboard</DashboardButton>
                        <CreateButton onClick={() => history.push('/proposal-create')}>CREATE</CreateButton>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
