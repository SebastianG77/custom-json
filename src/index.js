const parser = require('./parse')

const parse = (jsonString, reviver) => parser.parse(jsonString, reviver)

module.exports = {
  parse: parse
}
