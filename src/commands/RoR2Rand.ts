import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

function getRandomIntInclusive(min: number, max: number): number
{
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min)) + 1; //The maximum is inclusive and the minimum is inclusive
}

class RoR2Rand implements Command {
    public Execute(message: DiscordMessage, momiji: MomijiAPI) {
        let survivors: string[] = ['Commando', 'Huntress',
        'MUL-T', 'Engineer', 'Artificer', 'Mercenary', 'Rex',
        'Loader', 'Acrid'];

        enum Rarity {
            Common = 0,
            Uncommon,
            Legendary,
            Boss,
            Equip
        }

        let items = [
            // Common
            [],
            // Uncommon
            [],
            // Legendary
            [],
            // Boss
            [],
            // Equip
            []
        ];

        message.reply('You should play as: *' + survivors[getRandomIntInclusive(0, survivors.length-1)] + '*')
        .catch((error: Error) => console.error(error.message));

    }
    public GetName(): string { return 'ror2rand'; };
    public GetDescription(): string { return 'Randomise survivor.'; };
    public GetUsage(): string { return 'usage: !ror2rand'; };
}

export function GetCommand(): Command { return new RoR2Rand(); };
