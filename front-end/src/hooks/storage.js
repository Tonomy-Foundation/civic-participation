
function setUserStorage(accountName, privateKey) {
    const user = {
        accountName,
        privateKey
    }
    localStorage.setItem('user', JSON.stringify(user));
}

function getUserStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
}

function clearUserStorage() {
    localStorage.removeItem('user');
}