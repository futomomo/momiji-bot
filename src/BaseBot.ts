import * as Discord from 'discord.js';

export * as Discord from 'discord.js';

export abstract class BaseBot {
    protected client: Discord.Client;
    constructor() {
        this.client = new Discord.Client();
        this.client.on('ready', () =>
                       this.OnReady());
        this.client.on('disconnect', () =>
                       this.OnDisconnect());
        this.client.on('message', (message: Discord.Message) =>
                       this.OnMessage(message));
        this.client.on('messageUpdate', (old_message: Discord.Message, new_message: Discord.Message) =>
                       this.OnMessageUpdate(old_message, new_message));
        this.client.on('exit', () =>
                       this.OnExit());
        this.client.on('warn', (info: string) =>
                       this.OnWarning(info));
        this.client.on('error', (error: Error) =>
                       this.OnError(error));
    };


    protected abstract OnReady(): void;
    protected abstract OnMessage(message: Discord.Message): void;
    protected abstract OnExit(): void;
    protected abstract OnDisconnect(): void;
    protected abstract OnError(error: Error): void;
    protected abstract OnWarning(info: string): void;
    protected abstract OnMessageUpdate(old_message: Discord.Message, new_message: Discord.Message): void;
}
