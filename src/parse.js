const parse = (jsonString, reviver) => {
  if (reviver == null || reviver.length <= 2) {
    return JSON.parse(jsonString, reviver)
  } else {
    const standardJSON = JSON.parse(jsonString)
    return parseValue(jsonString, 0, [], standardJSON, reviver).modifiedJSON
  }
}

const parseValue = (jsonString, currentCharIndex, parentKeys, parsedJSON, reviver) => {
  let valueObject
  let i = currentCharIndex
  for (i; i < jsonString.length; i++) {
    const currentChar = jsonString.charAt(i)
    if (currentChar === '"') {
      valueObject = parseString(jsonString, i)
      break
    } else if (isNumericValue(currentChar)) {
      valueObject = parseNumber(jsonString, i)
      break
    } else if (currentChar === 't' || currentChar === 'f') {
      valueObject = parseBoolean(jsonString, i)
      break
    } else if (currentChar === 'n') {
      valueObject = parseNull(jsonString, i)
      break
    } else if (currentChar === '{') {
      valueObject = parseObject(jsonString, i, parentKeys, parsedJSON, reviver)
      break
    } else if (currentChar === '[') {
      valueObject = parseArray(jsonString, i, parentKeys, parsedJSON, reviver)
      break
    }
  }

  const modifiedJSON = prepareReviver(parentKeys, valueObject.value, valueObject.modifiedJSON === undefined ? parsedJSON : valueObject.modifiedJSON, reviver)
  return { value: valueObject.value, lastValueIndex: valueObject.lastValueIndex, modifiedJSON: modifiedJSON }
}

const parseObject = (jsonString, currentCharIndex, parentKeys, parsedJSON, reviver) => {
  let keyFound = false
  const object = {}
  let modifiedJSON
  for (let i = currentCharIndex; i < jsonString.length; i++) {
    const char = jsonString.charAt(i)
    if (char === '}') {
      return { value: object, lastValueIndex: i, modifiedJSON }
    } else if (keyFound) {
      const currentKey = parentKeys[parentKeys.length - 1]
      const valueObject = parseValue(jsonString, i, parentKeys, parsedJSON, reviver)
      object[currentKey] = valueObject.value
      i = valueObject.lastValueIndex
      modifiedJSON = valueObject.modifiedJSON
      parentKeys.pop()
      keyFound = false
    } else {
      if (char === '"') {
        const { value, lastValueIndex } = parseString(jsonString, i)
        parentKeys.push(value)
        keyFound = true
        i = lastValueIndex
      }
    }
  }
}

const isNumericValue = (char) => /\d/.test(char) || char === '-' || char.toLowerCase() === 'e'

const parseString = (jsonString, currentCharIndex) => {
  let value = ''
  let firstQuotationMarkFound = false
  let isEscaped = false
  for (let i = currentCharIndex; i < jsonString.length; i++) {
    const currentChar = jsonString.charAt(i)
    if (currentChar === '"') {
      if (isEscaped) {
        isEscaped = false
      } else {
        if (firstQuotationMarkFound) {
          return { value: value, lastValueIndex: i }
        } else {
          firstQuotationMarkFound = true
          continue
        }
      }
    } else if (currentChar === '\\') {
      isEscaped = true
    }
    value += currentChar
  }
}

const parseNumber = (jsonString, currentCharIndex) => {
  let currentChar
  let value = ''
  let i = currentCharIndex
  let lastValueIndex = i
  while (i < jsonString.length && isNumericValue(currentChar = jsonString.charAt(i))) {
    value += currentChar
    lastValueIndex = i++
  }
  return { value: value, lastValueIndex: lastValueIndex }
}

const parseBoolean = (jsonString, currentCharIndex) => {
  const lastBooleanValueIndex = jsonString.charAt(currentCharIndex) === 't'
    ? currentCharIndex + 3
    : currentCharIndex + 4
  const value = jsonString.substring(currentCharIndex, lastBooleanValueIndex + 1)
  return { value: value, lastValueIndex: lastBooleanValueIndex }
}

const parseNull = (jsonString, currentCharIndex) => {
  return { value: null, lastValueIndex: currentCharIndex + 3 }
}

const parseArray = (jsonString, currentCharIndex, parentKeys, parsedJSON, reviver) => {
  const array = []
  let modifiedJSON
  for (let i = currentCharIndex + 1; i < jsonString.length; i++) {
    if (jsonString.charAt(i) === ']') {
      return { value: array, lastValueIndex: i, modifiedJSON: modifiedJSON }
    }
    parentKeys.push(array.length)
    const valueObject = parseValue(jsonString, i, parentKeys, parsedJSON, reviver)
    parentKeys.pop()
    array.push(valueObject.value)
    i = valueObject.lastValueIndex
    modifiedJSON = valueObject.modifiedJSON
  }
}

const prepareReviver = (parentKeys, stringValue, parsedJSON, reviver) => {
  const originalValue = findOriginalValue(parsedJSON, parentKeys)
  return setKeyValue(parsedJSON, parentKeys, reviver(parentKeys[parentKeys.length - 1], originalValue, stringValue, parsedJSON, parentKeys))
}

const findOriginalValue = (parsedJSON, parentKeys) => parentKeys.reduce((accumulator, currentValue) => accumulator[currentValue], parsedJSON)

const setKeyValue = (parsedJSON, parentKeys, newValue) => {
  if (parentKeys.length === 0) {
    return newValue
  } else {
    findOriginalValue(parsedJSON, parentKeys.slice(0, parentKeys.length - 1))[parentKeys[parentKeys.length - 1]] = newValue
    return parsedJSON
  }
}

module.exports.parse = parse
