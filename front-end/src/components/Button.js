import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import ButtonSourceComponent from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function ButtonComponent(
    {
        text,
        type,
        loading = false,
        backgroundColor = '#227B3C',
        color = '#fff',
        loaderColor = '#fff'
    }) {
    const CircularProgressComponent = withStyles({
        root: {
            color: loaderColor
        }
    })(CircularProgress);
    
    const Button = withStyles({
        root: {
            backgroundColor: loading ? 'rgba(79,79,79, 0.26)' : backgroundColor,
            borderRadius: 3,
            border: 0,
            color,
            height: 36,
            width: 100,
            padding: '0 30px',
            marginLeft: '10px'
        },
        label: {
            textTransform: 'capitalize',
        },
    })(ButtonSourceComponent);
    

    return (
        <Button disabled={loading} type={type}>
            {text}
        </Button>
    );
}

