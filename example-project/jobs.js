'use strict';

//This may change depending on the contract we choose
module.exports.importMyData = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'It worked!',
      input: event,
    }),
  };
};
