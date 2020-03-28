import * as Discord from 'discord.js';
import {Command} from './Command';
import {readdirSync, Dirent} from 'fs';

export class Momiji {
    private client: Discord.Client;
    private commands: Map<string, Command>;

    constructor(token: string) {
        this.client = new Discord.Client();
        this.client.on('ready', () =>
                       this.onReady());
        this.client.on('disconnect', () =>
                       this.onDisconnect());
        this.client.on('message', (message: Discord.Message) =>
                       this.onMessage(message));
        this.client.on('messageUpdate', (old_message: Discord.Message, new_message: Discord.Message) =>
                       this.onMessageUpdate(old_message, new_message));
        this.client.on('exit', () =>
                       this.onExit());
        this.client.on('warn', (info: string) =>
                       this.onWarn(info));
        this.client.on('error', (error: Error) =>
                       this.onError(error));

        process.on('SIGINT', (signal: NodeJS.Signals) =>
                   this.onSignal(signal));

        this.importCommands();

        this.client.login(token)
            .catch((error: Error) => {
            console.error('ERROR: Failed to log into Discord:\n' + error);
            this.onExit();
        });
    };

    private importCommands(): void {
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

    private onReady(): void {
        console.log('Successfully logged into Discord!');
    };

    private onMessage(message: Discord.Message): void {
        if(message.author.bot) return;
        if(message.content.startsWith('!')) {this.HandleCommand(message)}
    };

    private onMessageUpdate(old_message: Discord.Message, new_message: Discord.Message): void {
        if((old_message.content != new_message.content)) this.onMessage(new_message);
    };

    private onDisconnect(): void {
        console.warn('WARN: Disconnected from Discord');
        this.onExit();
    };

    private onSignal(signal: NodeJS.Signals): void {
        console.error(`FATAL: ${signal} recieved, exiting...`);
        this.onExit();
    };

    private onExit(): void {
        console.log('Destroying Momiji and exiting.');
        this.client.destroy();
        process.exit(1);
    };

    private onError(error: Error): void {
        console.error(error);
        this.onExit();
    };

    private onWarn(info: string): void {
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
