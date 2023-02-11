import { Typography } from '@material-ui/core';
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import background from './../assets/image/Mainpic.png';
import Tooltip from '@material-ui/core/Tooltip';

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(','),
    },
    Button: {
        backgroundColor: '#ce2226', color: '#fff'
    }
    
});

const GreenTextTypography = withStyles({
    root: {
        fontSize: '72px',
        color: '#ce2226',
    }
})(Typography);

const ValidatiionString = withStyles({
    root: {
        fontSize: '15px',
        color: 'red',
    }
})(Typography);

const TitleSmallTextTypography = withStyles({
    root: {
        color: '#BBA24B',
        fontWeight: 'bold',
        fontSize: '50px'
    }
})(Typography);

const TitleLargeTextTypography = withStyles({
    root: {
        color: '#ce2226',
        fontWeight: 500,
        fontSize: '72px',
    }
})(Typography);

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: 'lightgrey',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 400,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);


const backgroundStyle = {
    style: {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 15 %',
    },
};

export {
    theme,
    GreenTextTypography,
    TitleSmallTextTypography,
    TitleLargeTextTypography,
    backgroundStyle,
    ValidatiionString,
    HtmlTooltip
}