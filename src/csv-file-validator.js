(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined'
		? module.exports = factory(require('papaparse'), require('lodash/isFunction'),
			require('lodash/isString'), require('lodash/isNil'), require('famulus/isValuesUnique'))
		: typeof define === 'function' && define.amd
			? define(['papaparse', 'lodash/isFunction', 'lodash/isString', 'lodash/isNil', 'famulus/isValuesUnique'], factory)
			: (global.myBundle = factory(global.Papa, global._isFunction, global._isString, global._isNil, global.isValuesUnique));
}(this, (function (Papa, _isFunction, _isString, _isNil, isValuesUnique) {
	'use strict';

	Papa = Papa && Papa.hasOwnProperty('default') ? Papa['default'] : Papa;
	isValuesUnique = isValuesUnique && isValuesUnique.hasOwnProperty('default') ? isValuesUnique['default'] : isValuesUnique;
	_isFunction = _isFunction && _isFunction.hasOwnProperty('default') ? _isFunction['default'] : _isFunction;
	_isString = _isString && _isString.hasOwnProperty('default') ? _isString['default'] : _isString;
	_isNil = _isNil && _isNil.hasOwnProperty('default') ? _isNil['default'] : _isNil;

	/**
	 * @param {File} csvFile
	 * @param {Object} config
	 */
	function CSVFileValidator(csvFile, config) {
		return new Promise(function (resolve, reject) {
			if (!config || (config && !config.headers)) {
				return resolve({
					inValidData: [{ message: 'config headers are required' }],
					data: []
				});
			}

			Papa.parse(csvFile, {
				...config.parserConfig,
				skipEmptyLines: true,
				complete: function (results) {
					resolve(_prepareDataAndValidateFile(results.data, config));
				},
				error: function (error, file) {
					reject({ error: error, file: file });
				}
			});
		})
	}

	/**
	 * @param {Array} csvData
	 * @param {Object} config
	 * @private
	 */
	function _prepareDataAndValidateFile(csvData, config) {
		const file = {
			inValidData: [],
			data: []
		};

		csvData.forEach(function (row, rowIndex) {
			const columnData = {};

			// fields are mismatch
			if (rowIndex !== 0 && row.length !== config.headers.length) {
				file.inValidData.push({
					rowIndex,
					message: 'Number of fields mismatch: expected ' + config.headers.length + ' fields' +
						' but parsed ' + row.length + '. In the row ' + rowIndex
				});
			}

			// check if the header matches with a config
			if (rowIndex === 0 && row.length !== config.headers.length && !config.isHeaderNameOptional) {
				config.headers.forEach(function (header, headerIndex) {
					if (header.name !== row[headerIndex]) {
						file.inValidData.push({
							message: 'Header name ' + header.name + ' is not correct or missing'
						});
					}
				})
			}

			row.forEach(function (columnValue, index) {
				const valueConfig = config.headers[index];
				const columnIndex = (config.isColumnIndexAlphabetic)
					? _convertColumnNumberToLetter(index + 1)
					: index + 1;

				columnValue = _clearValue(columnValue);

				if (!valueConfig) {
					return;
				}

				// header validation, skip if isHeaderNameOptional
				if (rowIndex === 0) {
					if (config.isHeaderNameOptional && valueConfig.name === columnValue) {
						return;
					}

					if (!config.isHeaderNameOptional) {
						if (valueConfig.name !== columnValue) {
							file.inValidData.push({
								rowIndex: rowIndex + 1,
								columnIndex: columnIndex,
								message: _isFunction(valueConfig.headerError)
									? valueConfig.headerError(columnValue, valueConfig.name, rowIndex + 1, columnIndex)
									: 'Header name ' + columnValue + ' is not correct or missing in the ' + (rowIndex + 1) + ' row / '
									+ (columnIndex) + ' column. The Header name should be ' + valueConfig.name
							});
						}

						return;
					}
				}

				if (valueConfig.required && _isEmpty(columnValue)) {
					file.inValidData.push({
						rowIndex: rowIndex + 1,
						columnIndex: columnIndex,
						message: _isFunction(valueConfig.requiredError)
							? valueConfig.requiredError(valueConfig.name, rowIndex + 1, columnIndex)
							: String(valueConfig.name + ' is required in the ' + (rowIndex + 1) + ' row / ' + (columnIndex) + ' column')
					});
				} else if (valueConfig.validate && !valueConfig.validate(columnValue)) {
					file.inValidData.push({
						rowIndex: rowIndex + 1,
						columnIndex: columnIndex,
						message: _isFunction(valueConfig.validateError)
							? valueConfig.validateError(valueConfig.name, rowIndex + 1, columnIndex)
							: String(valueConfig.name + ' is not valid in the ' + (rowIndex + 1) + ' row / ' + (columnIndex) + ' column')
					});
				} else if (valueConfig.dependentValidate &&
					!valueConfig.dependentValidate(columnValue, _getClearRow(row))) {
					file.inValidData.push({
						rowIndex: rowIndex + 1,
						columnIndex: columnIndex,
						message: _isFunction(valueConfig.validateError)
							? valueConfig.validateError(valueConfig.name, rowIndex + 1, columnIndex)
							: String(valueConfig.name + ' not passed dependent validation in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
					});
				}
				if (valueConfig.optional) {
					columnData[valueConfig.inputName] = columnValue;
				}

				if (valueConfig.isArray) {
					columnData[valueConfig.inputName] = columnValue
						.split(',')
						.map(value => _isString(value) ? value.trim() : value);
				} else {
					columnData[valueConfig.inputName] = columnValue;
				}
			});

			if (Object.keys(columnData).length) {
				file.data.push(columnData);
			}
		});

		_checkUniqueFields(file, config);

		return file;
	}

	/**
	 * @param {Object} file
	 * @param {Object} config
	 * @private
	 */
	function _checkUniqueFields(file, config) {
		if (!file.data.length) {
			return;
		}

		config.headers
			.filter(function (header) {
				return header.unique;
			})
			.forEach(function (header) {
				if (!isValuesUnique(file.data, header.inputName)) {
					const duplicates = [];

					file.data.forEach((row, rowIndex) => {
						const value = row[header.inputName];

						if (duplicates.indexOf(value) >= 0) {
							file.inValidData.push({
								rowIndex: rowIndex + 2,
								message: _isFunction(header.uniqueError)
									? header.uniqueError(header.name, rowIndex + 2)
									: String(`${header.name} is not unique at the ${rowIndex + 2} row`)
							});
						} else {
							duplicates.push(value);
						}
					});
				}
			});
	}

	/**
	 * @param {Array<string>} row
	 * @private
	 * @return {Array}
	 */
	function _getClearRow(row) {
		return row.map(columnValue => _clearValue(columnValue));
	}

	/**
	 * Remove BOM character if value is a string
	 * @param {String} value
	 * @private
	 * @return {String}
	 */
	function _clearValue(value) {
		return _isString(value)
			? value.replace(/^\ufeff/g, '')
			: value;
	}

	/**
	 * @param {String|*} value
	 * @private
	 * @return {boolean}
	 */
	function _isEmpty(value) {
		if (_isString(value)) {
			return !(!!value.trim().length);
		}

		return _isNil(value);
	}

	/**
	 * Convert column number to column letter
	 * @param {Number} columnNumber
	 * @private
	 * @return {String}
	 */
	function _convertColumnNumberToLetter(columnNumber) {
		let columnLetter = '';

		// Loop through the column number, starting with the least significant digit
		while (columnNumber > 0) {
			// Get the least significant digit and add 1 to it (since 'A' is the first letter)
			let digit = (columnNumber - 1) % 26 + 1;

			// Convert the digit to the corresponding letter and add it to the beginning of the string
			columnLetter = String.fromCharCode(digit + 64) + columnLetter;

			// Divide the column number by 26 and discard the remainder to move on to the next digit
			columnNumber = Math.floor((columnNumber - 1) / 26);
		}

		return columnLetter;
	}

	return CSVFileValidator;
})));
