const customJSON = require('../src/parse')

const { describe, expect, it } = global

describe('Replace string key', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "myvalue"}'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'string') { return 'Hello World!' } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: 'Hello World!' })
  })
})
