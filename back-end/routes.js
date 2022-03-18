const express = require('express');
const router = express.Router();
const asyncRouter = require('./middleware/asyncRouter');

const login = require('./routes/login');
const createAccount = require('./routes/create_account');
const getAccount = require('./routes/chain/get_account');
const searchTransactions = require('./routes/chain/search_transactions');
const getTableData = require('./routes/chain/get_table_data');
const getTableRowData = require('./routes/chain/get_table_row_data');
const pushTransaction = require('./routes/chain/push_transaction');
const storeImage = require('./routes/image');
const ssi = require('./routes/ssi');
// const ssiInformation = require('./routes/ssi_information');

// Blockchain API extensions
router.post("/v1/chain/get_account", asyncRouter(getAccount));
router.post("/v1/chain/push_transaction", asyncRouter(pushTransaction));
router.get("/v0/search/transactions", asyncRouter(searchTransactions));

// While getting proposal data
router.get("/v0/state/table", asyncRouter(getTableData));
router.get("/v0/state/table/row", asyncRouter(getTableRowData));

// New API endpoints
router.post('/login', asyncRouter(login));
router.post('/create-account', asyncRouter(createAccount));
router.post('/image', asyncRouter(storeImage));

// SSI
// router.get('/ssi/token', asyncRouter(ssi));
// router.get('/ssi/information', asyncRouter(ssi));

// function handleRedirect(req, res) {
//     const targetUrl = targetBaseUrl + req.originalUrl;
//     res.redirect(targetUrl);
// }
// router.get('*', handleRedirect);

module.exports = router;