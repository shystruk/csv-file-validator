(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined'
		? module.exports = factory(require('papaparse'), require('lodash/isFunction'), require('famulus/isValuesUnique'))
		: typeof define === 'function' && define.amd
			? define(['papaparse', 'lodash/isFunction', 'famulus/isValuesUnique'], factory)
			: (global.myBundle = factory(global.Papa, global._isFunction, global.isValuesUnique));
}(this, (function (Papa, _isFunction, isValuesUnique) {
	'use strict';

	Papa = Papa && Papa.hasOwnProperty('default') ? Papa['default'] : Papa;
	isValuesUnique = isValuesUnique && isValuesUnique.hasOwnProperty('default') ? isValuesUnique['default'] : isValuesUnique;
	_isFunction = _isFunction && _isFunction.hasOwnProperty('default') ? _isFunction['default'] : _isFunction;

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
					}
				);
			}

			row.forEach(function (columnValue, columnIndex) {
				const valueConfig = config.headers[columnIndex];

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
								columnIndex: columnIndex + 1,
								message: _isFunction(valueConfig.headerError)
									? valueConfig.headerError(columnValue, valueConfig.name, rowIndex + 1, columnIndex + 1)
									: 'Header name ' + columnValue + ' is not correct or missing in the ' + (rowIndex + 1) + ' row / '
									+ (columnIndex + 1) + ' column. The Header name should be ' + valueConfig.name
								}
							);
						}

						return;
					}
				}

				if (valueConfig.required && !columnValue.length) {
					file.inValidData.push({
						rowIndex: rowIndex + 1,
						columnIndex: columnIndex + 1,
						message: _isFunction(valueConfig.requiredError)
							? valueConfig.requiredError(valueConfig.name, rowIndex + 1, columnIndex + 1)
							: String(valueConfig.name + ' is required in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
						}
					);

				} else if (valueConfig.validate && !valueConfig.validate(columnValue)) {
					file.inValidData.push({
						rowIndex: rowIndex + 1,
						columnIndex: columnIndex + 1,
						message: _isFunction(valueConfig.validateError)
							? valueConfig.validateError(valueConfig.name, rowIndex + 1, columnIndex + 1)
							: String(valueConfig.name + ' is not valid in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
						}
					);
				} else if (valueConfig.dependentValidate &&
					!valueConfig.dependentValidate(columnValue, _getClearRow(row))) {
					file.inValidData.push({
						rowIndex: rowIndex + 1,
						columnIndex: columnIndex + 1,
						message: _isFunction(valueConfig.validateError)
							? valueConfig.validateError(valueConfig.name, rowIndex + 1, columnIndex + 1)
							: String(valueConfig.name + ' not passed dependent validation in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
						}
					);
				}
				if (valueConfig.optional) {
					columnData[valueConfig.inputName] = columnValue;
				}

				if (valueConfig.isArray) {
					columnData[valueConfig.inputName] = columnValue.split(',').map(value => value.trim());
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
								}
							);
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
	 * Remove BOM character
	 * @param {String} value
	 * @private
	 * @return {String}
	 */
	function _clearValue(value) {
		return value.replace(/^\ufeff/g, '');
	}

	return CSVFileValidator;
})));
