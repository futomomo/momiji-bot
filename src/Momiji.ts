import { SlowBuffer } from 'buffer';
import {Dirent, readdirSync} from 'fs';
import * as os from 'os';

import {BaseBot, Discord} from './BaseBot';
import {Command} from './Command';
import {MomijiAPI} from './MomijiAPI';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


export class Momiji extends BaseBot implements MomijiAPI {
  private commands: Map<string, Command>;
  private is_exiting: boolean = false;

  constructor(token: string) {
    super();

    this.commands = new Map();

    process.on('SIGINT', (signal: NodeJS.Signals) =>
               this.OnSignal(signal));

    this.ImportCommands();

    this.client.login(token)
    .catch((error: Error) => {
      console.error('ERROR: Failed to log into Discord:\n' + error.message);
      this.OnExit();
    });
  };

  private async ImportCommands(): Promise<void> {
    this.commands = new Map();
    const commands_path: string = 'bin/commands/';
    let dir_list: Dirent[] = readdirSync(commands_path, {'encoding': 'utf8', 'withFileTypes': true});
    const whitespace_regex = /[\s]/g;
    for(let entry of dir_list) {
      if(entry.isFile() && entry.name.endsWith('.js')) {
        try {
	  let module: any;
	  if (os.type() === 'Windows_NT')
	    module = await import('.\\commands\\'+entry.name); // this makes me feel bad  and probably only works on Windows TODO: fix somehow
	  else
	    module = await import('./commands/'+entry.name);

          if(module.GetCommand !== undefined) {
            const command: Command = module.GetCommand();
            const name: string = command.GetName();
            if(name.search(whitespace_regex) !== -1) {
              console.warn(`WARN: Command class in file ${entry.name} returns a name with invalid characters at ${name.search(whitespace_regex)}\nThe command was not added.`);
              continue;
            }

            console.log(`Found command !${name}.`);
            this.commands.set(name, command);

          }
        } catch(error) {
          console.error(`ERROR: Failed to import ${entry.name}\n${error}`);
        }
      }
    }
  };

  protected OnReady(): void {
    console.log('Successfully logged into Discord!');
  };

  protected OnMessage(message: Discord.Message): void {
    const command_char = '!';
    if(message.author.bot) return;
    if(message.content.toLowerCase().includes("awoo")) this.ReactWithAwoo(message);
    if(message.content.startsWith(command_char)) {
      this.HandleCommand(message);
      return;
    }
    if (message.content.startsWith('Momiji ')) {
      this.HandleQuestion(message);
      return;
    }
  };

  protected OnMessageUpdate(old_message: Discord.Message, new_message: Discord.Message): void {
    if((old_message.content != new_message.content)) this.OnMessage(new_message);
    if(new_message.content.toLowerCase().includes("awoo")) this.ReactWithAwoo(new_message);
  };

  protected OnDisconnect(): void {
    if(this.is_exiting) return;
    console.warn('FATAL: Disconnected from Discord');
    this.HandleExit(1);
  };

  protected OnSignal(signal: NodeJS.Signals): void {
    console.error(`FATAL: ${signal} recieved, exiting...`);
    this.HandleExit(1);
  };

  protected OnExit(): void {
    console.log('Momiji is exiting...');
    this.HandleExit(0);
  };

  protected OnError(error: Error): void {
    console.error(`ERROR: ${error.message}`);
    this.HandleExit();
  };

  protected OnWarning(info: string): void {
    console.warn(`WARN: ${info}`);
  };

  private HandleCommand(message: Discord.Message): void {
    let cmd: string = message.content.split(' ')[0].substr(1);
    let args: string = message.content.substr(cmd.length+2).trim();
    let command: Command | undefined;
    if((command = this.commands.get(cmd))) {
      console.log(`Executing command '${cmd}' with arguments '${args}'`);
      try {
        command.Execute(message, this);
      } catch(error) {
        let error_out = `ERROR: Something went wrong when executing command '${cmd}' with arguments '${args}'\n${error}`;
        console.error(error_out);

        message.reply(error_out)
        .catch((error: Error) => {
          console.error(error);
        });
      }
    } else {
      message.reply('That command does not exist!!')
      .catch((error: Error) => {
        console.error(error);
      });
    }
  }

  private async HandleQuestion(message: Discord.Message): Promise<void> {
    // slice off the inital "Momiji " (7 characters) and also trim any
    // punctuation (.!?)
    const question = message.content.slice(7, message.content.length)
                       .replace(/[.!?]{1,}$/, "");
    if (question.includes('eller')) { // question is a choice separated by eller
      const alternative_eller_regex = /(.{1,},){1,}.{1,}eller.{1,}/gm
      let choices;
      if (question.search(alternative_eller_regex) !== -1) {
        choices = question.split(',');
        choices = choices.slice(0, choices.length - 1)
                    .concat(choices[choices.length - 1].split('eller'));
      } else {
        choices = question.split('eller');
      }
      // trim the choices to remove unnecessary whitespace
      for (let i = 0; i < choices.length; ++i)
        choices[i] = choices[i].trim();

      const index = getRandomInt(0, choices.length);
      const choice = choices[index];
      try {
        await message.reply(choice);
      } catch(err) {
        console.error('Error on line ' + err.lineNumber + ': ' + err.message);
      }
    } else { // question is a yes/no/maybe question
      const yes_no_fortunes = [
        'As I see it, yes.',
        'It is certain.',
        'It is decidedly so.',
        'Most likely.',
        'My reply is no.',
        'My sources say no.',
        'Outlook not so good.',
        'Outlook good.',
        'Signs point to yes.',
        'Very doubtful.',
        'Without a doubt.',
        'Yes.',
        'Yes – definitely.',
        'You may rely on it.',
      ];
      const maybe_fortunes = [
        'Ask again later.',
        'Better not tell you now.',
        'Cannot predict now.',
        'Concentrate and ask again.',
        'Don’t count on it.',
        'Reply hazy, try again.',
      ];
      let fortune;
      const yes_no_fortunes_chance = 0.8;
      if (Math.random() <= yes_no_fortunes_chance) {
        const index = getRandomInt(0, yes_no_fortunes.length);
        fortune = yes_no_fortunes[index];
      } else {
        const index = getRandomInt(0, maybe_fortunes.length);
        fortune = maybe_fortunes[index];
      }

      try {
        await message.reply('`' + fortune + '`');
      } catch(err) {
        console.error('Error on line ' + err.lineNumber + ': ' + err.message);
      }
    }

  }

  private ReactWithAwoo(message: Discord.Message): void {
    if (!message.guild.emojis) return;
    if (!this.client.emojis.has('274209467095318528')) return;
    message.react(this.client.emojis.get('274209467095318528')!)
    .catch(console.error);

  }

  private HandleExit(exit_code: number = 1): void {
    console.log('Destroying Momiji and exiting.');
    this.is_exiting = true;
    process.exitCode = exit_code;
    this.client.destroy();
    process.exit(exit_code);
  }

  public MakeExit(): void {
    this.HandleExit(0);
  }
}
