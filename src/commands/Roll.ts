import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

function getRandomIntInclusive(min: number, max: number): number
{
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min)) + 1; //The maximum is inclusive and the minimum is inclusive
}

class RollCommand implements Command {
    private name = 'roll';
    constructor() {};

    public Execute(message: DiscordMessage, momiji: MomijiAPI) {
        const DICE_COUNT_MAX = 1000000;
        const DICE_SIZE_MAX = DICE_COUNT_MAX;
        const arg_string: string = message.content.substr(this.name.length+2).trim();
        const syntax_regex = /^[0-9]*d[0-9]+$/g;
        if(arg_string.search(syntax_regex) !== 0) {
            message.reply('Incorrect usage!\n`' + this.GetUsage() + '`')
            .catch((error: Error) => { console.error(error); });
            return;
        }
        const arg_array = arg_string.split('d');
        const dice_count = parseInt(arg_array[0]) || 1;
        const dice_size = parseInt(arg_array[1]);

        if(dice_count > DICE_COUNT_MAX || dice_size > DICE_SIZE_MAX) {
            message.reply(`ERROR: Too many or too large dice. Please restrict yourself to max ${DICE_COUNT_MAX} dice of size ${DICE_SIZE_MAX}.`)
            .catch((error: Error) => { console.error(error); });
            return;
        } else if(dice_size < 1) {
            message.reply(`ERROR: Please throw a dice larger than a d0.`)
            .catch((error: Error) => { console.error(error); });
            return;
        }

        let total = getRandomIntInclusive(1, dice_size);
        let out_string = `${arg_string}: `;
        for(let i = 1; i < dice_count; ++i) {
            total += getRandomIntInclusive(1, dice_size);
        }
        out_string += `${total}`;
        message.reply('\n```css\n' + out_string + '```')
        .catch((error: Error) => console.error(error));
    };
    public GetName(): string { return this.name; };
    public GetDescription(): string { return 'Make a roll of the dice.'; };
    public GetUsage(): string {
      return `usage: !roll [dice_count]d<dice_size>
    both dice_count and dice_size need to be positive integers.`;
    };
}

export function GetCommand(): Command { return new RollCommand(); };
