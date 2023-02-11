import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import { Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import logo from "../../assets/image/logo.png";
import { useHistory } from "react-router-dom";
import { ConsumeAuth } from "../../hooks/authContext";
import { ConsumeVote } from "../../hooks/voteContext";
import {
  AddCircle,
  CheckCircleOutline,
  Dashboard,
  ExitToApp,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  navbar: {
    width: "100%",
    height: 85,
    backgroundColor: "#ddd",
  },
  logo: {
    width: 60,
    height: 60,
  },
  logoImage: {
    margin: "auto",
    display: "block",
    maxHeight: "100%",
    maxWidth: "100%",
  },
  logoContainer: {
    marginLeft: 20,
    alignItems: "center",
    cursor: "pointer",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 80,
  },
}));

const LogoTitle = withStyles({
  root: {
    color: "#BBA24B",
    fontWeight: 500,
    fontSize: "30px",
  },
})(Typography);

const CreateButton = withStyles({
  root: {
    backgroundColor: "#BBA24B",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 36,
    padding: "0 20px",
    marginLeft: "50px",
    "&:hover": {
      backgroundColor: "#BBA24B",
    },
  },
  label: {
    textTransform: "capitalize",
    fontSize: "14px",
    fontWeight: "500",
  },
})(Button);

const DashboardButton = withStyles({
  root: {
    border: 0,
    color: "#BBA24B",
    height: 36,
    "&:hover": {
      backgroundColor: "#C4C4C4",
    },
  },
  label: {
    textTransform: "none",
    fontSize: "18px",
    fontWeight: "normal",
  },
})(Button);

export default function Navbar() {
  const classes = useStyles();
  const history = useHistory();
  const authContext = ConsumeAuth();
  const voteContext = ConsumeVote();

  function clickLogo() {
    history.push("/");
  }

  async function logout() {
    await authContext.logout();
    history.push("/login");
  }

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#ddd",
        height: "82px",
        justifyContent: "center",
      }}
    >
      <Toolbar>
        <Grid
          item
          className={classes.logo}
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.push("/dashboard");
          }}
        >
          <img
            src={logo}
            alt="Civic Participation Tool"
            className={classes.logoImage}
          />
        </Grid>
        <LogoTitle
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.push("/dashboard");
          }}
        >
          Florence
        </LogoTitle>
        <div style={{ flexGrow: 1 }} />

        <DashboardButton
          variant={
            history.location.pathname.includes("vote") ? "contained" : null
          }
          onClick={() => history.push("/vote")}
          style={{ marginRight: 20 }}
        >
          <CheckCircleOutline style={{ marginRight: 8 }} /> Vote summary
          {voteContext.proposals.length > 0
            ? ` (${voteContext.proposals.length})`
            : ""}
        </DashboardButton>
        <DashboardButton
          variant={
            history.location.pathname.includes("dashboard") ? "contained" : null
          }
          onClick={() => history.push("/dashboard")}
          style={{ borderRadius: 12, marginRight: 120 }}
        >
          <Dashboard style={{ marginRight: 8 }} /> Dashboard
        </DashboardButton>
        <CreateButton
          style={{ marginRight: 20 }}
          onClick={() => history.push("/proposal-create")}
        >
          <AddCircle style={{ marginRight: 8 }} />
          CREATE
        </CreateButton>
        <DashboardButton onClick={logout}>
          <ExitToApp style={{ marginRight: 8 }} />
          Logout
        </DashboardButton>
      </Toolbar>
    </AppBar>
  );
}
