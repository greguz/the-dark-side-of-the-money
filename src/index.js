import 'make-promises-safe'

import createServer from './server'

const server = createServer()

server.listen(
  process.env.SERVER_PORT || '8008',
  process.env.SERVER_ADDR || '0.0.0.0',
  (err, address) => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    } else {
      server.log.info(`Server is listening on ${address}`)
    }
  }
)
