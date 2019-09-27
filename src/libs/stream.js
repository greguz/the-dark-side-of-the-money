import pump from 'pump'
import { Transform, Writable } from 'stream'
import Ajv from 'ajv'

export function subscribe (...args) {
  return new Promise((resolve, reject) => {
    let result

    const collector = new Writable({
      objectMode: true,
      write (chunk, _encoding, callback) {
        result = chunk
        callback()
      }
    })

    pump(...args, collector, err => err ? reject(err) : resolve(result))
  })
}

export function reduceSync (reducer, initialValue) {
  let accumulator = initialValue

  return new Transform({
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

export function mapSync (mapper) {
  return new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      callback(null, mapper(chunk, encoding))
    }
  })
}

export function applySchema (schema) {
  var ajv = new Ajv()
  var validate = ajv.compile(schema)

  return new Transform({
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