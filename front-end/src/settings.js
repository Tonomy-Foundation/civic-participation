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
        apiKey: "AIzaSyDMa6KMn669HY33Qrdu5gd0ggyf5C8G4WQ"
    },
    env: 'development'
};

if (process.env.REACT_APP_NODE_ENV === "production") {
    settings.env = "production"
    settings.eosio.nodeos = "https://server-civic.conscious-cities.com";
    settings.dfuseOptions.network = "";
    settings.eosio.blockExplorerUrl = "https://blockchain-civic.conscious-cities.com";
    settings.dfuseOptions.network = "server-civic.conscious-cities.com"
    settings.dfuseOptions.secure = true;
}

settings.isLiveEnvironment = function () {
    return settings.env === "production";
}

export default settings;