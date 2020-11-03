const ProposalType = {
    Create: 0,
    Remove: 1,
    Update: 2
}

export default ProposalType;

const typeReverse = {
    0: {
        label: "New"
    },
    1: {
        label: "Remove"
    },
    2: {
        label: "Upgrade"
    }
}

export function toLabel(type) {
    return typeReverse[type].label;
}