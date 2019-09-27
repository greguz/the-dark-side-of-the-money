import test from 'ava'

import createServer from '../src/server'

const amount = '10.99'
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

test('no amount', async t => {
  const response = await call({
    src_currency: sourceCurrency,
    dest_currency: targetCurrency,
    reference_date: referenceDate
  })

  t.is(response.statusCode, 400)
})

test('no src_currency', async t => {
  const response = await call({
    amount,
    dest_currency: targetCurrency,
    reference_date: referenceDate
  })

  t.is(response.statusCode, 400)
})

test('no dest_currency', async t => {
  const response = await call({
    amount,
    src_currency: sourceCurrency,
    reference_date: referenceDate
  })

  t.is(response.statusCode, 400)
})

test('no reference_date', async t => {
  const response = await call({
    amount,
    src_currency: sourceCurrency,
    dest_currency: targetCurrency
  })

  t.is(response.statusCode, 400)
})

test('wrong amount', async t => {
  const response = await call({
    amount: 'fifty',
    src_currency: sourceCurrency,
    dest_currency: targetCurrency,
    reference_date: referenceDate
  })

  t.is(response.statusCode, 400)
})

test('wrong src_currency', async t => {
  const response = await call({
    amount,
    src_currency: 'euro',
    dest_currency: targetCurrency,
    reference_date: referenceDate
  })

  t.is(response.statusCode, 400)
})

test('wrong dest_currency', async t => {
  const response = await call({
    amount,
    src_currency: sourceCurrency,
    dest_currency: 'dollars',
    reference_date: referenceDate
  })

  t.is(response.statusCode, 400)
})

test('wrong reference_date', async t => {
  const response = await call({
    amount,
    src_currency: sourceCurrency,
    dest_currency: targetCurrency,
    reference_date: 'today'
  })

  t.is(response.statusCode, 400)
})
