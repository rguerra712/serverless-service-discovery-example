'use strict';

const { getServiceData } = require('./example-service-client');


module.exports.get = async () => {
  const serviceResponseText = await getServiceData();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Client received the following response from service: ${serviceResponseText}`,
      },
      null,
      2
    ),
  };

};
