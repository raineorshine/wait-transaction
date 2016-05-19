// Based on https://github.com/ConsenSys/ether-pudding/blob/f3b7e5921a8884e869f25cc254a6c4d6a2d8c7e9/index.js#L240
module.exports = (web3, options = {}) => {
  options.maxAttempts = options.maxAttempts || 240
  options.timeInterval = options.timeInterval || 1000

  return (...args) => {
    return new Promise((resolve, reject) => {
      const callback = (error, tx) => {
        let interval
        let attempts = 0

        if (error) { return reject(error) }

        const makeAttempt = () => {
          web3.eth.getTransaction(tx, (e, { blockHash }) => {
            if (e) { return }

            if (blockHash) {
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
