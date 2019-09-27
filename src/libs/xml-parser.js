import { Parser } from 'htmlparser2'
import { Transform } from 'stream'
import _ from 'lodash'

export default class XmlParser extends Transform {
  constructor (path = [], options = {}) {
    super({
      ...options,
      objectMode: true
    })

    const targetPath = typeof path === 'string' ? path.split('.') : path
    const currentPath = []
    let tree

    function match () {
      if (targetPath.length <= 0) {
        return true
      }
      if (currentPath.length !== targetPath.length) {
        return false
      }
      for (let i = 0; i < targetPath.length; i++) {
        const targetTag = targetPath[i]
        const currentTag = currentPath[i]
        if (currentTag !== targetTag && targetTag !== '*') {
          return false
        }
      }
      return true
    }

    this._parser = new Parser(
      {
        onopentag: (name, attributes) => {
          currentPath.push(name)

          if (!tree && match()) {
            tree = []
          }

          if (tree) {
            const node = {
              type: 'element',
              name,
              attributes,
              elements: []
            }

            const parent = _.last(tree)
            if (parent) {
              parent.elements.push(node)
            }

            tree.push(node)
          }
        },
        ontext: text => {
          if (tree) {
            _.last(tree).elements.push({
              type: 'text',
              text
            })
          }
        },
        oncomment: comment => {
          if (tree) {
            _.last(tree).elements.push({
              type: 'comment',
              comment
            })
          }
        },
        onclosetag: () => {
          currentPath.pop()

          if (tree) {
            const node = tree.pop()

            if (tree.length <= 0) {
              tree = undefined
              this.push(node)
            }
          }
        },
        onend: () => {
          this._close()
        },
        onerror: err => {
          this.emit('error', err)
        }
      },
      {
        decodeEntities: true,
        xmlMode: true
      }
    )
  }

  _transform (chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = chunk.toString('utf8')
    }
    this._parser.write(chunk)
    callback()
  }

  _final (callback) {
    this._close = callback
    this._parser.end()
  }
}
