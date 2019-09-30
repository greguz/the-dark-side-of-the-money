import axios from 'axios'
import _ from 'lodash'

import * as stream from './stream'
import XmlParser from './xml-parser'

const schema = {
  type: 'object',
  properties: {
    attributes: {
      type: 'object',
      properties: {
        time: {
          type: 'string',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$'
        }
      },
      required: ['time']
    },
    elements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          attributes: {
            type: 'object',
            properties: {
              currency: {
                type: 'string',
                pattern: '^[A-Z]{3}$'
              },
              rate: {
                type: 'string',
                pattern: '^\\d+(\\.\\d+)?$'
              }
            },
            required: ['currency', 'rate']
          }
        },
        required: ['attributes']
      }
    }
  },
  required: ['attributes', 'elements']
}

function mapper (data) {
  return {
    time: data.attributes.time,
    rates: data.elements
      .map(item => item.attributes)
      .reduce((rates, item) => _.set(rates, item.currency, parseFloat(item.rate)), {})
  }
}

export default async function fetchDatabase () {
  const request = await axios({
    method: 'GET',
    url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml',
    responseType: 'stream'
  })

  return stream.subscribe(
    // Original XML string
    request.data,
    // XML to JSON
    new XmlParser(['gesmes:Envelope', 'Cube', 'Cube']),
    // Validate schema against the parsed XML
    stream.applySchema(schema),
    // Simplify data structure
    stream.mapSync(mapper),
    // Reduce entries into a single array
    stream.reduceSync((acc, chunk) => [...acc, chunk], [])
  )
}
