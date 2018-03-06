(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(require('papaparse'), require('lodash/uniqBy'), require('lodash/isFunction'))
        : typeof define === 'function' && define.amd 
            ? define(['papaparse', 'lodash/uniqBy', 'lodash/isFunction'], factory)
            : (global.myBundle = factory(global.Papa,global._uniqBy,global._isFunction));
}(this, (function (Papa, _uniqBy, _isFunction) {
    'use strict';

    Papa = Papa && Papa.hasOwnProperty('default') ? Papa['default'] : Papa;
    _uniqBy = _uniqBy && _uniqBy.hasOwnProperty('default') ? _uniqBy['default'] : _uniqBy;
    _isFunction = _isFunction && _isFunction.hasOwnProperty('default') ? _isFunction['default'] : _isFunction;

    /**
     * @param {File} csvFile 
     * @param {Object} config 
     */
    function CSVFileValidator (csvFile, config) {
        return new Promise((resolve, reject) => {
            Papa.parse(csvFile, {
                complete: function(results) {
                    resolve(_prepareDataAndValidateFile(results.data, config));
                },
                error: function(error, file) {
                    reject({error, file});
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
            inValidMessages: [],
            data: []
        };

        csvData.splice(0,1); // skip first row as a header
        csvData.forEach((row, rowIndex) => {
            const columnData = {};

            row.forEach((columnValue, columnIndex) => {
                const valueConfig = config.headers[columnIndex];

                if (!valueConfig) {
                    return;
                }

                if (valueConfig.required && !columnValue.length) {
                    file.inValidMessages.push(
                        _isFunction(valueConfig.requiredError)
                            ? valueConfig.requiredError(valueConfig.name, rowIndex + 2, columnIndex + 1)
                            : valueConfig.requiredError
                    );
                } else if (valueConfig.validate && !valueConfig.validate(columnValue)) {
                    file.inValidMessages.push(
                        _isFunction(valueConfig.validateError)
                            ? valueConfig.validateError(valueConfig.name, rowIndex + 2, columnIndex + 1)
                            : valueConfig.validateError
                    );
                }

                if (valueConfig.isArray) {
                    columnData[valueConfig.inputName] = columnValue.split(',').map(value => value.trim());
                } else {
                    columnData[valueConfig.inputName] = columnValue;
                }
            });

            file.data.push(columnData);
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
            .filter(header => header.unique)
            .forEach(header => {
                if (_uniqBy(file.data, header.inputName).length !== file.data.length) {
                    file.inValidMessages.push(header.uniqueErrorMessage);
                }
            });
    };

    return CSVFileValidator;
})));
