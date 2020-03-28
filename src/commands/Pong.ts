import {Command} from '../Command';
import {Message as DiscordMessage} from 'discord.js';

class PongCommand implements Command {
    private name: string;
    private description: string;

    constructor() {
        this.name = 'ping';
        this.description = 'When you say "Ping" Momiji says "Pong"!';
    };


    public Execute(message: DiscordMessage) {
        message.reply('Pong!')
        .catch((error: Error) =>
               {
                   console.error('ERROR WHILE SENDING PONG!\n' + error);
               });
    };
    public GetName(): string { return this.name; };
    public GetDescription(): string { return this.description; };
}

export function getCommand(): Command { return new PongCommand(); };
