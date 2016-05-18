# waitTransaction
A promisified web3.eth.sendTransaction that waits for confirmation

## Install

```sh
$ npm install --save wait-transaction
```

## Usage

```js
import waitTransaction from 'wait-transaction'
const wait = waitTransaction(web3)

it('should add funds sent by the seller to sellerFunds', () => {
  const contract = MyContract.deployed()
  return wait({ from: web3.eth.accounts[0], to: contract.address, value: 1000 })
    .then(() => web3.eth.getBalance(contract.address))
    .then(balance => assert.equal(1000, balance))
})
```

## License

MIT
