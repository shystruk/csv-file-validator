/// <reference types="node" />

import { ParseConfig } from 'papaparse';

export interface FieldSchema {
	/** Name of the row header (title) */
	name: string;

	/** Key name which will be return with value in a column */
	inputName: string;

	/** Makes column optional. If true column value will be return */
	optional?: boolean;

	/** If required is true then a column value will be checked if it is not empty */
	required?: boolean;

	/** If it is true all header (title) column values will be checked for uniqueness */
	unique?: boolean;

	/**
	 * If column contains list of values separated by comma in return
	 * object it will be as an array.
	 */
	isArray?: boolean;

	/**
	 * If a header name is omitted or is not the same as in config name
	 * headerError function will be called with arguments headerName.
	 */
	headerError?: (headerValue: string, headerName: string, rowNumber: number,
				   columnNumber: number) => string;

	/**
	 * If value is empty requiredError function will be called with
	 * arguments headerName, rowNumber, columnNumber.
	 */
	requiredError?: (headerName: string, rowNumber: number,
					 columnNumber: number) => string;

	/**
	 * If one of the header value is not unique uniqueError function
	 * will be called with argument headerName.
	 */
	uniqueError?: (headerName: string, rowNumber: number) => string;

	/**
	 * Validate column value.
	 * Must return true for valid field and false for invalid.
	 */
	validate?: (field: string|number|boolean) => boolean;

	/**
	 * Validate column value that depends on other values in other columns.
	 * Must return true for valid field and false for invalid.
	 */
	dependentValidate?: (field: string, row: [string]) => boolean;

	/**
	 * If validate returns false validateError function
	 * will be called with arguments headerName, rowNumber, columnNumber.
	 */
	validateError?: (headerName: string, rowNumber: number,
					 columnNumber: number) => string;
}

export interface RowError {
	rowIndex?: number;
	columnIndex?: number;
	message: string;
}

export interface ParsedResults<Row = any, Error = RowError> {
	/** Array of parsed CSV entries */
	data: Row[];

	/** List of validation errors data */
	inValidData: Error[];
}

/** CSV File Validator configuration */
export interface ValidatorConfig {
	headers: FieldSchema[];
	isHeaderNameOptional?: boolean;
	parserConfig?: ParseConfig;
	isColumnIndexAlphabetic?: boolean;
}

export default function CSVFileValidator<Row = any, Error = RowError>(
	csv: string | File | NodeJS.ReadableStream,
	config: ValidatorConfig
): Promise<ParsedResults<Row, Error>>;
