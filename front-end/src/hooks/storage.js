
export function setUserStorage(accountName, commonName, privKey) {
    const user = {
        accountName,
        commonName,
        privKey
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