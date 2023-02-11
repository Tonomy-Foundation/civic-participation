let settings = {
    eosio: {
        nodeos: "http://localhost:4000",
        blockExplorerUrl: "http://localhost:8080",
    },
    dfuseOptions: {
        apiKey: "web_abcdef123456789",
        authUrl: "null://",
        secure: false,
        network: "localhost:4000"
    },
    google: {
        apiKey: "AIzaSyC1qMWpQAqk2Hh6cA-nV4hfCIU34f1gs7Y"
    },
    env: 'development'
};

if (process.env.REACT_APP_NODE_ENV === "production") {
    settings.env = "production"
    settings.eosio.nodeos = "https://api-civic.tonomy.foundation";
    settings.eosio.blockExplorerUrl = "https://dfuse-civic.tonomy.foundation";
    settings.dfuseOptions.network = "api-civic.tonomy.foundation"
    settings.dfuseOptions.secure = true;
}

settings.isLiveEnvironment = function () {
    return settings.env === "production";
}

export default settings;