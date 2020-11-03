// import React from 'react';
import { mapObj } from '../../services/objects';
import EcoIcon from '@material-ui/icons/Eco';
import ChildCareIcon from '@material-ui/icons/ChildCare';

const ProposalCategory = {
    Green: 0,
    Kids: 1,
    Safety: 2,
    Accessibility: 3,
    Art: 4,
    Health: 5,
    Roads: 6,
    Residential: 7
}

export default ProposalCategory;

const categoryReverse = {
    0: {
        label: "Green",
        icon: EcoIcon
    },
    1: {
        label: "Kids",
        icon: ChildCareIcon
    },
    2: {
        label: "Safety"
    },
    3: {
        label: "Accessibility"
    },
    4: {
        label: "Art"
    },
    5: {
        label: "Health"
    },
    6: {
        label: "Road"
    },
    7: {
        label: "Residential"
    }
}

export function toLabel(type) {
    return categoryReverse[type].label;
}

export function toIcon(type) {
    return categoryReverse[type].icon;
}

export function allCategories() {
    const res = [];
    mapObj(categoryReverse, (key, val) => {
        res.push({
            value: key,
            label: val.label,
            icon: val.icon
        })
    })
    return res;
}