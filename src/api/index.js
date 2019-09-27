import routeConvert from './c​onvert'

export default function plugin (fastify, _options, callback) {
  fastify.route(routeConvert)

  callback()
}
