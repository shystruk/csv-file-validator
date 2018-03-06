import test from 'ava';
import CSVFileValidate from './src/csv-file-validator';

test('module should be a function', t => {
    t.is(typeof CSVFileValidate, 'function');
});
