'use strict';

module.exports.get = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `This is a response from ${process.env.SERVICE_NAME}!`,
      },
      null,
      2
    ),
  };

};
