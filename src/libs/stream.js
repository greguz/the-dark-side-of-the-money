import { transform } from 'fluido'
import Ajv from 'ajv'

/**
 * Like Array.reduce() but for streams
 */
export function reduceSync (reducer, initialValue) {
  let accumulator = initialValue

  return transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      accumulator = reducer(accumulator, chunk, encoding)
      callback()
    },
    flush (callback) {
      this.push(accumulator)
      callback()
    }
  })
}

/**
 * Sync wrapper of a Transform stream
 */
export function mapSync (mapper) {
  return transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      callback(null, mapper(chunk, encoding))
    }
  })
}

/**
 * Validate any stream chunk against a JSON schema
 */
export function applySchema (schema) {
  var ajv = new Ajv()
  var validate = ajv.compile(schema)

  return transform({
    objectMode: true,
    transform (chunk, _encoding, callback) {
      if (!validate(chunk)) {
        callback(validate.errors)
      } else {
        callback(null, chunk)
      }
    }
  })
}
