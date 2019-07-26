'use strict'

const src = '../../../../src'
const Test = require('tape')
const TransferService = require(`${src}/domain/transfer`)
const Fixtures = require('../../../fixtures')

Test('transfer service', (modelTest) => {
  modelTest.test('prepare should', (prepareTest) => {
    prepareTest.test('produce a transfer message to kafka', async (assert) => {
      const transfer = Fixtures.buildTransfer(Fixtures.generateTransferId())
      const request = {
        headers: Fixtures.buildHeaders,
        payload: transfer
      }
      const result = await TransferService.prepare(request)
      assert.equal(result, true)
      assert.pass()
      assert.end()
    })

    prepareTest.end()
  })
  modelTest.end()
})
