import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import SearchIcon from '@material-ui/icons/Search';
import Navbar from '../../components/Navbar/Navbar';
import Card from './Card';
import Map from './Map';
import { ConsumeAuth } from '../../hooks/authContext';
import { useHistory } from "react-router-dom";

function parseLocation(location) {
    return {
        lat: parseFloat(location.split(",")[0]),
        lng: parseFloat(location.split(",")[1])
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    mainContainer: {
        marginTop: 30
    },
    cardWrap: {
        maxWidth: 800,
        margin: 'auto',
        maxHeight: 780,
        overflowY: 'auto',
        marginTop: 70
    },
    searchContainer: {
        height: 150
    },
    searchWraper: {
        maxWidth: 385,
        maxHeight: 67,
        minWidth: 330,
        border: '3px solid #227B3C',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 57,
        borderSizing: 'border-box'
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
            // backgroundColor: '#C4C4C4'
        },
        '& .makeStyles-formControl-5 .MuiNativeSelect-select.MuiNativeSelect-select:focus': {
            backgroundColor: 'red'
        }
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
}))

function Dashboard(props) {
    const classes = useStyles();
    const [proposalList, setProposalList] = useState([]);
    const authContext = ConsumeAuth();
    const history = useHistory();
    const [selectedProposals, setSelectedProposals] = useState([]);
    const [status, setStatus] = useState('')
    const [selected, setSelected] = useState({});

    const handleChange = (event) => {
        setStatus(event.target.value);
        let tempData = proposalList;
        if (event.target.value == "all") {
            setSelectedProposals(tempData);
            return;
        }
        let searchedProposals = tempData.filter(item => item.type == event.target.value);
        setSelectedProposals(searchedProposals);
    };

    useEffect(() => {
        async function main() {
            if (!await authContext.isLoggedIn()) {
                history.push('/login');
                return;
            }
            let proposals = await authContext.civic.proposalList();
            proposals = proposals.map(item => {
                item.position = parseLocation(item.location)
                return item;
            });
            setProposalList(proposals);
            setSelectedProposals(proposals);
        }

        main();
    }, [authContext, history]);

    const navigateToProposal = (proposalId) => {
        history.push(`/proposal/${proposalId}`);
    }

    return (
        <div className={classes.root}>
            <Grid container direction="column">
                <Grid item>
                    <Navbar />
                </Grid>
                <Grid item container className={classes.mainContainer}>
                    <Grid item container xs={6}>
                        <Grid item container alignItems="center" justify="center" className={classes.searchContainer}>
                            <Grid item container className={classes.searchWraper}>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="search-proposal" className={classes.inputLabel}>Status</InputLabel>
                                        <NativeSelect
                                            value={status}
                                            onChange={handleChange}
                                            id="search-proposal"
                                        >
                                            <option value="all">Search all proposals</option>
                                            <option value="0">Proposed</option>
                                            <option value="1">Reviewing by gov</option>
                                            <option value="2">Approved by gov</option>
                                            <option value="3">Rejected by gov</option>
                                            <option value="4">Voteable</option>
                                            <option value="5"> Vote passed</option>
                                            <option value="6">Vote failed</option>
                                            <option value="7">Executing by gov</option>
                                            <option value="8">Closed</option>
                                        </NativeSelect>
                                    </FormControl>
                                </Grid>
                                <Grid item className={classes.searchIcon}>
                                    <SearchIcon />
                                </Grid>
                            </Grid>
                        </Grid>
                        {selectedProposals.length === 0 &&
                            <Grid item container className={classes.cardWrap}>
                                <div style={{ margin: 'auto' }} > No proposal were found</div>
                            </Grid>
                        }
                        {selectedProposals.length > 0 &&
                            <Grid item container className={classes.cardWrap}>
                                {selectedProposals.map(proposal =>
                                    <Grid item xs={6} key={proposal.proposalId}>
                                        <Card
                                            title={proposal.title}
                                            description={proposal.description}
                                            imageUrl={proposal.photo}
                                            selected={selected.proposalId === proposal.proposalId}
                                            onClick={() => setSelected(proposal)}
                                            onButtonClick={() => navigateToProposal(proposal.proposalId)}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        }
                    </Grid>
                    <Grid item container xs={6}>
                        <Map selected={selected} onSelect={(item) => setSelected(item)} selectedProposals={selectedProposals} zoom={15} />
                    </Grid>
                </Grid>
            </Grid>
        </div >
    );
}

export default Dashboard;