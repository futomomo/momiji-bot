import {Command, Message as DiscordMessage} from '../Command';

class PongCommand implements Command {
    constructor() {};


    public Execute(message: DiscordMessage) {
        message.reply('Pong!')
        .catch((error: Error) =>
               {
                   console.error('ERROR WHILE SENDING PONG!\n' + error);
               });
    };
    public GetName(): string { return 'ping'; };
    public GetDescription(): string { return 'When you say "Ping" Momiji says "Pong"!'; };
}

export function getCommand(): Command { return new PongCommand(); };
