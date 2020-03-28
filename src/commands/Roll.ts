import {Command} from '../Command';
import {Message as DiscordMessage} from 'discord.js';

class PongCommand implements Command {
    private name: string;
    private description: string;

    constructor() {
        this.name = 'roll';
        this.description = 'Make a roll of the dice.';
    };


    public Execute(message: DiscordMessage) {
        let arg_string: string = message.content.substr(this.name.length+2).trim();
    };
    public GetName(): string { return this.name; };
    public GetDescription(): string { return this.description; };
}

export function getCommand(): Command { return new PongCommand(); };
