const express = require('express');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const settings = require('./settings');
const routes = require('./routes');
const blockchainProxy = require('./middleware/blockchainProxy');
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();

const corsOptions = {
    allowedHeaders: 'Content-Type,authname,authperm,authkey,authsignature,authdata,authorization'
}
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text()); // needed to parse eosjs api into req.body

app.use(blockchainProxy.pre);

// Extended and additional API endpoints
app.use(routes);

app.use(blockchainProxy.post);

// Error handler
app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.send(err.toString());
});

try {
    // mongoose.Promise = global.Promise;
    mongoose.connect(settings.mongodb.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (rej) => {
        if (rej) {
            console.error(rej.message);
            process.exit();
        }
        console.log("Connected to database");

        app.listen(settings.port, () => {
            console.log("Server listening on port " + settings.port);
        });
    });
} catch (err) {
    console.error(err)
    process.exit();
}