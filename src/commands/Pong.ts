import {Command} from '../Command';
import {Message as DiscordMessage, Client as DiscordClient} from 'discord.js';

class PongCommand implements Command {
    private name: string;
    private description: string;

    constructor() {
        this.name = 'Pong';
        this.description = 'When you say "Ping", Momiji says "Pong"!';
    };


    public Execute(message: DiscordMessage, client: DiscordClient) {
        message.reply('Pong!')
        .catch((error: Error) =>
               {
                   console.error('ERROR WHILE SENDING PONG!\n' + error);
               });
    };
    public GetName() {return this.name;};
    public GetDescription() {return this.description;};
}
