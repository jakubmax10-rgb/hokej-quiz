/* Nastavení: propojení turnajů, týmy a aliasy jmen.
   Samotná data (zápasy, soupisky) zůstávají v souborech ve složce data/. */
const CONFIG = {
  tournaments: [
    { id: 'beijer',  name: 'Beijer Games 2026',   matches: () => beijerGames2026Matches,        roster: () => beijerGames2026RosterCze },
    { id: 'fortuna', name: 'Fortuna Games 2026',  matches: () => fortunaGames2026Matches,       roster: () => fortunaGames2026RosterCze },
    { id: 'ms',      name: 'Mistrovství světa 2026', matches: () => mistrovstviSveta2026Matches, roster: () => ms2026RosterCze },
    { id: 'nocco',   name: 'Nocco Games 2026',    matches: () => noccoGames2026Matches,         roster: () => noccoGames2026RosterCze },
    { id: 'oh',      name: 'Olympijské hry 2026',  matches: () => olympijskeHry2026Matches,     roster: () => oh2026RosterCze },
    { id: 'swiss',   name: 'Swiss Games 2025',    matches: () => swissGames2025Matches,         roster: () => swissGames2025RosterCze },
    { id: 'finnish', name: 'Nocco Games 2025',    matches: () => finnishGames2025Matches,         roster: () => noccoGames2025RosterCze }
  ],
  teams: {
    CZE: { name: 'Česko', flag: 'cz' },      SWE: { name: 'Švédsko', flag: 'se' },
    FIN: { name: 'Finsko', flag: 'fi' },     SUI: { name: 'Švýcarsko', flag: 'ch' },
    CAN: { name: 'Kanada', flag: 'ca' },     NOR: { name: 'Norsko', flag: 'no' },
    SVK: { name: 'Slovensko', flag: 'sk' },  ITA: { name: 'Itálie', flag: 'it' },
    SLO: { name: 'Slovinsko', flag: 'si' },  DEN: { name: 'Dánsko', flag: 'dk' },
    FRA: { name: 'Francie', flag: 'fr' },    LAT: { name: 'Lotyšsko', flag: 'lv' }
  },
  /* Zápisy jmen v zápasové databázi, které nejdou spárovat se soupiskou automaticky.
     Klíč: "idTurnaje|Jméno v zápase" -> přesné jméno v soupisce. */
  aliases: {
    'beijer|Kovařčík M.': 'Michal Kovařík'
  }
};
