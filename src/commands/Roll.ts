import {Command, Message as DiscordMessage} from '../Command';

class RollCommand implements Command {
    private name = 'roll';
    constructor() {};


    public Execute(message: DiscordMessage) {
        let arg_string: string = message.content.substr(this.name.length+2).trim();
    };
    public GetName(): string { return this.name; };
    public GetDescription(): string { return 'Make a roll of the dice.'; };
}

export function getCommand(): Command { return new RollCommand(); };
