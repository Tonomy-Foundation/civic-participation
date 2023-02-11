import React from 'react'
import { useHistory } from "react-router-dom";
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import Navbar from '../../components/Navbar/Navbar';
import './Vote.scss'

const TitleTypography = withStyles({
    root: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '24px',
        lineHeight: '28px'
    }
})(Typography);

const ContentTypography = withStyles({
    root: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '18px',
        lineHeight: '21px'
    }
})(Typography);

const HomeButton = withStyles({
    root: {
        backgroundColor: '#BBA24B',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 36,
        padding: '0 20px',
        width: 142
    },
    label: {
        textTransform: 'capitalize',
        fontSize: '14px',
        fontWeight: '500'
    },
})(Button);

export default function VoteSuccesfult() {

    const history = useHistory();
    const _handleButton = () => {
        history.push('./dashboard')
    }

    return (
        <div className="root">
            <Navbar />
            <Grid className="succesfult-container">
                <Grid container spacing={10}>
                    <Grid item container direction="column" spacing={6}>
                        <Grid item>
                            <TitleTypography>Thank you for voting</TitleTypography>
                        </Grid>
                        <Grid item>
                            <ContentTypography>Your votes are now being processed.</ContentTypography>
                        </Grid>
                    </Grid>
                    <Grid item container justify="center">
                        <HomeButton onClick={_handleButton}>HOME</HomeButton>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
