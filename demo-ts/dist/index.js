"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_file_validator_1 = __importDefault(require("../src/csv-file-validator"));
const requiredError = (headerName, rowNumber, columnNumber) => {
    return `<div class="red">${headerName} is required in the <strong>${rowNumber} row</strong> / <strong>${columnNumber} column</strong></div>`;
};
const validateError = (headerName, rowNumber, columnNumber) => {
    return `<div class="red">${headerName} is not valid in the <strong>${rowNumber} row</strong> / <strong>${columnNumber} column</strong></div>`;
};
const uniqueError = (headerName, rowNumber) => {
    return `<div class="red">${headerName} is not unique at the <strong>${rowNumber} row</strong></div>`;
};
const isEmailValid = function (email) {
    const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    return reqExp.test(email);
};
const isPasswordValid = function (password) {
    return password.length >= 4;
};
const CSVConfig = {
    headers: [
        { name: 'First Name', inputName: 'firstName', required: true, requiredError },
        { name: 'Last Name', inputName: 'lastName', required: true, requiredError, optional: true },
        { name: 'Email', inputName: 'email', required: true, requiredError, unique: true, uniqueError, validate: isEmailValid, validateError },
        { name: 'Password', inputName: 'password', required: true, requiredError, validate: isPasswordValid, validateError },
        { name: 'Roles', inputName: 'roles', required: true, requiredError, isArray: true }
    ]
};
document.getElementById('file').onchange = function (event) {
    csv_file_validator_1.default(event.target.files[0], CSVConfig)
        .then((csvData) => {
        csvData.inValidMessages.forEach((message) => {
            document.getElementById('invalidMessages').insertAdjacentHTML('beforeend', message);
        });
        console.log(csvData.inValidMessages);
        console.log(csvData.data);
    });
};
//# sourceMappingURL=index.js.map