import test from 'ava'

import createServer from '../src/server'

const amount = '99.10'
const sourceCurrency = 'EUR'
const targetCurrency = 'EUR'
const referenceDate = '2019-09-26'

async function call (query) {
  const fastify = createServer()

  const response = await fastify.inject({
    method: 'GET',
    url: '/convert',
    query
  })

  await fastify.close()

  return response
}

test('unknown src_currency', async t => {
  const response = await call({
    amount,
    src_currency: 'XXX',
    dest_currency: targetCurrency,
    reference_date: referenceDate
  })

  t.is(response.statusCode, 400)
})

test('unknown dest_currency', async t => {
  const response = await call({
    amount,
    src_currency: sourceCurrency,
    dest_currency: 'XXX',
    reference_date: referenceDate
  })

  t.is(response.statusCode, 400)
})

test('old reference_date', async t => {
  const response = await call({
    amount,
    src_currency: sourceCurrency,
    dest_currency: targetCurrency,
    reference_date: '0001-01-01'
  })

  t.is(response.statusCode, 400)
})
