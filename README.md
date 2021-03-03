# customized-json

 [![npm version](https://badge.fury.io/js/customized-json.svg)](https://badge.fury.io/js/customized-json)
 [![Build Status](https://travis-ci.com/SebastianG77/customized-json.svg?branch=master)](https://travis-ci.com/SebastianG77/customized-json)
 [![Coverage Status](https://coveralls.io/repos/github/SebastianG77/customized-json/badge.svg?branch=master)](https://coveralls.io/github/SebastianG77/customized-json?branch=master)
 [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

 A JSON parser that allows users to overwrite default parsing behavior by customized rules defined in user-defined function that gives the user more useful parameters than the reviver function of default `JSON.parse()` function.

### Usage

Install `customized-json` by running the following command:

```bash
$ npm install customized-json
```

To validate a JSON string you can run the module as described in the following example:

```javascript
const customizedJSON = require('customized-json')

const jsonString = 
`{
  "name": "Carl",
  "pets": [
    {"name": "Charlie", "type": "dog", "age": 5, "isChildFriendly": true },
    {"name": "Lucy", "type": "cat", "age": 7, "isChildFriendly": false }
  ]
}`

const keyPathToLuciesAge = ['pets', 1, 'age']

const increaseLuciesAge = (key, originalValue, stringValue, jsonObject, parentKeys) => {
  if (parentKeys.length === keyPathToLuciesAge.length &&
    parentKeys.every((key, index) => key === keyPathToLuciesAge[index])) {
    return originalValue + 1
  }
  return originalValue
}

const parsedJSON = customizedJSON.parse(jsonString, increaseLuciesAge)

console.log(`Lucie's new age: ${parsedJSON.pets[1].age}`) // Lucie's new age: 8
```

As can be seen in the example above, the reviver function must return a value that represents the new value and takes five different parameters that can be used for determining how to finally assign a value to the current property. The following table describes 

|Parameter|Description|
|:--|:--|
|key|The key name of the current property
|originalValue|The value of the current property as parsed by JSON.parse()
|stringValue|The string value as represented in the transferred JSON string.
|jsonObject|The JSON Object parsed by JSON.parse(). 
|parentKeys|An array representing the key path to the current property. Keys of objects are represented as string values whereas array indices are of type number.

If no function or a reviver function with less than three parameters will be transmitted to `customizedJSON.parse()`, the function `JSON.parse()` will be executed to avoid the overhead caused by the customization function.

### Things To Do
This module is still under construction. Thus, incompatible changes are possible whenever they appear reasonable. A stable version 1.0.0 is expected to be released later in 2021 and will contain the following improvements:

- A customizedJSON.stringify() function for customizing JSON.stringify()
- Examples to show how to use customizedJSON.parse() and customizedJSON.stringify()
