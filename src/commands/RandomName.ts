import {Command, Message as DiscordMessage, MomijiAPI} from '../Command';

// FIXME: Put this stuff in a utility file.
function getRandomIntInclusive(min: number, max: number): number
{
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min)) + 1; //The maximum is inclusive and the minimum is inclusive
}



class RandomName implements Command {
  private name = 'randomname';
  constructor () {};

  public Execute(message: DiscordMessage, momiji: MomijiAPI) {
    let conso = 'bcdfghjlmnpqrstvwxz';
    let vowels = 'aiueo';
    let length = parseInt(message.content.substr(this.name.length+2).trim());
    if (length < 1) {
      message.reply("ERROR: length needs to be larger than 0")
      .catch((error: Error) => { console.log(error); });
      return;
    }
    let name = '';
    for (let i = 0; i < length; ++i) {
      name += conso[getRandomIntInclusive(0, conso.length-1)];
      name += vowels[getRandomIntInclusive(0, vowels.length-1)];
    }
    message.reply(name)
    .catch((error: Error) => { console.error(error); });
  };

  public GetName(): string {return this.name; };
  public GetDescription(): string { return 'Randomise name'; };
  public GetUsage(): string {
    return `usage: !randomname length
    length must be greater than 0`;
  };
}


export function GetCommand(): Command { return new RandomName(); };
