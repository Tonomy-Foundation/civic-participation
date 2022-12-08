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
        apiKey: "AIzaSyBsVD_hzvy9f39CndxIcSLur_G8J9SimVc"
    },
    env: 'development'
};

if (process.env.REACT_APP_NODE_ENV === "production") {
    settings.env = "production"
    settings.eosio.nodeos = "http://161.35.246.173:4000";
    settings.eosio.blockExplorerUrl = "http://161.35.246.173:8080";
    settings.dfuseOptions.network = "161.35.246.173:8080"
    settings.dfuseOptions.secure = false;
}

settings.isLiveEnvironment = function () {
    return settings.env === "production";
}

export default settings;