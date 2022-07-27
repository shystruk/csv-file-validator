"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsd_1 = require("tsd");
const csv_file_validator_1 = __importDefault(require("./csv-file-validator"));
const CSVConfig = {
    headers: [
        { name: 'First Name', inputName: 'firstName', required: true },
        { name: 'Last Name', inputName: 'lastName', required: true },
        { name: 'Email', inputName: 'email', required: true, unique: true },
        { name: 'Password', inputName: 'password', required: true },
        { name: 'Roles', inputName: 'roles', required: true, isArray: true },
        { name: 'Country', inputName: 'country', optional: true }
    ]
};
const CSVHeader = CSVConfig.headers.map(i => i.name).join(';');
const CSVValidFile = [
    CSVHeader,
    'Vasyl;Stokolosa;v.stokol@gmail.com;123123;admin,manager',
    'Vasyl;Stokolosa;fake@test.com;123123123;user;Ukraine',
].join('\n');
(0, tsd_1.expectType)((0, csv_file_validator_1.default)(CSVValidFile, CSVConfig));
//# sourceMappingURL=csv-file-validator.test-d.js.map