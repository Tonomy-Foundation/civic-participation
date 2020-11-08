import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from '@material-ui/core';
import { NaturePeople } from '@material-ui/icons';


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

function CategoryItem(props) {
    return (
        <>
            <Grid item>
                <CategoryPeopleIcon />
            </Grid>
            <Grid item>
                <CatergoryItemTyography>{props.title}</CatergoryItemTyography>
            </Grid>
        </>
    );
}

export default CategoryItem;