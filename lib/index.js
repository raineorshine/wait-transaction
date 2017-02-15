'use strict';

// Based on https://github.com/ConsenSys/ether-pudding/blob/f3b7e5921a8884e869f25cc254a6c4d6a2d8c7e9/index.js#L240
module.exports = function (web3) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options.maxAttempts = options.maxAttempts || 240;
  options.timeInterval = options.timeInterval || 1000;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      var _web3$eth;

      var callback = function callback(errSend, tx) {
        var interval = void 0;

        if (errSend) {
          clearInterval(interval);
          return reject(errSend);
        }

        var makeAttempt = function makeAttempt() {
          var attempts = 0;

          web3.eth.getTransaction(tx, function (errTx, results) {
            // error
            if (errTx) {
              clearInterval(interval);
              return reject(errTx);
            }

            // resolved
            if (results && results.blockHash) {
              clearInterval(interval);
              resolve(tx);
            }

            // exceeded max attempts
            if (attempts >= options.maxAttempts) {
              clearInterval(interval);
              reject(new Error('Transaction ' + tx + ' wasn\'t processed in ' + attempts + ' attempts!'));
            }

            attempts++;
          });
        };

        interval = setInterval(makeAttempt, options.timeInterval);
        makeAttempt();
      };

      (_web3$eth = web3.eth).sendTransaction.apply(_web3$eth, [].concat(args, [callback]));
    });
  };
};