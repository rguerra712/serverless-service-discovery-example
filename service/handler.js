'use strict';

module.exports.get = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'This is a response!',
        input: event,
      },
      null,
      2
    ),
  };

};
