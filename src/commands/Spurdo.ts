import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

class Spurdo implements Command {
    public Execute(message: DiscordMessage, momiji: MomijiAPI): void {
        let fugged_string: string = message.content.slice('spurdo'.length+2).trim();
        fugged_string = fugged_string.replace(/[ck]/gi, 'g');
        fugged_string = fugged_string.replace(/th/gi, 'd');
        fugged_string = fugged_string.replace(/t/gi, 'd');
        fugged_string = fugged_string.replace(/p/gi, 'b');

        let blank_regex = /\s+/gi;
        let matches: number[] = [];
        let match
        // isolate the blank indexes since that's where you wanna put the :DDDD
        while ((match = blank_regex.exec(fugged_string)) !== null) {
            matches.push(match.index);
            console.log(`Found opening for :DD at ${match.index}`);
        }
        matches.push(fugged_string.length); // also push end of string

        let positions: number[] = [];
        // pick randomly at least 1 position to insert :DD up to a third of the max possible amount found in matches
        let max_fuggs = getRandomInt(Math.max(1, Math.floor(matches.length/3)))+1;
        console.log(`Max fuggs: ${max_fuggs}`);
        while (positions.length < max_fuggs) {
            let pos = getRandomInt(matches.length);
            positions.push(matches[pos]);
            matches.splice(pos, 1);
        }
        positions.sort((a, b) => a - b);

        let last_match = 0;
        let final_fugged = '';
        for (let pos of positions) {
            // console.log(`Inserting at pos ${pos}`);
            final_fugged = final_fugged.concat(fugged_string.slice(last_match, pos), ' :', 'D'.repeat(getRandomInt(6)+2));
            last_match = pos;
        }
        final_fugged = final_fugged.concat(fugged_string.slice(last_match, final_fugged.length));


        message.reply(final_fugged)
        .catch((error) => console.error(error));
    }
    public GetName(): string { return 'spurdo'; };
    public GetDescription(): string { return 'Fugg :DDDD'; };
    public GetUsage(): string { return 'usage: !spurdo <input-string>'; };
}

export function GetCommand(): Command { return new Spurdo(); };
