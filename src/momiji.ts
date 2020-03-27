import {ChildProcess, fork} from 'child_process';
import {createInterface, Interface, ReadLineOptions} from 'readline';

// ------- READLINE INIT ----------
const term_options : ReadLineOptions = {
  'input': process.stdin,
  'output': process.stdout,
  'prompt': 'awoo> '
};
const term : Interface = createInterface(term_options);

// ----- CLIENT PROCESS CODE -----
const momiji_options : Object = {'cwd': './', 'detached': false, 'silent': true};
let momiji_proc : ChildProcess = fork('./momiji-client.js', [], momiji_options);

momiji_proc.on('exit', (code : number) => {
  console.log(`PARENT: Momiji child process has exited with exit code ${code}.`);
});

// ----- READLINE CODE -----

term.on('line', (line : string) => {
  momiji_proc.stdin.write(line, (error : Error) => {
    if(error)
    {
      console.error(`PARENT: Error when writing to momiji client process stdin.\n${error.message}`);
    }
    term.prompt();
  });
});

// ------------ RUNTIME CODE ------------
term.prompt();
