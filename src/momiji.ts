import {BaseBot, Discord} from './BaseBot';
import {MomijiAPI} from './MomijiAPI';
import {Command} from './Command';
import {readdirSync, Dirent} from 'fs';

export class Momiji extends BaseBot implements MomijiAPI {
    private commands: Map<string, Command>;

    constructor(token: string) {
        super();

        process.on('SIGINT', (signal: NodeJS.Signals) =>
                   this.OnSignal(signal));

        this.ImportCommands();

        this.client.login(token)
            .catch((error: Error) => {
            console.error('ERROR: Failed to log into Discord:\n' + error);
            this.OnExit();
        });
    };

    private ImportCommands(): void {
        this.commands = new Map();
        const commands_path: string = 'bin/commands/';
        let dir_list: Dirent[] = readdirSync(commands_path, {'encoding': 'utf8', 'withFileTypes': true});
        for(let entry of dir_list) {
            if(entry.isFile() && entry.name.endsWith('.js')) {
                import('.\\commands\\'+entry.name) // this makes me feel bad TODO: fix somehow
                .then((module: any) => {
                    if(module.getCommand) {
                        let command_object: Command = module.getCommand();
                        let name: string = command_object.GetName();
                        console.log(`Found command ${name}.`);
                        this.commands.set(name, command_object);
                    }
                })
                .catch((error: Error) => {
                    console.error(`ERROR: Failed to import ${entry.name}\n${error}`);
                });
            }
        }
    };

    protected OnReady(): void {
        console.log('Successfully logged into Discord!');
    };

    protected OnMessage(message: Discord.Message): void {
        if(message.author.bot) return;
        if(message.content.startsWith('!')) {this.HandleCommand(message)}
    };

    protected OnMessageUpdate(old_message: Discord.Message, new_message: Discord.Message): void {
        if((old_message.content != new_message.content)) this.OnMessage(new_message);
    };

    protected OnDisconnect(): void {
        console.warn('WARN: Disconnected from Discord');
        this.OnExit();
    };

    protected OnSignal(signal: NodeJS.Signals): void {
        console.error(`FATAL: ${signal} recieved, exiting...`);
        this.OnExit();
    };

    protected OnExit(): void {
        console.log('Destroying Momiji and exiting.');
        this.client.destroy();
        process.exit(1);
    };

    protected OnError(error: Error): void {
        console.error(error);
        this.OnExit();
    };

    protected OnWarning(info: string): void {
        console.warn(info);
    };

    private HandleCommand(message: Discord.Message): void {
        let cmd: string = message.content.split(' ')[0].substr(1);
        let args: string = message.content.substr(cmd.length+2).trim();
        if(this.commands.has(cmd)) {
            console.log(`Executing command '${cmd}' with arguments '${args}'`);
            try {
                this.commands.get(cmd).Execute(message);
            } catch(error) {
                console.error(`ERROR: Something went wrong when executing command '${cmd}' with arguments '${args}'\n${error}`);
            }
        } else {
            message.reply('That command does not exist!!')
            .catch((error: Error) => {
                console.error(`ERROR: Error trying to reply to message!`);
            });
        }
    };
}
