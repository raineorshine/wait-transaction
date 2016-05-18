'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (web3) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var txParams = {};

    // It's only txParams if it's an object and not a BigNumber.
    // var lastArg = args[args.length - 1]
    // if (Pudding.is_object(lastArg) && lastArg instanceof Pudding.BigNumber == false) {
    //   txParams = args.pop()
    // }
    txParams = args.pop();

    // txParams = merge(Pudding.class_defaults, self.class_defaults, txParams)

    return new Promise(function (resolve, reject) {
      var _web3$eth;

      var callback = function callback(error, tx) {
        var interval = null;
        var maxAttempts = 240;
        var attempts = 0;

        if (error) {
          reject(error);
          return;
        }

        var makeAttempt = function makeAttempt() {
          web3.eth.getTransaction(tx, function (e, txInfo) {
            // If there's an error ignore it.
            if (e) {
              return;
            }

            if (txInfo.blockHash && txInfo.blockHash) {
              clearInterval(interval);
              resolve(tx);
            }

            if (attempts >= maxAttempts) {
              clearInterval(interval);
              reject(new Error('Transaction ' + tx + ' wasn\'t processed in ' + attempts + ' attempts!'));
            }

            attempts += 1;
          });
        };

        interval = setInterval(makeAttempt, 1000);
        makeAttempt();
      };

      args.push(txParams, callback);
      (_web3$eth = web3.eth).sendTransaction.apply(_web3$eth, args);
    });
  };
};