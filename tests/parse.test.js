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
    const jsonString = '{"mykey": true}'
    const newValue = false
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'boolean') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: newValue })
  })
})

describe('Replace numeric value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": 100}'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'number') { return 222 } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: 222 })
  })
})

describe('Replace negative numeric value by positive value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": -100}'
    const newValue = 2
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'number') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: newValue })
  })
})

describe('Replace negative numeric value by negative value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": -1}'
    const newValue = -22
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'number') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: newValue })
  })
})

describe('Replace string value by null', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "myvalue"}'
    const newValue = null
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'string') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: newValue })
  })
})

describe('Replace null value by String', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": null}'
    const newValue = 'myvalue'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (originalValue === null) { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: newValue })
  })
})

describe('Replace array of string values', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": ["first", "second"]}'
    const newValue = 'newValue'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'string') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: [newValue, newValue] })
  })
})

describe('Replace an object by a new object', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "myvalue"}'
    const newValue = { newKey: 'newValue' }
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'object') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual(newValue)
  })
})

describe('Replace an object and its contained value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "myvalue"}'
    const newStringValue = 'myvalue'
    const newObjectValue = { newKey: 'newValue' }
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'object') { return newObjectValue } else if (typeof originalValue === 'string') { return newStringValue } else { return originalValue } })
    expect(parsedJSON).toEqual(newObjectValue)
  })
})

describe('Replace string value with escaped quotationsmarks', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "my\\"value\\""}'
    const newValue = 'newValue'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'string') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: newValue })
  })
})

describe('Replace string value of property "mykey" if parent is "parentKey"', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "myvalue", "parentKey": {"mykey": "myvalue"}}'
    const newValue = 'newValue'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'string' && parentKeys.toString() === 'parentKey,mykey') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: 'myvalue', parentKey: { mykey: newValue } })
  })
})

describe('Replace an array and its contained value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": ["first", "second", "third"]}'
    const newStringValue = 'myvalue'
    const newArrayValue = ['fourth']
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (Array.isArray(originalValue)) { return newArrayValue } else if (typeof originalValue === 'string') { return newStringValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: newArrayValue })
  })
})

describe('Replace a specific array value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": ["first", "second", "third"]}'
    const newValue = 'newValue'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'string' && parentKeys.toString() === 'mykey,1') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: ['first', newValue, 'third'] })
  })
})

describe('Replace Big Number value by its proper string representation', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"smallNumber": 1, "bigNumber" : 987654321123456789987654321}'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => { if (typeof originalValue === 'number' && originalValue.toString() !== stringValue) { return stringValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ smallNumber: 1, bigNumber: '987654321123456789987654321' })
  })
})

describe('Use default JSON reviver function for customizing a JSON Object.', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "myvalue"}'
    const newValue = 'newValue'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue) => { if (key === 'mykey') { return newValue } else { return originalValue } })
    expect(parsedJSON).toEqual({ mykey: newValue })
  })
})

describe('Replace value if sibling has key "otherKey"', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '{"mykey": "myvalue", "myObject": {"mykey": "myOtherValue", "otherKey": "anyValue"}}'
    const newValue = true
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => {
      if (parentKeys.slice(0, parentKeys.length - 1).reduce((accumulator, currentValue) => accumulator[currentValue], jsonObject).otherKey !== undefined && key !== 'otherKey') { return newValue } else { return originalValue }
    })
    expect(parsedJSON).toEqual({ mykey: 'myvalue', myObject: { mykey: true, otherKey: 'anyValue' } })
  })
})

describe('Replace isolated string value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '"myvalue"'
    const newValue = 'myOtherValue'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => {
      return newValue
    })
    expect(parsedJSON).toEqual(newValue)
  })
})

describe('Replace isolated boolean value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = 'true'
    const newValue = false
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => {
      return newValue
    })
    expect(parsedJSON).toEqual(newValue)
  })
})

describe('Replace isolated numeric value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '-20'
    const newValue = 20
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => {
      return newValue
    })
    expect(parsedJSON).toEqual(newValue)
  })
})

describe('Replace isolated array', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '[321, "myValue", false]'
    const newNumericValue = 2000
    const newStringValue = 'newValue'
    const newBooleanValue = true
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => {
      switch (typeof originalValue) {
        case 'number':
          return newNumericValue
        case 'string':
          return newStringValue
        case 'boolean':
          return true
        default:
          return originalValue
      }
    })
    expect(parsedJSON).toEqual([newNumericValue, newStringValue, newBooleanValue])
  })
})

describe('Replace isolated null value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = 'null'
    const newValue = undefined
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => {
      return newValue
    })
    expect(parsedJSON).toEqual(newValue)
  })
})

describe('Replace a JSON-Object with special characters', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '\n{"ordinaryKey": "ordinaryValue","special\\tkey":\t"myval\'\\\\n\\r\\"ue"}'
    const newValue = 'newValue'
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => {
      if (key === 'special\tkey') {
        return newValue
      }
      return originalValue
    })
    expect(parsedJSON).toEqual({ ordinaryKey: 'ordinaryValue', 'special\tkey': newValue })
  })
})

describe('Replace a deeply nested value', () => {
  it('returns the expected JSON object', () => {
    const jsonString = '[321, {"anotherKey": false, "mykey": {"nestedKey": ["arrayValue", 2, true, [50, "secondNestedValue"]]}}, false]'
    const newValue = [321, 'myValue', null, false, { objectProperty: true }]
    const expectedParentKeys = [1, 'mykey', 'nestedKey', 3, 0]
    const parsedJSON = customJSON.parse(jsonString, (key, originalValue, stringValue, jsonObject, parentKeys) => {
      if (parentKeys.length === expectedParentKeys.length &&
        parentKeys.every((value, index) => value === expectedParentKeys[index])) {
        return newValue
      }
      return originalValue
    })
    expect(parsedJSON).toEqual([321, { anotherKey: false, mykey: { nestedKey: ['arrayValue', 2, true, [[321, 'myValue', null, false, { objectProperty: true }], 'secondNestedValue']] } }, false])
  })
})
