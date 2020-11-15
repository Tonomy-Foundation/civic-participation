/**
 * Takes HTMLFileInputElement as argument and returns Base64 string.
 *
 * @param {HTMLFileInputElement} element - File input which allows user to select file in our case it is iamge.
 * @returns {Promise} - Base64 string of given image.
 */
export default function encodeImageFileAsURL(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    reader.onloadend = function () {
      resolve(reader.result);
    };
    reader.onerror = function () {
      reject("not able to convert image to base64 image");
    };

    reader.readAsDataURL(file);
  });
}

export const authTypes = {
  username: 'username',
  SSI: 'ssi'
};

/**
 * https://stackoverflow.com/a/51359101
 * 
 * Parses query string and returns in JavaScript object.
 * 
 * @param {string} query - URL query string.
 * @returns {object} key, value pair of query string params.
 */
export const getQueryStringParams = query => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
      .split('&')
      .reduce((params, param) => {
        let [key, value] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
      }, {}
      )
    : {}
};

/**
 * https://stackoverflow.com/a/38552302
 * 
 * Parses JWT and returns the data object;
 * 
 * @param {string} token - JWT: JSON Web Token - Received as a query param from SSI
 * @returns {object} data - decoded JWT.
 */
export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

