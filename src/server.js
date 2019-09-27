import fastify from 'fastify'
import noAdditionalProperties from 'fastify-no-additional-properties'

import database from './plugins/database'
import errors from './plugins/errors'

import api from './api'

export default function createServer () {
  const server = fastify({
    ignoreTrailingSlash: true,
    logger: {
      level: process.env.LOG_LEVEL || 'info'
    }
  })

  server.register(errors)

  server.register(noAdditionalProperties)

  server.register(database)

  server.register(api)

  return server
}
