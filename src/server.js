import fastify from 'fastify'
import noAdditionalProperties from 'fastify-no-additional-properties'

import database from './plugins/database'
import errors from './plugins/errors'

import api from './api'

export default function createServer (options) {
  const instance = fastify({
    ignoreTrailingSlash: true,
    ...options
  })

  instance.register(errors)

  instance.register(noAdditionalProperties)

  instance.register(database)

  instance.register(api)

  return instance
}
