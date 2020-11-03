export async function wait(ms) {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, ms);
    })
}

export function copyObj(obj) {
    return Object.assign({}, obj);
}

export function mapObj(obj, fn) {
    const retObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            retObj[key] = fn(key, obj[key]);
        }
    }
    return retObj;
}
