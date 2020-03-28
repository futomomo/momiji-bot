import {Message as DiscordMessage, Client as DiscordClient} from 'discord.js';


export interface Command {
    Execute: (message: DiscordMessage) => void;
    GetName: () => string;
    GetDescription: () => string;
};
