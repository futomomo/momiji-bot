import * as Discord from 'discord.js';
import {Command} from './Command';

export class Momiji {
    private client: Discord.Client;
    private commands: Command[];

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

        this.client.login(token)
            .catch((error: Error) => {
            console.error('ERROR: Failed to log into Discord:\n' + error);
            this.onExit();
        });
    };

    private onReady(): void {
        console.log('Successfully logged into Discord!');
    };

    private onMessage(message: Discord.Message): void {
        if(message.author.bot) return;
    };

    private onMessageUpdate(old_message: Discord.Message, new_message: Discord.Message): void {
        if(old_message.content == new_message.content) return;
    };

    private onDisconnect(): void {
        console.warn('WARN: Disconnected from Discord');
        this.onExit();
    };

    private onSignal(signal: NodeJS.Signals): void {
        console.warn(`WARN: ${signal} recieved, exiting...`);
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
}
