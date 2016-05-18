export default function (web3, options = {}) {
  options.maxAttempts = options.maxAttempts || 240
  options.timeInterval = options.timeInterval || 1000

  return function (...args) {
    return new Promise(function (resolve, reject) {
      const callback = function (error, tx) {
        let interval
        let attempts = 0

        if (error) {
          reject(error)
          return
        }

        const makeAttempt = function () {
          web3.eth.getTransaction(tx, function (e, txInfo) {
            // If there's an error ignore it.
            if (e) {
              return
            }

            if (txInfo.blockHash && txInfo.blockHash) {
              clearInterval(interval)
              resolve(tx)
            }

            if (attempts >= options.maxAttempts) {
              clearInterval(interval)
              reject(new Error('Transaction ' + tx + ' wasn\'t processed in ' + attempts + ' attempts!'))
            }

            attempts++
          })
        }

        interval = setInterval(makeAttempt, options.timeInterval)
        makeAttempt()
      }

      web3.eth.sendTransaction(...[...args, callback])
    })
  }
}
