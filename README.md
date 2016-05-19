# waitTransaction
A promisified web3.eth.sendTransaction that waits for confirmation.

## Install

```sh
$ npm install --save wait-transaction
```

## Usage

```js
// pass a valid web3 instance that the providers set
const waitTransaction = require('wait-transaction')(web3)

waitTransaction({ from: web3.eth.accounts[0], to: emptyAccount.address, value: 1000 })
  .then(() => web3.eth.getBalance(emptyAccount.address).valueOf())
  .then(balance => assert.equal(1000, balance))
```

Options:

```js
require('wait-transaction')(web, {
  maxAttempts: 240 // number of attempts to check that the transaction was mined before giving up
  timeInterval: 1000 // number of milliseconds between attempts
})
```

## License

MIT
