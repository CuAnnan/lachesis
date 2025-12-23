// sheetUtils: helpers for parsing/merging sheet JSON into editor state
import { blankSheet } from './CharacterReducer.js';

export function parseServerSheet(json, dispatchHelpers) {
  const data = blankSheet(json);
  delete data.loading;
  delete data.error;
  const arts = [];

  for (let trait of json.traits) {
    const ttype = (trait.type || '').toLowerCase();
    switch (ttype) {
      case 'attribute':
        data.attributes[dispatchHelpers.attributeMap[trait.name]].push(trait);
        break;
      case 'talent':
      case 'skill':
      case 'knowledge':
        data.abilities[trait.type.charAt(0).toUpperCase() + trait.type.slice(1)].push(trait);
        break;
      case 'realm':
        data.realms.push(trait);
        break;
      case 'art':
        arts.push(trait);
        break;
      case 'background':
        trait.id = dispatchHelpers.getNextBackgroundId();
        data.backgrounds.push(trait);
        break;
      case 'merit':
        trait.id = dispatchHelpers.getNextMeritId();
        data.merits.push(trait);
        break;
      case 'flaw':
        trait.id = dispatchHelpers.getNextFlawId();
        data.flaws.push(trait);
        break;
      case 'temper':
      case 'glamour':
      case 'willpower':
        data.tempers[trait.type] = trait;
        break;
      default:
        break;
    }
  }

  if (arts.length) {
    const coreKeys = ['cp', 'fp', 'xp', 'level', 'xpToLevel'];
    data.arts = data.arts.map(defaultArt => {
      const incoming = arts.find(a => a.name === defaultArt.name);
      if (!incoming) return defaultArt;
      const differs = coreKeys.some(k => Number(defaultArt[k] ?? 0) !== Number(incoming[k] ?? 0));
      return differs ? { ...incoming } : defaultArt;
    });
  }

  if (json.tempers) {
    data.tempers = { ...json.tempers };
  }

  return data;
}

