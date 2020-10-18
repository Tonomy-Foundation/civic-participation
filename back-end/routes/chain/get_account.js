const accountController = require('../../controllers/accounts.controller');
const { getAuthorizor } = require('../../services/auth');

/* GET acounts listing. */
module.exports = async function(req, res) {
    let authAccountName;
    try {
        authAccountName = await getAuthorizor(req);
    } catch (err) {
        return res.status(401).send({ message: err.message });
    }

    const accountName = req.body.accountName;
    if (!accountName) {
        res.status(400).send({ message: 'req body should contain all the data!' });
        return;
    }

    if (authAccountName !== accountName) {
        const accountDoc = await accountController.findOne({ accountName: accountName });
        if (!accountDoc) {
            res.status(404).send({ message: `Not found account with account name ${accountName}` });
        }

        const accountDocInfo = {
            accountType: accountDoc.accountType,
            accountName: accountDoc.accountName,
            commonName: accountDoc.commonName,
        };

        const retObj = req.addBlockchainRes(accountDocInfo);
        res.send(retObj);
    } else {
        res.send(res.blockchainRes)
    }
};