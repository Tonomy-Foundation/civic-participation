
export function setUserStorage(accountName, commonName, privKey, isGov) {
    const user = {
        accountName,
        commonName,
        privKey,
        isGov
    }
    localStorage.setItem('user', JSON.stringify(user));
}

export function getUserStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
}

export function clearUserStorage() {
    localStorage.removeItem('user');
}