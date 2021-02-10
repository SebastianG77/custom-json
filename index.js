const parse = (jsonString, reviver) => {
  console.log(JSON.stringify(parseValue(jsonString, 0), null, 2))
}

const parseValue = (jsonString, currentCharIndex) => {
  for (let i = currentCharIndex; i < jsonString.length; i++) {
    const currentChar = jsonString.charAt(i)
    if (currentChar === '"') {
      return parseString(jsonString, i)
    } else if (isNumericValue(currentChar)) {
      return parseNumber(jsonString, i)
    } else if (currentChar === 't' || currentChar === 'f') {
      return parseBoolean(jsonString, i)
    } else if (currentChar === 'n') {
      return parseNull(jsonString, i)
    } else if (currentChar === '{') {
      return parseObject(jsonString, i)
    } else if (currentChar === '[') {
      return parseArray(jsonString, i)
    }
  }
  return null
}

const parseObject = (jsonString, currentCharIndex) => {
  let currentKey
  let keyFound = false
  const object = {}
  for (let i = currentCharIndex; i < jsonString.length; i++) {
    const char = jsonString.charAt(i)
    if (char === '}') {
      return { value: object, currentIndex: i }
    } else if (keyFound) {
      const { value, currentIndex } = parseValue(jsonString, i, currentKey)
      object[currentKey] = value
      i = currentIndex
      keyFound = false
    } else {
      if (char === '"') {
        const { value, currentIndex } = parseString(jsonString, i)
        keyFound = true
        currentKey = value
        i = currentIndex
      }
    }
  }
}

const isNumericValue = (char) => /\d/.test(char) || char === '-' || char.toLowerCase() === 'e'

const parseString = (jsonString, currentCharIndex) => {
  let value = ''
  let whiteSpaceFound = false
  let isEscaped = false
  for (let i = currentCharIndex; i < jsonString.length; i++) {
    const currentChar = jsonString.charAt(i)
    if (currentChar === '"') {
      if (isEscaped) {
        isEscaped = false
      } else {
        if (whiteSpaceFound) {
          return { value: value, currentIndex: i }
        } else {
          whiteSpaceFound = true
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
  let value = ''
  for (let i = currentCharIndex; i < jsonString.length; i++) {
    const currentChar = jsonString.charAt(i)
    if (isNumericValue(currentChar)) {
      value += currentChar
    } else {
      return { value: value, currentIndex: i }
    }
  }
}

const parseBoolean = (jsonString, currentCharIndex) => {
  const lastBooleanValueIndex = jsonString.charAt(currentCharIndex) === 't'
    ? currentCharIndex + 3
    : currentCharIndex + 4
  const value = jsonString.substring(currentCharIndex, lastBooleanValueIndex + 1)
  if (isBoolean(value)) {
    return { value: value, currentIndex: lastBooleanValueIndex }
  } else {
    throw new Error(`Incorrect boolean parsing for ${value}`)
  }
}

const isBoolean = (value) => value === 'true' || value === 'false'

const parseNull = (jsonString, currentCharIndex) => {
  return { value: null, currentIndex: currentCharIndex + 3 }
}

const parseArray = (jsonString, currentCharIndex) => {
  const array = []
  for (let i = currentCharIndex + 1; i < jsonString.length; i++) {
    if (jsonString.charAt(i) === ']') {
      return { value: array, currentIndex: i }
    }
    const { value, currentIndex } = parseValue(jsonString, i)
    array.push(value)
    i = currentIndex
  }
}

module.exports.parse = parse
