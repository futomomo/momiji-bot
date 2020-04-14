import {Dirent, readdirSync} from 'fs';

import {BaseBot, Discord} from './BaseBot';
import {Command} from './Command';
import {MomijiAPI} from './MomijiAPI';

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
                    let module: any = await import('.\\commands\\'+entry.name); // this makes me feel bad  and probably only works on Windows TODO: fix somehow
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
        if(message.content.startsWith(command_char)) this.HandleCommand(message);
    };

    protected OnMessageUpdate(old_message: Discord.Message, new_message: Discord.Message): void {
        if((old_message.content != new_message.content)) this.OnMessage(new_message);
    };

    protected OnDisconnect(): void {
        if(this.is_exiting) return;
        console.warn('FATAL: Disconnected from Discord');
        this.HandleExit();
    };

    protected OnSignal(signal: NodeJS.Signals): void {
        console.error(`FATAL: ${signal} recieved, exiting...`);
        this.HandleExit();
    };

    protected OnExit(): void {
        console.log('Momiji is exiting...');
        this.HandleExit();
    };

    protected OnError(error: Error): void {
        console.error(`ERROR: ${error}`);
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
    };

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
