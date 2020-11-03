const ProposalStatus = {
    Proposed: 0,
    Reviewing: 1,
    Approved: 2,
    Rejected: 3,
    VotePassed: 4,
    VoteFailed: 5,
    Actioned: 6,
    Closed: 7
}

export default ProposalStatus;

const statusReverse = {
    0: {
        label: "Proposed",
        definition: "Created"
    },
    1: {
        label: "Reviewing",
        definition: "Reviewing"
    },
    2: {
        label: "Approved",
        definition: "Approved for voting"
    },
    3: {
        label: "Rejected",
        definition: "Rejected by the government"
    },
    4: {
        label: "VotePassed",
        definition: "Suceeded!"
    },
    5: {
        label: "VoteFailed",
        definition: "Did not pass"
    },
    6: {
        label: "Actioned",
        definition: "Being executed by the govermented"
    },
    7: {
        label: "Closed",
        definition: "Closed"
    }
}

export function toLabel(type) {
    return statusReverse[type].label;
}

export function toDefinition(type) {
    return statusReverse[type].definition;
}