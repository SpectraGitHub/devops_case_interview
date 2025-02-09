# script

Input-dataene inneholder mange tallserier, en serie per linje. Hver serie er en liste med nummer som er separert med mellomrom. For eksempel:

```
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
```

Dette eksempelet inneholder 6 serier som hver har 5 nummer.

Oppgaven er å finne ut hvor mange serier som enten gradvis øker eller gradvis synker. Følgende krav må sjekkes:

- Alle nummerne enten øker eller synker fra forrige nummer i serien.
- To tilstøtende nummer har en forskjell på minst 1 og maks 3.

I eksempelet over, kan vi finne de gyldige seriene som følger:

- `7 6 4 2 1`: Gyldig fordi alle nummerne synker med 1 eller 2.
- `1 2 7 8 9`: Ugyldig fordi `2 7` er en økning på 5.
- `9 7 6 2 1`: Ugyldig fordi `6 2` er en reduksjon på 4.
- `1 3 2 4 5`: Ugyldig fordi `1 3` øker, men `3 2` synker.
- `8 6 4 4 1`: Ugyldig fordi `4 4` verken øker eller synker.
- `1 3 6 7 9`: Gyldig fordi alle nummerne øker med 1, 2 eller 3.

I eksempelet er altså 2 serier gyldige.

Hvor mange serier i `input.txt` er gyldige?
Svaret jeg kom frem til er 483 gyldige serier.

for å kjøre c++ kode i visual studio følg disse instruksene:
https://code.visualstudio.com/docs/cpp/config-mingw

