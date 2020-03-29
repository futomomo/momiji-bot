import {Momiji} from './Momiji';
import * as fs from 'fs';
import * as process from 'process';

let token: string = '';

try {
    token = fs.readFileSync('token', { 'encoding': 'utf8', 'flag': 'r' });
    console.log('Successfully read token file.');
}
catch (err) {
    console.error('FATAL: Failed to read token from file, please provide a \'token\' file.\n' + err);
    process.exit(1);
}

const momiji: Momiji = new Momiji(token);
token = '';
