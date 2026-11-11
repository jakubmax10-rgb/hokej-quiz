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
    { id: 'finnish', name: 'Nocco Games 2025',    matches: () => finnishGames2025Matches,         roster: () => noccoGames2025RosterCze },
    { id: 'ms2025',  name: 'Mistrovství světa 2025', matches: () => mistrovstviSveta2025Matches, roster: () => ms2025RosterCze },
    { id: 'ceskehry', name: 'České hry 2025', matches: () => ceskeHry2025Matches, roster: () => ceskeHry2025RosterCze }
  ],
  teams: {
    CZE: { name: 'Česko', flag: 'cz' },      SWE: { name: 'Švédsko', flag: 'se' },
    FIN: { name: 'Finsko', flag: 'fi' },     SUI: { name: 'Švýcarsko', flag: 'ch' },
    CAN: { name: 'Kanada', flag: 'ca' },     NOR: { name: 'Norsko', flag: 'no' },
    SVK: { name: 'Slovensko', flag: 'sk' },  ITA: { name: 'Itálie', flag: 'it' },
    SLO: { name: 'Slovinsko', flag: 'si' },  DEN: { name: 'Dánsko', flag: 'dk' },
    FRA: { name: 'Francie', flag: 'fr' },    // <--- TADY CHYBĚLA ČÁRKA
    LAT: { name: 'Lotyšsko', flag: 'lv' },
    KAZ: { name: 'Kazachstán', flag: 'kz' },  GER: { name: 'Německo', flag: 'de' },
    AUT: { name: 'Rakousko', flag: 'at' },    GBR: { name: 'Velká Británie', flag: 'gb' },
    JPN: { name: 'Japonsko', flag: 'jp' },    KOR: { name: 'Jižní Korea', flag: 'kr' },
    USA: { name: 'USA', flag: 'us' },        EST: { name: 'Estonsko', flag: 'ee' },
    MAD: { name: 'Maďarsko', flag: 'hu' },      POL: { name: 'Polsko', flag: 'pl' },
    NED: { name: 'Nizozemsko', flag: 'nl' },  ESP: { name: 'Španělsko', flag: 'es' },
    CHN: { name: 'Čína', flag: 'cn' },        AUS: { name: 'Austrálie', flag: 'au' }
  },
  /* Zápisy jmen v zápasové databázi, které nejdou spárovat se soupiskou automaticky.
     Klíč: "idTurnaje|Jméno v zápase" -> přesné jméno v soupisce. */
  aliases: {
    aliases: {
    'beijer|Kovařčík M.': 'Michal Kovařík',
    'ceskehry|Lauko J.': 'Jakub Lauko'
  }
  };