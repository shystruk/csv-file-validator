// Type definitions for csv-file-validator 1.10
// Project: https://github.com/shystruk/csv-file-validator
// Definitions by: Javier Rojo <https://github.com/javierlinked>
/// <reference types="node" />

declare module 'csv-file-validator' {
	function CSVFileValidator<T = any>(
		file: string | File | NodeJS.ReadableStream,
		config: ICSVFile
	): Promise<ParseResult<T>>;

	interface ICSVFile {
		isHeaderNameOptional?: boolean;
		headers: ICSVField[];
	}

	interface ICSVField {
		name: string;
		inputName: string;
		unique?: boolean;
		required?: boolean;
		isArray?: boolean;

		//callbacks
		uniqueError?(headerName: string): string;
		validate?(value: string): any;
		validateError?(headerName: string, rowNumber: string, columnNumber: string): string;
	}

	interface ParseResult<T> {
		inValidMessages: ParseError[];
		data: T[];
	}

	interface ParseError {
		type: string; // A generalization of the error
		code: string; // Standardized error code
		message: string; // Human-readable details
		row: number; // Row index of parsed data where error is
	}
}
