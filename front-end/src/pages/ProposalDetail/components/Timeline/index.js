import React from 'react'
import { Grid, Typography } from '@material-ui/core';
import { Lock, AccountCircle, Info } from '@material-ui/icons';
import { withStyles } from "@material-ui/core/styles";
import governmentUser from '../../../../assets/image/government_user.png';
import { HtmlTooltip } from '../../../../components/Themes';
import { Link } from '@material-ui/core';

const TimelineMiddleTyography = withStyles({
    root: {
        fontSize: '16px',
        color: 'rgba(0, 0, 0, 1)',
        lineHeight: '18.75px',
        fontWeight: '400',
    }
})(Typography);

const TitleLock = withStyles({
    root: {
        fontSize: "14px"
    }
})(Lock);


const TimelineMiddleUnderlineTyography = withStyles({
    root: {
        fontSize: '16px',
        color: 'rgba(0, 0, 0, 1)',
        lineHeight: '18.75px',
        fontWeight: '400',
        textDecoration: 'underline'
    }
})(Typography);

const ItemcommentTyography = withStyles({
    root: {
        fontSize: '10px',
        color: 'rgba(0, 0, 0, 1)',
        lineHeight: '11.72px',
        fontWeight: '400',
        fontStyle: 'italic'
    }
})(Typography);


const TimelineLock = withStyles({
    root: {
        color: '#16b73b',
        width: '15px',
        marginTop: '-4px'
    }
})(Lock);

const UserIcon = withStyles({
    root: {
        color: '#227B3C',
        fontSize: 45,
        lineHeight: 0
    }
})(AccountCircle);

const TimelineInfo = withStyles({
    root: {
        color: '#000000',
        fontSize: 20,
        lineHeight: 0,
        marginTop: '-4px',
        marginLeft: 9
    }
})(Info);

function Timeline(props) {
    const navigateSecurityPage = () => {
        window.open("/security", "_blank")
    }

    return (
        <Grid item container className="timeline-item-wraper" alignItems="center" spacing={5}>
            <Grid item className="item-img">
                {props.gov === true ?
                    <img src={governmentUser} alt="Government" className="government-user-img" /> :
                    <UserIcon />
                }
            </Grid>
            <Grid item container xs className="item-content">
                <Grid item xs={4} container direction="column">
                    <Grid item>
                        <TimelineMiddleUnderlineTyography>{props.userName}</TimelineMiddleUnderlineTyography>
                    </Grid>
                    <Grid item className="item-comment">
                        <ItemcommentTyography>{props.comment}</ItemcommentTyography>
                    </Grid>
                </Grid>
                <Grid item container xs={6} className="item-right-wraper">
                    <Grid item container spacing={2}>
                        <Grid item xs={7} container >
                            <Grid item>
                                <TimelineMiddleTyography>{props.status}</TimelineMiddleTyography>
                            </Grid>
                        </Grid>
                        <Grid item xs={5} container >
                            <Grid item>
                                <TimelineMiddleUnderlineTyography>{props.time}</TimelineMiddleUnderlineTyography>
                            </Grid>
                            <Grid item>
                                <a href={props.exploreUrl} rel="noopener noreferrer" target="_blank">
                                    <TimelineInfo />
                                </a>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Timeline;