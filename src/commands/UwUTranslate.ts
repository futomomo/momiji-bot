import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

class UwUTranslate implements Command {
    public Execute(message: DiscordMessage, momiji: MomijiAPI): void {
        let uwu_string: string = message.content.slice('uwu'.length+2).trim();
        if (uwu_string.length == 0)
            return;
        uwu_string = uwu_string.replace(/[rl]/gi, 'w');

        message.reply(uwu_string)
        .catch((error) => console.error(error));
    }
    public GetName(): string { return 'uwu'; };
    public GetDescription(): string { return 'OwO'; };
    public GetUsage(): string { return 'usage: !uwu <input-string>'; };
}

export function GetCommand(): Command { return new UwUTranslate(); };

