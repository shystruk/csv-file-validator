import { expectType } from 'tsd';
import CSVFileValidator, { ParsedResults, ValidatorConfig } from './csv-file-validator';

const CSVConfig: ValidatorConfig = {
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

expectType<Promise<ParsedResults<Array<string>, Error>>>(CSVFileValidator(CSVValidFile, CSVConfig));
