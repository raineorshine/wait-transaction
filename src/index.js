export default function (web3) {
  return function (...args) {
    var txParams = {}

    // It's only txParams if it's an object and not a BigNumber.
    // var lastArg = args[args.length - 1]
    // if (Pudding.is_object(lastArg) && lastArg instanceof Pudding.BigNumber == false) {
    //   txParams = args.pop()
    // }
    txParams = args.pop()

    // txParams = merge(Pudding.class_defaults, self.class_defaults, txParams)

    return new Promise(function (resolve, reject) {
      var callback = function (error, tx) {
        var interval = null
        var maxAttempts = 240
        var attempts = 0

        if (error) {
          reject(error)
          return
        }

        var makeAttempt = function () {
          web3.eth.getTransaction(tx, function (e, txInfo) {
            // If there's an error ignore it.
            if (e) {
              return
            }

            if (txInfo.blockHash && txInfo.blockHash) {
              clearInterval(interval)
              resolve(tx)
            }

            if (attempts >= maxAttempts) {
              clearInterval(interval)
              reject(new Error('Transaction ' + tx + ' wasn\'t processed in ' + attempts + ' attempts!'))
            }

            attempts += 1
          })
        }

        interval = setInterval(makeAttempt, 1000)
        makeAttempt()
      }

      args.push(txParams, callback)
      web3.eth.sendTransaction(...args)
    })
  }
}
