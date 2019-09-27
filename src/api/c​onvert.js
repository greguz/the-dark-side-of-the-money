/* eslint camelcase: 0 */

import { BadRequestError } from '../libs/errors'

function getCurrencyRate (snapshot, currency) {
  const rate = snapshot.rates[currency]

  if (typeof rate === 'number') {
    return rate
  } else if (currency === 'EUR') {
    return 1
  } else {
    return null
  }
}

async function handler (request, reply) {
  const database = await this.database.fetch()
  const { amount, src_currency, dest_currency, reference_date } = request.query

  const snapshot = database.find(item => item.time === reference_date)
  if (!snapshot) {
    throw new BadRequestError(`Timedate '${reference_date}' is not available`)
  }

  const src_rate = getCurrencyRate(snapshot, src_currency)
  if (src_rate === null) {
    throw new BadRequestError(`Unknown source currency '${src_currency}'`)
  }

  const dest_rate = getCurrencyRate(snapshot, dest_currency)
  if (dest_rate === null) {
    throw new BadRequestError(`Unknown destination currency '${dest_currency}'`)
  }

  reply.status(200).send({
    amount: (amount / src_rate) * dest_rate,
    currency: dest_currency
  })
}

export default {
  method: 'GET',
  url: '/convert',
  handler,
  schema: {
    querystring: {
      type: 'object',
      properties: {
        amount: {
          type: 'number'
        },
        src_currency: {
          type: 'string',
          pattern: '^[A-Z]{3}$'
        },
        dest_currency: {
          type: 'string',
          pattern: '^[A-Z]{3}$'
        },
        reference_date: {
          type: 'string',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$'
        }
      },
      required: ['amount', 'src_currency', 'dest_currency', 'reference_date']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          amount: {
            type: 'number'
          },
          currency: {
            type: 'string'
          }
        }
      }
    }
  }
}
