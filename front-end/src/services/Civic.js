import Accountability from './Accountability'
import Api from './Api'
import Contract from './Contract';
import { ProposalStatus } from '../types/civic'
import ecc from 'eosjs-ecc';
import crypto from 'crypto'
import { wait } from './objects';

export default class Civic {
    // SEE civic AND accounts FOR TYPES!!!
    // import { ProposalCategory, ProposalStatus, ProposalType,
    //     Proposal, ProposalDetailed, ProposalExtended, ProposalHistory } from '../types/civic.ignore';
    // import { AccountExtended } from '../types/accounts.ignore';


    accountability; // {Accountability}
    civicContract; // {Contract}
    account; // {MyAccount}

    constructor() {
        this.accountability = new Accountability();
        this.civicContract = new Contract('civic', this.accountability);
    }

    /** 
     * Login to account
     * Initializes the civicContract
     * @param {string} accountName - username
     * @param {string} password - password
     * @returns {AccountExtended}
     */
    async accountLogin(accountName, password) {
        const privKey = ecc.seedPrivate(crypto.createHash("sha256").update(accountName + password).digest("hex"))
        const pubKey = ecc.privateToPublic(privKey)

        const response = await Api.post('login', {
            accountName,
            pubKey
        }).catch(e =>  {
            switch (e.response.status) {
                case 500:
                    throw('User not found')
                case 400:
                    throw('Password is incorrect')
                default:
                    throw(e.response.message)
            }
        })

        this.account = {
            accountName: accountName,
            commonName: response.data.commonName,
            privateKey: privKey
        }

        this.accountability.login({ accountName, permission: 'active', privKey })
        await this.civicContract.initializeContract()

        return parseAccountRes(response.data);
    };

    /** 
     * Create account with the common name provided
     * Initializes the civicContract
     * @param {string} accountName - username
     * @param {string} password - password
     * @param {string} commonName - common name e.g. 'Jack Tanner'
     * @returns {AccountExtended}
     */
    async accountCreate(accountName, password, commonName) {
        const privKey = ecc.seedPrivate(crypto.createHash("sha256").update(accountName + password).digest("hex"))
        const pubKey = ecc.privateToPublic(privKey)

        const response = await Api.post('create-account', {
            commonName,
            accountName,
            pubKey
        })

        this.account = {
            accountName: accountName,
            commonName: response.data.commonName,
            privateKey: privKey
        }

        await this.accountability.login({ accountName, permission: 'active', privKey })
        await this.civicContract.initializeContract()

        return parseAccountRes(response.data);
    };

    /** 
     * Get information about an account
     * @param {string} accountName - username
     * @returns {AccountExtended}
     */
    async accountGet(accountName) {
        const response = await this.accountability.get_account(accountName);
        return parseAccountRes(response.data);
    };

    /** 
     * Creates a new proposal as the logged in user
     * @param {Proposal} proposal
     * @returns {ProposalDetailed}
     */
    async proposalCreate(proposal) {
        const tx = await this.civicContract.propcreate(this.account.accountName,
            proposal.title,
            proposal.description,
            proposal.category,
            proposal.budget,
            proposal.type,
            proposal.location);

        await wait(1000);
        const txDetailed = await this.accountability.dfuseClient.fetchTransaction(tx.transaction_id);

        const blockNum = txDetailed.execution_trace.action_traces[0].block_num;
        const decodedRows = await this.accountability.dfuseClient.stateAbiBinToJson('civic', 'proposals', [txDetailed.dbops[0].new.hex], blockNum)
        const decodedRow = decodedRows.rows[0]

        const proposalDetailed = {
            title: proposal.title,
            description: proposal.description,
            category: proposal.category,
            type: proposal.type,
            location: proposal.location,
            proposalId: decodedRow.proposal_id,
            status: ProposalStatus.Proposed,
            created: new Date(decodedRow.created),
        }
        if (proposal.budget) { proposalDetailed.budget = proposal.budget }
        if (proposal.photos) { proposalDetailed.photos = proposal.photos }
        return proposalDetailed;
    }

    /** 
     * Updates a proposal as the logged in user
     * @param {ProposalExtended} proposal
     * @returns {ProposalDetailed}
     */
    async proposalUpdate(proposal) {
        const txData = {
            actions: [{
                account: 'civic',
                name: 'propupdate',
                authorization: [{
                    actor: this.account.accountName,
                    permission: this.accountability.account.permission,
                }, {
                    actor: 'gov', // need to sign as gov as well
                    permission: 'active'
                }],
                data: {
                    updater: this.account.accountName,
                    proposal_id: proposal.proposalId,
                    title: proposal.title,
                    description: proposal.description,
                    category: proposal.category,
                    budget: proposal.budget,
                    type: proposal.type,
                    location: proposal.location,
                    new_status: proposal.status,
                    regulations: proposal.regulations,
                    comment: proposal.comment
                },
            }]
        }

        const tx = await this.accountability.transact2(txData);

        await wait(1000);
        const txDetailed = await this.accountability.dfuseClient.fetchTransaction(tx.transaction_id);

        const blockNum = txDetailed.execution_trace.action_traces[0].block_num;
        const decodedRows = await this.accountability.dfuseClient.stateAbiBinToJson('civic', 'proposals', [txDetailed.dbops[0].new.hex], blockNum)
        const decodedRow = decodedRows.rows[0];

        const proposalDetailed = {
            title: proposal.title,
            description: proposal.description,
            category: proposal.category,
            type: proposal.type,
            location: proposal.location,
            proposalId: proposal.proposalId,
            status: ProposalStatus.Proposed,
            created: Accountability.timePointToDate(decodedRow.created),
            updated: Accountability.timePointToDate(decodedRow.updated),
            approved: Accountability.timePointToDate(decodedRow.approved),
            status: proposal.status,
        }
        if (proposal.budget) { proposalDetailed.budget = proposal.budget }
        if (proposal.photos) { proposalDetailed.photos = proposal.photos }
        if (proposal.regulations) { proposalDetailed.regulations = proposal.regulations }
        if (proposal.comment) { proposalDetailed.comment = proposal.comment }

        return proposalDetailed;
    }

    /** 
     * Votes on an open proposal as the logged in user
     * @param {number} proposalId
     * @param {boolean} vote - true = yes, false = no
     * @returns {ProposalDetailed}
     */
    async proposalVote(proposalId, vote) { }

    /** 
     * Returns a list of proposals ordered by date with optional filter
     * @param {ProposalStatus} [status] - filter to use on proposals (optional)
     * @returns {ProposalDetailed[]}
     */
    async proposalList(status = null) {
        const proposalsQuery = await this.civicContract.proposals(this.civicContract.contractAccount)

        // filter per status if not null
        const proposals = status ? proposalsQuery.rows.filter(x => {
            return x.json.status === status
        }) : proposalsQuery.rows;

        // return ProposalDetailed[] type
        const response = proposals.map(x => ({
            proposalId: x.json.proposal_id,
            title: x.json.title,
            description: x.json.description,
            category: x.json.category,
            budget: x.json.budget,
            type: x.json.type,
            location: x.json.location,
            status: x.json.status,
            photos: x.json.photos,
            regulations: x.json.regulations,
            comment: x.json.comment,
            created: Accountability.timePointToDate(x.json.approved),
            approved: Accountability.timePointToDate(x.json.approved),
            updated: Accountability.timePointToDate(x.json.updated),
            voted: x.json.voted,
            yesVoteCount: x.json.yes_vote_count,
        }))

        // sort by created date
        response.sort((a, b) => {
            if (a.created > b.created) {
                return 1;
            }
            if (a.created < b.created) {
                return -1;
            }
            return 0;
        })

        return response
    }

    /** 
     * Returns a proposals 
     * @param {number} proposalId
     * @returns {ProposalDetailed}
     */
    async proposalGet(proposalId) { }

    /** 
     * Returns a proposals history of who has done what actions
     * @param {number} proposalId
     * @returns {ProposalHistory}
     */
    async proposalHistory(proposalId) { }
}

function parseAccountRes(data) {
    const val = {
        accountName: data.account_name,
        commonName: data.commonName,
        type: data.type,
        created: Accountability.timePointToDate(data.created),
        permissions: data.permissions,
        contractDeployed: data.last_code_update !== "1970-01-01T00:00:00.000",
    }
    if (val.contractDeployed) {
        val.lastContractUpdate = Accountability.timePointToDate(data.last_code_update);
    }
    return val;
}