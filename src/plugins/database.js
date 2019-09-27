import makePlugin from 'fastify-plugin'

import fetchDatabase from '../libs/database'
import { ConflictError } from '../libs/errors'

async function fetchCachedDatabase (cacheLength) {
  let database
  if (!database) {
    database = await fetchDatabase()
    setTimeout(() => { database = undefined }, cacheLength)
  }
  return database
}

function handleError (fastify, cacheLength) {
  return async function fetch () {
    try {
      return await fetchCachedDatabase(cacheLength)
    } catch (err) {
      // Backend logging (raw error)
      fastify.log.error(err)
      // Frontend error (nice and readable)
      throw new ConflictError('Unable to retrieve data from the European Central Bank')
    }
  }
}

async function plugin (fastify) {
  // Try at server start just to check if it's working
  await fetchDatabase()

  fastify.decorate('database', {
    fetch: handleError(fastify, 1000 * 60 * 60) // 1h
  })
}

export default makePlugin(plugin, {
  fastify: '^2.0.0',
  name: 'database'
})
