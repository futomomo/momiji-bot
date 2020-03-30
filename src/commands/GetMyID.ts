import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

class GetMyID implements Command {
    private name = 'getmyid';
    public Execute(message: DiscordMessage, momiji: MomijiAPI) {
        message.reply(`Your ID: \`${message.author.id}\``)
        .catch((error) => console.error(error));
    }
    public GetName(): string { return this.name; };
    public GetDescription(): string { return 'Returns your discord id.'; };
    public GetUsage(): string { return `usage: !${this.name}`; };
}

export function GetCommand(): Command { return new GetMyID(); };
