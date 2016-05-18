Pudding.synchronizeFunction = function(fn) {
  var self = this;
  var web3 = Pudding.getWeb3();
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var tx_params = {};
    var last_arg = args[args.length - 1];

    // It's only tx_params if it's an object and not a BigNumber.
    if (Pudding.is_object(last_arg) && last_arg instanceof Pudding.BigNumber == false) {
      tx_params = args.pop();
    }

    tx_params = Pudding.merge(Pudding.class_defaults, self.class_defaults, tx_params);

    return new Promise(function(accept, reject) {

      var callback = function(error, tx) {
        var interval = null;
        var max_attempts = 240;
        var attempts = 0;

        if (error != null) {
          reject(error);
          return;
        }

        var interval;

        var make_attempt = function() {
          //console.log "Interval check //{attempts}..."
          web3.eth.getTransaction(tx, function(e, tx_info) {
            // If there's an error ignore it.
            if (e != null) {
              return;
            }

            if (tx_info.blockHash != null && tx_info.blockHash != 0x0) {
              clearInterval(interval);
              accept(tx);
            }

            if (attempts >= max_attempts) {
              clearInterval(interval);
              reject(new Error("Transaction " + tx + " wasn't processed in " + attempts + " attempts!"));
            }

            attempts += 1;
          });
        };

        interval = setInterval(make_attempt, 1000);
        make_attempt();
      };

      args.push(tx_params, callback);
      fn.apply(self, args);
    });
  };
};