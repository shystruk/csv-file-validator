# CSV File Validator [![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?hashtags=javascript&original_referer=https%3A%2F%2Fpublish.twitter.com%2F&ref_src=twsrc%5Etfw&text=Validation%20of%20CSV%20file%20against%20user%20defined%20schema%20(returns%20back%20object%20with%20data%20and%20invalid%20messages)&tw_p=tweetbutton&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcsv-file-validator&via=shystrukk) #
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php) 
[![codecov](https://codecov.io/gh/shystruk/csv-file-validator/branch/master/graph/badge.svg)](https://codecov.io/gh/shystruk/csv-file-validator)
[![Build Status](https://travis-ci.org/shystruk/csv-file-validator.svg?branch=master)](https://travis-ci.org/shystruk/csv-file-validator)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/csv-file-validator)

Validation of CSV file against user defined schema (returns back object with data and invalid messages)

## Getting csv-file-validator ##

#### npm
`npm install --save csv-file-validator`

#### yarn
`yarn add csv-file-validator --save` 

## Example ##
```javascript
import CSVFileValidator from 'csv-file-validator'

CSVFileValidator(file, config)
    .then(csvData => {
        csvData.data // Array of objects from file
        csvData.inValidMessages // Array of error messages
    })
    .catch(err => {})
```

## API ##
### CSVFileValidator(file, config) ###

#### file ####
Type: `File`

.csv file

##### config #####
Type: `Object` <br>

#### Config example ####
```javascript
const config = {
    headers: [
        { 
            name: 'First Name',
            inputName: 'firstName',
            required: true,
            requiredError: function (headerName, rowNumber, columnNumber) {
                return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`
            }
        },
        { 
            name: 'Last Name', 
            inputName: 'lastName', 
            required: false
        },
        { 
            name: 'Email', 
            inputName: 'email', 
            unique: true, 
            uniqueError: function (headerName) {
                return `${headerName} is not unique`
            }, 
            validate: function(email) {
                return isEmailValid(email)
            }, 
            validateError: function (headerName, rowNumber, columnNumber) {
                return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`
            }
        },
        { 
            name: 'Roles',
            inputName: 'roles',
            isArray: true
        }
    ]
}
```
