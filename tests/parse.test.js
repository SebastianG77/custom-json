const customJSON = require('../src/parse')

const { describe, expect, it } = global

describe('Validate a JSON file that does not contain any duplicates', () => {
  it('returns an empty list', () => {
    const jsonString = '{"mykey": "myvalue"}'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'string') { return 'Hello World!' } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: 'Hello World!' })
  })
})
