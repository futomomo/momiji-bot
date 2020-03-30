import {Message as DiscordMessage} from 'discord.js';
import {MomijiAPI} from './MomijiAPI';

export {Message} from 'discord.js';
export {MomijiAPI} from './MomijiAPI';

export interface Command {
    Execute: (message: DiscordMessage, momiji: MomijiAPI) => void;
    GetName: () => string;
    GetDescription: () => string;
    GetUsage: () => string;
};
