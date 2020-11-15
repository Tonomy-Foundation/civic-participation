import { sign, verify } from "jsonwebtoken";

export default class SSIClient {
    constructor(clientId, clientSecret, options) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.url = "https://service.ssi-lab.nl/";
        // ? civic-integration
        this.name = "ssi-service-provider";
        if (!options) {
            return;
        }
        if (options.url) {
            this.url = options.url;
        }
        if (options.name) {
            this.name = options.name;
        }
        if (options.callbackUrl) {
            this.callbackUrl = options.callbackUrl;
        }
    }

    verifyUrl(type, requestId, callbackUrl) {
        const callback = this.getCallbackUrl(callbackUrl);
        const token = this.encodeJWT({ type, callbackUrl: callback }, { subject: "credential-verify-request", jwtid: requestId });
        return this._constructRequestUrl("verify", token);
    }

    issueUrl(type, data, requestId, callbackUrl) {
        const callback = this.getCallbackUrl(callbackUrl);
        const token = this.encodeJWT({ type, data, callbackUrl: callback }, { subject: "credential-issue-request", jwtid: requestId });
        return this._constructRequestUrl("issue", token);
    }

    parseVerifyResponse(token) {
        const response = this.decodeJWT(token, {
            subject: "credential-verify-response",
        });
        return {
            type: response.type,
            data: response.data,
            status: response.status,
            connector: response.connector,
            requestId: response.requestId,
        };
    }

    parseIssueResponse(token) {
        const response = this.decodeJWT(token, {
            subject: "credential-issue-response",
        });
        return {
            type: response.type,
            status: response.status,
            connector: response.connector,
            requestId: response.requestId,
        };
    }

    getCallbackUrl(callbackUrl) {
        const callback = callbackUrl || this.callbackUrl;
        if (!callback) {
            throw new Error("Please specify a callback url either through the client instance or per request.");
        }
        return callback;
    }

    _constructRequestUrl(endpoint, token) {
        const url = new URL(endpoint, this.url);
        url.search = `?token=${token}`;
        return url.toString();
    }

    encodeJWT(payload, signOptions) {
        return sign(payload, this.clientSecret, Object.assign({ issuer: this.clientId, audience: this.name }, signOptions));
    }

    decodeJWT(token, verifyOptions) {
        // Payload cannot be a string due to the verify options passed.
        const payload = verify(token, this.clientSecret, Object.assign({ issuer: this.name, audience: this.clientId }, verifyOptions));
        return payload;
    }
}