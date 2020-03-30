import {Momiji} from './Momiji';
import {readFileSync} from 'fs';
import {exit} from 'process';

let token: string = '';

try {
    token = readFileSync('token', { 'encoding': 'utf8', 'flag': 'r' });
    console.log('Successfully read token file.');
}
catch (err) {
    console.error('FATAL: Failed to read token from file, please provide a \'token\' file.\n' + err);
    exit(1);
}

const momiji: Momiji = new Momiji(token);
token = '';
