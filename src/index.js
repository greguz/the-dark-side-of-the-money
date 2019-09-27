import 'make-promises-safe'

import fastify from 'fastify'
import noAdditionalProperties from 'fastify-no-additional-properties'

import database from './plugins/database'
import errors from './plugins/errors'

import api from './api'

const app = fastify({
  ignoreTrailingSlash: true,
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
})

app.register(errors)

app.register(noAdditionalProperties)

app.register(database)

app.register(api)

app.listen(
  process.env.SERVER_PORT || '8008',
  process.env.SERVER_ADDR || '0.0.0.0',
  (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    } else {
      app.log.info(`Server is listening on ${address}`)
    }
  }
)
