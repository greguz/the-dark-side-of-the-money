import test from 'ava'

import createServer from '../src/server'

test('smoke', async t => {
  const amount = 13.579
  const sourceCurrency = 'USD'
  const targetCurrency = 'USD'
  const referenceDate = '2019-09-26'

  const fastify = createServer()

  const response = await fastify.inject({
    method: 'GET',
    url: '/convert',
    query: {
      amount,
      src_currency: sourceCurrency,
      dest_currency: targetCurrency,
      reference_date: referenceDate
    }
  })

  await fastify.close()

  t.is(response.statusCode, 200)

  const body = JSON.parse(response.payload)

  t.is(body.amount, amount)
  t.is(body.currency, targetCurrency)
})
