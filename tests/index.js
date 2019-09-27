import test from 'ava'

import createServer from '../src/server'

test('full', async t => {
  const amount = 10
  const currency = 'USD'
  const date = '2019-09-10'

  const fastify = createServer()

  const response = await fastify.inject({
    method: 'GET',
    url: '/convert',
    query: {
      amount,
      src_currency: currency,
      dest_currency: currency,
      reference_date: date
    }
  })

  await fastify.close()

  const body = JSON.parse(response.payload)

  t.is(body.amount, amount)
  t.is(body.currency, currency)
})
