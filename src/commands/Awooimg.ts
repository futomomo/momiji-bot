/*
 * file: Awoobot.ts
 *
 * usage: !awooimg board_id [amount]
 *      board_id: board name abbreviation, e.g
 *          !awoomimg c
 *      amount: the amount of images you want sent
 *
 *
 */
import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';


class Awooimg implements Command {
    public Execute(message: DiscordMessage, momiji: MomijiAPI): void {
    }
    public GetName(): string { return 'spurdo'; };
    public GetDescription(): string { return 'Fugg :DDDD'; };
    public GetUsage(): string { return `usage: !awooimg board_id [amount]
       board_id: board name abbreviation, e.g
           !awoomimg c
       amount: the amount of images you want sent`; };
}

export function GetCommand(): Command { return new Awooimg(); };
