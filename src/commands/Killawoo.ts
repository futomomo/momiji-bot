import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

class Killawoo implements Command {
    public Execute(message: DiscordMessage, momiji: MomijiAPI) {
        if(message.author.id !== '109880609458880512') return;
        message.reply('Awooo...')
        .then((message) => {
            momiji.MakeExit();
        })
        .catch((error) => console.error(error));
    }
    public GetName(): string { return 'killawoo'; };
    public GetDescription(): string { return 'Kills the bot.'; };
    public GetUsage(): string { return 'usage: !killawoo'; };
}

export function GetCommand(): Command { return new Killawoo(); };
