import CSVFileValidator, { ParsedResults, ValidatorConfig } from '../src/csv-file-validator'

const requiredError = (headerName: string, rowNumber: number, columnNumber: number) => {
	return `<div class="red">${headerName} is required in the <strong>${rowNumber} row</strong> / <strong>${columnNumber} column</strong></div>`
}

const validateError = (headerName: string, rowNumber: number, columnNumber: number) => {
	return `<div class="red">${headerName} is not valid in the <strong>${rowNumber} row</strong> / <strong>${columnNumber} column</strong></div>`
}

const uniqueError = (headerName: string, rowNumber: number) => {
	return `<div class="red">${headerName} is not unique at the <strong>${rowNumber} row</strong></div>`
}

const isEmailValid = function (email: string) {
	const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
	return reqExp.test(email)
}

const isAgeValid = function (age:number) {
	return age > 0
}

const isPasswordValid = function (password: string) {
	return password.length >= 4
}

interface CSVRow {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	roles: string;
}

interface CSVRow_1 {
	name: string;
	surname: string;
	age: string;
}

const CSVConfig: ValidatorConfig = {
	headers: [
		{ name: 'First Name', inputName: 'firstName', required: true, requiredError },
		{ name: 'Last Name', inputName: 'lastName', required: true, requiredError, optional: true },
		{ name: 'Email', inputName: 'email', required: true, requiredError, unique: true, uniqueError, validate: isEmailValid, validateError },
		{ name: 'Password', inputName: 'password', required: true, requiredError, validate: isPasswordValid, validateError },
		{ name: 'Roles', inputName: 'roles', required: true, requiredError, isArray: true }
	],
	isColumnIndexAlphabetic: true
}

document.getElementById('file').onchange = function (event: any) {
	CSVFileValidator<CSVRow>(event.target.files[0], CSVConfig)
		.then((csvData: ParsedResults) => {
			csvData.inValidData.forEach((item) => {
				document.getElementById('invalidMessages').insertAdjacentHTML('beforeend', item.message)
			})
			console.log(csvData.inValidData)
			console.log(csvData.data)
		})
}

const CSVConfig_1: ValidatorConfig = {
	headers: [
		{ name: 'Name', inputName: 'name', required: true, requiredError },
		{ name: 'Surname', inputName: 'surname', required: true, requiredError, optional: true },
		{ name: 'Age', inputName: 'age', required: true, requiredError, validate: isAgeValid, validateError },
	],
	parserConfig: {
		dynamicTyping: true
	}
}

document.getElementById('file_1').onchange = function (event: any) {
	CSVFileValidator<CSVRow_1>(event.target.files[0], CSVConfig_1)
		.then((csvData: ParsedResults) => {
			csvData.inValidData.forEach((item) => {
				document.getElementById('invalidMessages_1').insertAdjacentHTML('beforeend', item.message)
			})
			console.log(csvData.inValidData)
			console.log(csvData.data)
		})
}
