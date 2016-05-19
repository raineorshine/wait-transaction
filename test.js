/* global describe, it */

const { assert } = require('chai')
const Web3 = require('web3')
const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
const waitTransaction = require('./lib')(web3)

/** Returns true if the difference between the two values is less than the given margin of error */
const within = (margin, a, b) => Math.abs(a - b) < margin

describe('wait-transaction', () => {
  it('should send ether from one account to another', () => {
    const [account1, account2] = web3.eth.accounts
    const balance1 = +web3.eth.getBalance(account1).valueOf()
    const balance2 = +web3.eth.getBalance(account2).valueOf()

    return waitTransaction({ from: account1, to: account2, value: balance1 / 2 }).then(() => {
      const newBalance1 = +web3.eth.getBalance(account1).valueOf()
      const newBalance2 = +web3.eth.getBalance(account2).valueOf()
      assert(within(balance1 / 1e12, newBalance1, balance1 / 2))
      assert(within(balance2 / 1e12, newBalance2, balance2 + balance1 / 2))
    })
  })
})
