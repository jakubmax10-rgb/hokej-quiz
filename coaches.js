const coachesDatabase = [
  {
    "id": "rulik",
    "name": "Radim Rulík",
    "teamId": "kladno",
    "ovr": 93,
    "price": 80000,
    "preferredTactics": "Agresivní napadání",
    "attributes": {
      "utok": 92,
      "obrana": 94,
      "presilovky": 90,
      "oslabeni": 95,
      "praceSBrankari": 89,
      "motivace": 97
    },
    "note": "Úspěšný kouč s obrovským citem pro moderní, rychlý a dravý hokej.",
    "modifiers": { "strelba": 1.10, "xg": 1.10, "obrana": 1.0 }
  },
  {
    "id": "pesan",
    "name": "Filip Pešán",
    "teamId": "pardubice",
    "ovr": 92,
    "price": 75000,
    "preferredTactics": "Kontrola puku",
    "attributes": {
      "utok": 94,
      "obrana": 88,
      "presilovky": 93,
      "oslabeni": 87,
      "praceSBrankari": 88,
      "motivace": 90
    },
    "note": "Moderní a inovativní stratég s důrazem na kombinaci a dominantní držení puku.",
    "modifiers": { "strelba": 1.05, "xg": 1.08, "obrana": 1.0 }
  },
  {
    "id": "zabka",
    "name": "Boris Žabka",
    "teamId": "trinec",
    "ovr": 89,
    "price": 70000,
    "preferredTactics": "Agresivní napadání",
    "attributes": {
      "utok": 88,
      "obrana": 92,
      "presilovky": 87,
      "oslabeni": 91,
      "praceSBrankari": 86,
      "motivace": 90
    },
    "note": "Hlavní trenér extraligového lídra s důrazem na propracovaný systém a disciplínu.",
    "modifiers": { "strelba": 1.10, "xg": 1.10, "obrana": 1.0 }
  },
  {
    "id": "zabransky",
    "name": "Libor Zábranský",
    "teamId": "kometa",
    "ovr": 89,
    "price": 70000,
    "preferredTactics": "Defenzivní systém",
    "attributes": {
      "utok": 87,
      "obrana": 93,
      "presilovky": 86,
      "oslabeni": 92,
      "praceSBrankari": 88,
      "motivace": 94
    },
    "note": "Silná osobnost a nekompromisní šéf střídačky s vůdčími schopnostmi.",
    "modifiers": { "strelba": 1.0, "xg": 0.95, "obrana": 1.12 }
  },
  {
    "id": "jandac",
    "name": "Josef Jandač",
    "teamId": "plzen",
    "ovr": 88,
    "price": 65000,
    "preferredTactics": "Rychlé protiútoky",
    "attributes": {
      "utok": 90,
      "obrana": 86,
      "presilovky": 91,
      "oslabeni": 85,
      "praceSBrankari": 85,
      "motivace": 87
    },
    "note": "Zkušený extraligový stratég se skvěle připravenými přesilovkovými formacemi.",
    "modifiers": { "strelba": 1.08, "xg": 1.05, "obrana": 1.0 }
  },
  {
    "id": "augusta",
    "name": "Patrik Augusta",
    "teamId": "sparta",
    "ovr": 87,
    "price": 60000,
    "preferredTactics": "Kontrola puku",
    "attributes": {
      "utok": 88,
      "obrana": 86,
      "presilovky": 89,
      "oslabeni": 84,
      "praceSBrankari": 85,
      "motivace": 88
    },
    "note": "Kouč s výbornou prací s týmem a ofenzivním herním rukopisem.",
    "modifiers": { "strelba": 1.05, "xg": 1.08, "obrana": 1.0 }
  },
  {
    "id": "patera",
    "name": "Pavel Patera",
    "teamId": "karlovy_vary",
    "ovr": 85,
    "price": 55000,
    "preferredTactics": "Rychlé protiútoky",
    "attributes": {
      "utok": 86,
      "obrana": 83,
      "presilovky": 85,
      "oslabeni": 82,
      "praceSBrankari": 83,
      "motivace": 86
    },
    "note": "Bývalý špičkový hokejista, který vnáší do hry kombinaci a kreativitu.",
    "modifiers": { "strelba": 1.08, "xg": 1.05, "obrana": 1.0 }
  },
  {
    "id": "martinec",
    "name": "Tomáš Martinec",
    "teamId": "mountfield",
    "ovr": 85,
    "price": 55000,
    "preferredTactics": "Kontrola puku",
    "attributes": {
      "utok": 86,
      "obrana": 85,
      "presilovky": 84,
      "oslabeni": 85,
      "praceSBrankari": 83,
      "motivace": 86
    },
    "note": "Zastánce moderního, bruslivého hokeje a systémové koncepce.",
    "modifiers": { "strelba": 1.05, "xg": 1.08, "obrana": 1.0 }
  },
  {
    "id": "reichel",
    "name": "Robert Reichel",
    "teamId": "litvinov",
    "ovr": 84,
    "price": 50000,
    "preferredTactics": "Defenzivní systém",
    "attributes": {
      "utok": 83,
      "obrana": 87,
      "presilovky": 83,
      "oslabeni": 86,
      "praceSBrankari": 84,
      "motivace": 85
    },
    "note": "Hokejová legenda s obrovským přehledem a citem pro defenzivní detaily.",
    "modifiers": { "strelba": 1.0, "xg": 0.95, "obrana": 1.12 }
  },
  {
    "id": "petrovicky",
    "name": "Róbert Petrovický",
    "teamId": "motor",
    "ovr": 83,
    "price": 45000,
    "preferredTactics": "Agresivní napadání",
    "attributes": {
      "utok": 84,
      "obrana": 82,
      "presilovky": 82,
      "oslabeni": 83,
      "praceSBrankari": 81,
      "motivace": 85
    },
    "note": "Dravý styl, důraz na bruslení a bojovnost v soubojích.",
    "modifiers": { "strelba": 1.10, "xg": 1.10, "obrana": 1.0 }
  },
  {
    "id": "haken",
    "name": "Petr Haken",
    "teamId": "mlada_boleslav",
    "ovr": 81,
    "price": 40000,
    "preferredTactics": "Defenzivní systém",
    "attributes": {
      "utok": 80,
      "obrana": 84,
      "presilovky": 79,
      "oslabeni": 84,
      "praceSBrankari": 82,
      "motivace": 82
    },
    "note": "Poctivý trenér propracovaných defenzivních systémů a oslabení.",
    "modifiers": { "strelba": 1.0, "xg": 0.95, "obrana": 1.12 }
  },
  {
    "id": "kudrna",
    "name": "Jiří Kudrna",
    "teamId": "liberec",
    "ovr": 80,
    "price": 38000,
    "preferredTactics": "Rychlé protiútoky",
    "attributes": {
      "utok": 81,
      "obrana": 79,
      "presilovky": 80,
      "oslabeni": 78,
      "praceSBrankari": 80,
      "motivace": 81
    },
    "note": "Specialista na rychlý přechod do útoku a podporu křídel.",
    "modifiers": { "strelba": 1.08, "xg": 1.05, "obrana": 1.0 }
  },
  {
    "id": "fiala",
    "name": "Petr Fiala",
    "teamId": "olomouc",
    "ovr": 78,
    "price": 35000,
    "preferredTactics": "Kontrola puku",
    "attributes": {
      "utok": 79,
      "obrana": 78,
      "presilovky": 78,
      "oslabeni": 77,
      "praceSBrankari": 78,
      "motivace": 80
    },
    "note": "Zkušený kouč vhodný do bojovných týmů.",
    "modifiers": { "strelba": 1.05, "xg": 1.08, "obrana": 1.0 }
  },
  {
    "id": "treille",
    "name": "Yorick Treille",
    "teamId": "vitkovice",
    "ovr": 77,
    "price": 32000,
    "preferredTactics": "Agresivní napadání",
    "attributes": {
      "utok": 78,
      "obrana": 77,
      "presilovky": 76,
      "oslabeni": 78,
      "praceSBrankari": 76,
      "motivace": 79
    },
    "note": "Moderní pohled na hru s důrazem na dravost.",
    "modifiers": { "strelba": 1.10, "xg": 1.10, "obrana": 1.0 }
  }
];