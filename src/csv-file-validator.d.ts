// Type definitions for csv-file-validator 1.10
// Project: https://github.com/shystruk/csv-file-validator
// Definitions by: Igor Levkov <https://github.com/igors-levkovs>
/// <reference types="node" />

export interface FieldSchema<Error = string> {
	/** Name of the row header (title) */
	name: string;
	/** Key name which will be return with value in a column */
	inputName: string;
	/** Makes column optional. If true column value will be return */
	optional?: boolean;
	/** If required is true than a column value will be checked if it is not empty */
	required: boolean;
	/** If it is true all header (title) column values will be checked for uniqueness */
	unique?: boolean;
	/** If column contains list of values separated by comma in return object it will be as an array */
	isArray?: boolean;
	/** If a header name is omitted or is not the same as in config name headerError function will be called with arguments headerName */
	headerError?: (headerValue: string, headerName: string, rowNumber: number, columnNumber: number) => Error;
	/** If value is empty requiredError function will be called with arguments headerName, rowNumber, columnNumber */
	requiredError?: (headerName: string, rowNumber: number, columnNumber: number) => Error;
	/** If one of the header value is not unique uniqueError function will be called with argument headerName */
	uniqueError?: (headerName: string, rowNumber: number) => Error;
	/** Validate column value. Must return true for valid field and false for invalid */
	validate?: (field: string) => boolean;
	/** If validate returns false validateError function will be called with arguments headerName, rowNumber, columnNumber */
	validateError?: (headerName: string, rowNumber: number, columnNumber: number) => Error;
}

export interface ParsedResults<Row = any, Error = string> {
	/** Array of parsed CSV entries */
	data: Row[];
	/** List of validation error messages */
	inValidMessages: Error[];
}

/** CSV File Validator configuration */
export interface ValidatorConfig<Error = string> {
	headers: FieldSchema<Error>[];
	isHeaderNameOptional?: boolean;
}

export default function CSVFileValidator<Row = any, Error = string>(
	csv: string | File | NodeJS.ReadableStream,
	config: ValidatorConfig<Error>
): Promise<ParsedResults<Row, Error>>;