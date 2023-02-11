import React from "react";
import {
  Badge,
  Grid,
  Typography,
  Button,
  Paper,
  ButtonBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Logo from "../../assets/image/logo.png";

const CardTitle = withStyles({
  root: {
    color: "#000000",
    fontWeight: "normal",
    fontSize: "22px",
    lineHeight: "21px",
    "&:hover": {
      cursor: "pointer",
    },
    marginTop: 10,
  },
})(Typography);

const CardContentDescription = withStyles({
  root: {
    color: "#000000",
    fontWeight: "normal",
    fontSize: "16px",
    // marginTop: 10,
    wordBreak: "break-word",
  },
})(Typography);

const ReadmoreButton = withStyles({
  root: {
    backgroundColor: "#BBA24B",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 36,
    maxWidth: 96,
    "&:hover": {
      backgroundColor: "#BBA24B",
    },
  },
  label: {
    textTransform: "capitalize",
    fontSize: "12px",
    fontWeight: "normal",
  },
})(Button);

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 32,
    top: 22,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "16px 7px",
    fontSize: "22px",
    zIndex: 900,
    backgroundColor: "#ce2226",
    boxShadow: "0 2px 1px gray"
  },
}))(Badge);

export default function Card(props) {
  const style = {
    root: {
      flexGrow: 1,
    },
    mainContainer: {
    },
    cardWrap: {
      maxWidth: 800,
      margin: "auto",
    },
    paper: {
      margin: "auto",
      maxWidth: 285,
      marginBottom: 60,
      height: 300,
    },
    image: {
      width: 283,
      height: 185,
    },
    img: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
    cardContent: {
      padding: 10,
    },
    cardTitle: {
      marginTop: 6,
      marginBottom: 6,
    },
  };
  if (props.selected) {
    style.paper.backgroundColor = "lightgrey";
  }

  if (props.isAddedToVoteBasket) {
    style.paper.border = "12px solid #ce2226";
  }

  const useStyles = makeStyles((theme) => style);

  const classes = useStyles();

  return (
    <StyledBadge
      invisible={!props.hasBadge || props.badgeContent == ''}
      badgeContent={props.badgeContent}
      max={999}
      color="error"
    >
      <Paper className={classes.paper}>
        <Grid container direction="column">
          <Grid item>
            <ButtonBase className={classes.image} onClick={props.onClick}>
              {props.imageUrl && (
                <img
                  className={classes.img}
                  alt={props.title}
                  src={props.imageUrl}
                />
              )}
              {!props.imageUrl && (
                <img
                  className={classes.img}
                  alt="Civic logo"
                  style={{ opacity: 0.1 }}
                  src={Logo}
                />
              )}
            </ButtonBase>
          </Grid>
          <Grid
            item
            container
            className={classes.cardContent}
            direction="column"
          >
            <Grid item container className={classes.cardTitle}>
              <Grid item xs>
                <CardTitle onClick={props.onClick}>
                  {props.title.slice(0, 30)}
                </CardTitle>
              </Grid>
              <ReadmoreButton onClick={props.onButtonClick}>
                READ MORE
              </ReadmoreButton>
            </Grid>
            <Grid item>
              <CardContentDescription>
                {props.description.length > 65 ? `${props.description.slice(0, 65)} ...` : props.description }
              </CardContentDescription>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </StyledBadge>
  );
}
