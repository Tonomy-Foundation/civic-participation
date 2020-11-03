import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
        overflowY: 'auto'
    },
}))

function Dashboard(props) {
    const classes = useStyles();
    const [proposalList, setProposalList] = useState([]);
    const authContext = ConsumeAuth();
    const history = useHistory();

    const [selected, setSelected] = useState({});

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
                        {proposalList.length === 0 &&
                            <div style={{ margin: 'auto' }} > No proposal were found</div>
                        }
                        {proposalList.length > 0 &&
                            <Grid item container className={classes.cardWrap}>
                                {proposalList.map(proposal =>
                                    <Grid item xs={6} key={proposal.proposalId}>
                                        <Card
                                            title={proposal.title}
                                            description={proposal.description}
                                            imageUrl={proposal.photos}
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
                        <Map selected={selected} onSelect={(item) => setSelected(item)} proposalList={proposalList} zoom={15} />
                    </Grid>
                </Grid>
            </Grid>
        </div >
    );
}

export default Dashboard;