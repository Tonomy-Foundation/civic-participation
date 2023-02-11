import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  Grid,
  Typography,
  Button,
  Link,
  CircularProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { Lock } from "@material-ui/icons";
import { HtmlTooltip } from "../../components/Themes";
import ProposalCategory, {
  toLabel as categoryToLabel,
} from "../../types/proposals/categories";

import Navbar from "../../components/Navbar/Navbar";
import { ConsumeAuth } from "../../hooks/authContext";
import { ConsumeVote } from "../../hooks/voteContext";

import Card from "./Card";
import ProgressBar from "./ProgressBar";
import Chart from "./Chart";

import "./Vote.scss";
import { mapObj } from "../../services/objects";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const VoteTypography = withStyles({
  root: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "24px",
    lineHeight: "28px",
  },
})(Typography);

const TitleHeaderTypography = withStyles({
  root: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "21px",
  },
})(Typography);

const TitleContentTypography = withStyles({
  root: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "21px",
    color: "#E39696",
  },
})(Typography);

const UploadSmallTypographyCreate = withStyles({
  root: {
    fontSize: "15px",
    color: "#BBA24B",
  },
})(Typography);

const VoteButton = withStyles({
  root: {
    backgroundColor: "#DBDBDB",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 36,
    padding: "0 20px",
    marginLeft: "10px",
    width: 142,
  },
  label: {
    textTransform: "capitalize",
    fontSize: "14px",
    fontWeight: "500",
  },
})(Button);

const TitleLock = withStyles({
  root: {
    fontSize: "14px",
  },
})(Lock);

const CreateLock = withStyles({
  root: {
    color: "#BBA24B",
  },
})(Lock);

const GreenSmallTypographyCreate = withStyles({
  root: {
    fontSize: "15px",
    color: "#BBA24B",
  },
})(Typography);

const TitleTypography = withStyles({
  root: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "24px",
    lineHeight: "28px",
  },
})(Typography);

const ContentTypography = withStyles({
  root: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "21px",
  },
})(Typography);

const HomeButton = withStyles({
  root: {
    backgroundColor: "#BBA24B",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 36,
    padding: "0 20px",
    width: 220,
  },
  label: {
    textTransform: "capitalize",
    fontSize: "14px",
    fontWeight: "500",
  },
})(Button);


export default function Vote() {
  const authContext = ConsumeAuth();
  const voteContext = ConsumeVote();

  const classes = useStyles();
  const history = useHistory();
  const [completed, setCompleted] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);
  const [chartValues, setChartValues] = useState({ series: [], labels: [] });
  const [loading, setLoading] = useState(false);

  // total budget
  const [budgetLimit, _] = useState(200000);

  // On delete button click in proposal
  const handleDelete = (proposalId) => {
    // Filter the not deleted proposals and update the context with them
    voteContext.deleteProposalById(proposalId);
  };

  // On vote button click
  const _handleVote = async () => {
    if (completed > 0) {
      setLoading(true);
    }
    // TODO: get proposal data from global store/ context.
    const proposalIds = voteContext.proposals.map(
      (proposal) => proposal.proposalId
    );
    await authContext.civic.proposalVote(proposalIds);
    voteContext.clearAllProposals();
    history.push("./vote-success");
  };

  const formatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  });

  const navigateSecurityPage = () => {
    window.open("https://conscious-cities.com/security", "_blank");
  };

  useEffect(() => {
    const totalProposalBudget = voteContext.proposals.reduce(
      (acc, curr) => acc + parseFloat(curr.budget),
      0
    );
    // For currency
    setSelectedValue(formatter.format(totalProposalBudget));
    // For progressbar
    setCompleted((totalProposalBudget / budgetLimit) * 100);

    // For chart
    const series = [],
      labels = [];
    mapObj(ProposalCategory, (key, val) => {
      labels.push(categoryToLabel(val));
      let num = voteContext.proposals.reduce((total, proposal) => {
        if (proposal.category === val) return total + proposal.budget;
        else return total;
      }, 0);
      series.push(num);
    });
    setChartValues({ series, labels });
  }, [voteContext.proposals]);

  const UploadButton = withStyles({
    root: {
      backgroundColor: loading ? "rgba(79,79,79, 0.26)" : "#BBA24B",
      borderRadius: 3,
      border: 0,
      color: "white",
      height: 36,
      padding: "0 20px",
      marginLeft: "10px",
      position: "relative",
      "&$disabled": {
        color: "rgba(255,255,255,0.6)",
      },
    },
    disabled: {
      backgroundColor: "#fff",
    },
    label: {
      textTransform: "capitalize",
      fontSize: "14px",
      fontWeight: "500",
    },
  })(Button);

  return (
    <div className={classes.root}>
      <Navbar />

      {voteContext.proposals.length === 0 && (
        <Grid container direction="column" className="header-container">
            <Grid className="header-wraper">

        <Grid container spacing={10}>
          <Grid item container direction="column" spacing={6}>
            <Grid item>
              <TitleTypography>Your vote basket looks so empty!</TitleTypography>
            </Grid>
            <Grid item>
              <ContentTypography>
                Select your favorite proposals in the Dashboard page and the overview of your choices will be shown here for confirmation
              </ContentTypography>
            </Grid>
          </Grid>
          <Grid item container justify="center">
            <HomeButton
              onClick={() => {
                history.push("/dashboard");
              }}
            >
              FIND PROPOSALS
            </HomeButton>
          </Grid>
        </Grid>
        </Grid>
        </Grid>

      )}

      {voteContext.proposals.length > 0 && (
        <>
          <Grid container direction="column" className="header-container">
            <Grid className="header-wraper">
              <Grid container spacing={10}>
                <Grid item container xs={6} direction="column" spacing={5}>
                  <Grid item>
                    <VoteTypography>Vote</VoteTypography>
                  </Grid>
                  <Grid item>
                    <TitleHeaderTypography>
                      Please vote responsibly to upgrade the infrastructure in
                      your neighbourhood for the benefit of all!
                    </TitleHeaderTypography>
                  </Grid>
                  <Grid item container direction="column" spacing={2}>
                    <ProgressBar
                      bgcolor={completed > 100 ? "#E39696" : "#ce2226"}
                      completed={completed > 100 ? 100 : completed}
                      selectedValue={selectedValue}
                    />
                    <Grid item item container justify="flex-end">
                      <TitleHeaderTypography>
                        from budget of&nbsp;&nbsp;&nbsp;&nbsp;
                        {formatter.format(budgetLimit)}
                      </TitleHeaderTypography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  xs={6}
                  direction="column"
                  spacing={5}
                  alignItems="center"
                >
                  <Grid item>
                    <TitleHeaderTypography>
                      € budget breakdown
                    </TitleHeaderTypography>
                  </Grid>
                  <Grid item container xs justify="flex-end">
                    {completed !== 0 && (
                      <Chart
                        series={chartValues.series}
                        labels={chartValues.labels}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid className="main-container">
            <Grid container spacing={2}>
              <Grid
                item
                container
                alignItems="center"
                justify="flex-end"
                className="button-wraper"
              >
                <Grid item>
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <div>
                          {<TitleLock />}Proposals, voting and government
                          actions are stored on the blockchain. This data is
                          cryptographically secured and cannot be forged or
                          tampered with by anyone, including the
                          government.&nbsp;
                          <Link
                            className="read-more-link"
                            onClick={navigateSecurityPage}
                          >
                            Click to learn more
                          </Link>
                        </div>
                      </React.Fragment>
                    }
                    arrow
                    interactive
                  >
                    <Grid item container className="tamper-wraper">
                      <GreenSmallTypographyCreate>
                        tamper proof
                      </GreenSmallTypographyCreate>
                      <CreateLock />
                    </Grid>
                  </HtmlTooltip>
                </Grid>
                <Grid item>
                  <UploadButton
                    type="button"
                    onClick={_handleVote}
                    disabled={!completed || completed > 100 || loading}
                  >
                    VOTE
                  </UploadButton>
                  {loading && (
                    <CircularProgress size={24} className="button-progress" />
                  )}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" justify="flex-end">
                {completed > 100 && (
                  <TitleContentTypography>
                    You have used more than the allocated budget
                  </TitleContentTypography>
                )}
              </Grid>
            </Grid>
            <Grid className="content-wraper">
              <Grid container spacing={5}>
                {voteContext.proposals.map((data, key) => {
                  return (
                    <Card
                      title={data.title}
                      description={data.description}
                      budget={data.budget}
                      photo={data.photo}
                      proposalId={data.proposalId}
                      key={key}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}
