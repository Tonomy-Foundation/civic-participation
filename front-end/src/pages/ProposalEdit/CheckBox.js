import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Checkbox } from '@material-ui/core';
import { NaturePeople } from '@material-ui/icons';

const CategoryCheckbox = withStyles({
    root: {
        color: '#599C6D',
        fontSize: '12px',
        '&$checked': {
            color: '#599C6D',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const CategoryPeopleIcon = withStyles({
    root: {
        color: '#000000',
        fontSize: 15,
    }
})(NaturePeople);

const CatergoryItemTyography = withStyles({
    root: {
        fontSize: '12px',
        color: 'rgba(1, 1, 1, 1)',
        lineHeight: '14.06px',
        fontWeight: '400'
    }
})(Typography);

function CheckBox(props) {
    return (
        <>
            <Grid item>
                <FormControlLabel
                    control={
                        <CategoryCheckbox
                            checked={props.checked}
                            onChange={props.handleChangeCheckboxs}
                            name={props.checkboxName} />
                    }
                />
            </Grid>
            <Grid item xs container >
                <CategoryPeopleIcon />
                <CatergoryItemTyography>{props.title}</CatergoryItemTyography>
            </Grid>
        </>
    );
}

export default CheckBox;