import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Security from './pages/Security/Security';
import ProposalCreate from './pages/ProposalCreate/ProposalCreate';
import Dashboard from './pages/Dashboard/Dashboard';
import ProposalDetail from './pages/ProposalDetail/ProposalDetail';
import ProposalVote from './pages/ProposalVote/ProposalVote';
import Vote from './pages/Vote/Vote';
import VoteSuccess from './pages/Vote/VoteSuccess';
import SSI from './pages/SSI/SSI';

const Routes = () => (
    <Router >
        <Switch>
            <Route exact path="/">
                <CreateAccount />
            </Route>
            {/* SSI callback url */}
            <Route path="/ssi">
                <SSI />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/test">
                <Home />
            </Route>
            <Route path="/security">
                <Security />
            </Route>
            <Route path="/proposal-create">
                <ProposalCreate />
            </Route>
            <Route path="/dashboard">
                <Dashboard />
            </Route>
            <Route path="/proposal/:proposal_id">
                <ProposalDetail />
            </Route>
            <Route path="/proposals-vote">
                <ProposalVote />
            </Route>
            <Route path="/vote">
                <Vote />
            </Route>
            <Route path="/vote-success">
                <VoteSuccess />
            </Route>
        </Switch>
    </Router>
);

export default Routes;