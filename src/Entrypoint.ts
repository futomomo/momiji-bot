import {readFileSync} from 'fs';

import {Momiji} from './Momiji';

let token: string = '';

try {
    token = readFileSync('token', { 'encoding': 'utf8', 'flag': 'r' });
    console.log('Successfully read token file.');
}
catch (err) {
    console.error('FATAL: Failed to read token from file, please provide a \'token\' file.\n' + err);
    process.exit(1);
}

const momiji: Momiji = new Momiji(token);
token = '';
