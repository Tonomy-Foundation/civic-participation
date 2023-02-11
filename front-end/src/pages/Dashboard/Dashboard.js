import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import SearchIcon from "@material-ui/icons/Search";
import Navbar from "../../components/Navbar/Navbar";
import Card from "./Card";
import Map from "./Map";
import { ConsumeAuth } from "../../hooks/authContext";
import { ConsumeVote } from "../../hooks/voteContext";
import { useHistory, useLocation } from "react-router-dom";
import ProposalStatus from "../../types/proposals/status";

function parseLocation(location) {
  return {
    lat: parseFloat(location.split(",")[0]),
    lng: parseFloat(location.split(",")[1]),
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  mainContainer: {
    marginTop: 30,
  },
  cardWrap: {
    maxWidth: 800,
    margin: "auto",
    maxHeight: 780,
    overflowY: "auto",
    marginTop: 70,
  },
  cardInnerContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  },
  searchContainer: {
    height: 150,
  },
  searchWraper: {
    maxWidth: 385,
    maxHeight: 67,
    minWidth: 330,
    border: "3px solid #ce2226",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 57,
    borderSizing: "border-box",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    "& .MuiInput-underline:before": {
      borderColor: "#009688",
    },
    "& .MuiSelect-icon": {
      top: "calc(50% - 15px)",
    },
    "& .MuiNativeSelect-select:focus": {
      // backgroundColor: '#C4C4C4'
    },
    "& .makeStyles-formControl-5 .MuiNativeSelect-select.MuiNativeSelect-select:focus": {
      backgroundColor: "red",
    },
  },
  inputLabel: {
    color: "rgba(0, 0, 0, 0.5393)",
    "&.Mui-focused": {
      color: "#ce2226",
    },
  },
  searchIcon: {
    width: 35,
    height: 35,
    backgroundColor: "#009688",
    padding: 7,
    borderRadius: "50%",
    color: "#fff",
    marginLeft: 58,
  },
}));

function sortByCreatedDate(data) {
  data.sort((a, b) => {
    if (a.created > b.created) {
      return 1;
    }
    if (a.created < b.created) {
      return -1;
    }
    return 0;
  });
}
function Dashboard(props) {
  const classes = useStyles();
  const [navigation, setNavigation] = useState("2");
  const authContext = ConsumeAuth();
  const voteContext = ConsumeVote();
  const history = useHistory();
  const location = useLocation();
  const [selectedProposals, setSelectedProposals] = useState([]);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    async function main() {
      let proposals = await authContext.civic.proposalList();
      proposals = proposals
        ? proposals.map((item) => {
            item.position = parseLocation(item.location);
            return item;
          })
        : [
          {title: 'test',description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', photo: "https://images.pexels.com/photos/2565222/pexels-photo-2565222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          proposalId: 2323,
          location: "43.779944555022425,11.214490915339217",
          status: '1',
          position: parseLocation("43.779944555022425,11.214490915339217"),
          yesVoteCount: 4
        }
        ];

      let searchedProposals;

      if (navigation === "all") {
        searchedProposals = proposals;
        sortByCreatedDate(searchedProposals);
      } else if (navigation === "my") {
        searchedProposals = proposals.filter(
          (item) => item.creator === authContext.civic.account.accountName
        );
        sortByCreatedDate(searchedProposals);
      } else if (navigation === ProposalStatus.Approved.toString()) {
        searchedProposals = proposals.filter(
          (item) => item.status.toString() === navigation
        );
        searchedProposals.sort((a, b) => b.yesVoteCount - a.yesVoteCount);
      } else {
        searchedProposals = proposals.filter(
          (item) => item.status.toString() === navigation
        );
        sortByCreatedDate(searchedProposals);
      }
      setSelectedProposals(searchedProposals);
    }

    if (navigation && authContext) {
      main();
    }
  }, [navigation, authContext]);

  useEffect(() => {
    if (!authContext.isLoggedIn()) {
      history.push("/login");
      return;
    }
  }, []);

  const navigateToProposal = (proposalId) => {
    history.push(`/proposal/${proposalId}`);
  };

  return (
    <div className={classes.root}>
      <Grid container direction="column">
        <Grid item>
          <Navbar />
        </Grid>
        <Grid item container className={classes.mainContainer}>
          <Grid item container xs={6}>
            <Grid
              item
              container
              alignItems="center"
              justify="center"
              className={classes.searchContainer}
            >
              <Grid item container className={classes.searchWraper}>
                <Grid item>
                  <FormControl className={classes.formControl}>
                    <InputLabel
                      id="search-proposal"
                      className={classes.inputLabel}
                    >
                      Status
                    </InputLabel>
                    <NativeSelect
                      value={navigation}
                      onChange={(e) => setNavigation(e.target.value)}
                      id="search-proposal"
                    >
                      <option value="all">All proposals</option>
                      <option value="my">My proposals</option>
                      <option value={ProposalStatus.Proposed}>Proposed</option>
                      <option value={ProposalStatus.Reviewing}>
                        Reviewing by gov
                      </option>
                      <option value={ProposalStatus.Rejected}>
                        Rejected by gov
                      </option>
                      <option value={ProposalStatus.Approved}>Voting</option>
                      <option value={ProposalStatus.Actioned}>
                        Executing by gov
                      </option>
                      <option value={ProposalStatus.Closed}>Closed</option>
                    </NativeSelect>
                  </FormControl>
                </Grid>
                <Grid item className={classes.searchIcon}>
                  <SearchIcon />
                </Grid>
              </Grid>
            </Grid>
            {selectedProposals.length === 0 && (
              <Grid item container className={classes.cardWrap}>
                <div style={{ margin: "auto" }}> No proposal were found</div>
              </Grid>
            )}
            {selectedProposals.length > 0 && (
              <Grid item container className={classes.cardWrap}>
                {selectedProposals.map((proposal) => (
                  <Grid item className={classes.cardInnerContainer} xs={6} key={proposal.proposalId}>
                    <Card
                      title={proposal.title}
                      description={proposal.description}
                      imageUrl={proposal.photo}
                      selected={selected.proposalId === proposal.proposalId}
                      onClick={() => setSelected(proposal)}
                      onButtonClick={() =>
                        navigateToProposal(proposal.proposalId)
                      }
                      hasBadge={navigation == ProposalStatus.Approved}
                      badgeContent={
                        proposal.yesVoteCount > 0
                          ? `${proposal.yesVoteCount} ${
                              proposal.yesVoteCount > 1 ? "votes" : "vote"
                            }`
                          : ""
                      }
                      isAddedToVoteBasket={voteContext.proposals
                        .map((proposal) => proposal.proposalId)
                        .includes(proposal.proposalId)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          <Grid item container xs={6}>
            <Map
              selected={selected}
              onSelect={(item) => setSelected(item)}
              selectedProposals={selectedProposals}
              zoom={15}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
