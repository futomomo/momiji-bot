import {Message as DiscordMessage} from 'discord.js';

export {Message} from 'discord.js';

export interface Command {
    Execute: (message: DiscordMessage) => void;
    GetName: () => string;
    GetDescription: () => string;
};
