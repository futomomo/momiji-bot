import * as Discord from 'discord.js';
import * as fs from 'fs';
let momiji : Discord.Client = new Discord.Client();
let token : string;

momiji.on('ready',
          () => {
            console.log('Successfully logged in to Discord!');
          });

process.stdin.on('data', (data : Object) => {
  console.log(`I recieved the following data in stdin: ${data}`);
});


// -------- RUNTIME CODE -------
// NO STATIC DECLARATION BELOW THIS POINT

try {
  token = fs.readFileSync('token', {'encoding': 'utf8', 'flag': 'r'});
  console.log('Successfully read token file.');
} catch(err) {
  console.error('FATAL: Failed to read token from file, please provide a \'token\' file.\n' + err);
  process.exit(1);
}

momiji.login(token)
  .catch((error) => {
    console.error('Login to Discord failed.\n' + error);
    momiji.destroy();
    process.exit(2);
  });
