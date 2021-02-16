const customJSON = require('../src/parse')

const { describe, expect, it } = global

describe('Replace string value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "myvalue"}'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'string') { return 'Hello World!' } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: 'Hello World!' })
  })
})

describe('Replace false boolean value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": false}'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'boolean') { return true } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: true })
  })
})

describe('Replace true boolean value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": false}'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'boolean') { return true } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: true })
  })
})

describe('Replace numeric value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": 100}'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'number') { return 222 } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: 222 })
  })
})
