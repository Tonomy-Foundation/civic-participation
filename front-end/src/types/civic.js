export const ProposalCategory = {
    Green: 0,
    Kids: 1,
    Road: 2,
    Accessibility: 3,
    Art: 4,
    Safety: 5,
    Health: 6,
    Residential: 7
}

export const ProposalType = {
    Create: 0,
    Remove: 1,
    Update: 2
}

export const ProposalStatus = {
    Proposed: 0,
    Reviewing: 1,
    Approved: 2,
    Rejected: 3,
    VotePassed: 4,
    VoteFailed: 5,
    Actioned: 6,
    Closed: 7
}


export class Proposal {
    title;
    description;
    category;
    budget;
    type;
    photos;
    location;
}

export class ProposalExtended extends Proposal {
    proposalId;
    status; // also used for new status when updating
    regulations;
    comment;
}

export class ProposalDetailed extends ProposalExtended {
    created_time;
    approved_time;
    voted;
    yes_vote_count;
}

export class ProposalHistory {
    timestamp;
    authorizer;
    authorizerCommonName;
    humanAuthorizer;
    humanAuthorizerCommonName;
    status;
    comment;
    txId;
}

export class MyAccount {
    accountName;
    commonName;
    privKey;
}
