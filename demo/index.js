import CSVFileValidator from '../src/csv-file-validator'

const requiredError = (headerName, rowNumber, columnNumber) => {
	return `<div class="red">${headerName} is required in the <strong>${rowNumber} row</strong> / <strong>${columnNumber} column</strong></div>`
}

const validateError = (headerName, rowNumber, columnNumber) => {
	return `<div class="red">${headerName} is not valid in the <strong>${rowNumber} row</strong> / <strong>${columnNumber} column</strong></div>`
}

const uniqueError = (headerName, rowNumber) => {
	return `<div class="red">${headerName} is not unique at the <strong>${rowNumber} row</strong></div>`
}

const isEmailValid = function (email) {
	const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
	return reqExp.test(email)
}

const isAgeValid = function (age) {
	return age > 0
}

const isPasswordValid = function (password) {
	return password.length >= 4
}

const CSVConfig = {
	headers: [
		{ name: 'First Name', inputName: 'firstName', required: true, requiredError },
		{ name: 'Last Name', inputName: 'lastName', required: true, requiredError, optional: true },
		{ name: 'Email', inputName: 'email', required: true, requiredError, unique: true, uniqueError, validate: isEmailValid, validateError },
		{ name: 'Password', inputName: 'password', required: true, requiredError, validate: isPasswordValid, validateError },
		{ name: 'Roles', inputName: 'roles', required: true, requiredError, isArray: true }
	],
	isColumnIndexAlphabetic: true
}

document.getElementById('file').onchange = function (event) {
	CSVFileValidator(event.target.files[0], CSVConfig)
		.then(csvData => {
			csvData.inValidData.forEach(item => {
				document.getElementById('invalidMessages').insertAdjacentHTML('beforeend', item.message)
			})
			console.log(csvData.inValidData)
			console.log(csvData.data)
		})
}

const CSVConfig_1 = {
	headers: [
		{ name: 'Name', inputName: 'name', required: true, requiredError },
		{ name: 'Surname', inputName: 'surname', required: true, requiredError, optional: true },
		{ name: 'Age', inputName: 'age', required: true, requiredError, validate: isAgeValid, validateError },
	],
	parserConfig: {
		dynamicTyping: true
	}
}

document.getElementById('file_1').onchange = function (event) {
	CSVFileValidator(event.target.files[0], CSVConfig_1)
		.then(csvData => {
			csvData.inValidData.forEach(item => {
				document.getElementById('invalidMessages_1').insertAdjacentHTML('beforeend', item.message)
			})
			console.log(csvData.inValidData)
			console.log(csvData.data)
		})
}
