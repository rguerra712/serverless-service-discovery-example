'use strict';

const AWS = require('aws-sdk');
const fetch = require('node-fetch');

let cachedExampleServiceKey;

/**
 * Gets the service key from SSM, or alternatively a cached version
 *
 * @param {boolean} shouldSkipCache True if you want to re-retrieve from SSM (e.g. key rotations)
 * @return {string} The key decrypted, retrieved from SSM.
 */
async function getServiceKey(shouldSkipCache) {
    if (!shouldSkipCache && cachedExampleServiceKey) {
        return cachedExampleServiceKey;
    }
    const { EXAMPLE_SERVICE_KEY_NAME: exampleServiceKeyName } = process.env;
    const ssm = new AWS.SSM();
    const params = {
        Name: exampleServiceKeyName,
        WithDecryption: true
    };
    const result = await ssm.getParameter(params).promise();
    cachedExampleServiceKey = result.Parameter.Value;
    return cachedExampleServiceKey;
}

async function getRawResponse(exampleServiceUrl, exampleServiceKey) {
    return await fetch(`https://${exampleServiceUrl}`, { headers: { 'X-API-KEY': exampleServiceKey } });
}

/**
* Gets the response from the example service
*/
module.exports.getServiceData = async () => {
    const { EXAMPLE_SERVICE_URL: exampleServiceUrl } = process.env;
    let exampleServiceKey = await getServiceKey();
    let response;
    response = await getRawResponse(exampleServiceUrl, exampleServiceKey);
    if (response.status === 403) {
        console.log('forbidden response, attempting to get keys in case rolled');
        // Get key again in case it was rolled
        exampleServiceKey = await getServiceKey(true);
        response = await getRawResponse(exampleServiceUrl, exampleServiceKey);
    }
    return await response.text();
}