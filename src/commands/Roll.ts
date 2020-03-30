import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

class RollCommand implements Command {
    private name = 'roll';
    constructor() {};


    public Execute(message: DiscordMessage, momiji: MomijiAPI) {
        let arg_string: string = message.content.substr(this.name.length+2).trim();
        console.log(arg_string);
    };
    public GetName(): string { return this.name; };
    public GetDescription(): string { return 'Make a roll of the dice.'; };
    public GetUsage(): string { return '!roll [num dice]d<dice max>'; };
}

export function GetCommand(): Command { return new RollCommand(); };
