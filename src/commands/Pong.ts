import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

class PongCommand implements Command {
    constructor() {};


    public Execute(message: DiscordMessage, momiji: MomijiAPI) {
        message.reply('Pong!')
        .catch((error: Error) =>
               {
                   console.error('ERROR WHILE SENDING PONG!\n' + error);
               });
    };
    public GetName(): string { return 'ping'; };
    public GetDescription(): string {
      return 'When you say "Ping" Momiji says "Pong"!';
    };
    public GetUsage(): string { return '!ping'; };
}

export function GetCommand(): Command { return new PongCommand(); };
