import test from 'ava';
import CSVFileValidator from './src/csv-file-validator';

test('module should be a function', t => {
    t.is(typeof CSVFileValidator, 'function');
});
