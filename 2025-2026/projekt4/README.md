# OpenSamples

Aplikacja to prosty model strony do rozpowszechniania darmowych sampli muzycznych. Layout bazowany jest na stronach typu [samplefocus](https://samplefocus.com). Obsługuje proste wyszukiwanie sampli, upload, usuwanie i ich edycje.

Projekt należy uruchomić w środowisku linux z nodejs i npm.

Instalacja pakietów:
`npm install`

Ustawienie zmiennych środowiskowych *(SECRET, PEPPER i PORT do pliku `.env`)*:
`npm run setup`

Dostępne jest polecenie `npm run populate` które dodaje 20 losowo wygenerowanych sampli oraz trzech użytkowników:
- `Marcel` z hasłem `qwertyuio`
- `Lex` z hasłem `asdfghjkl`
- `admin` z hasłem `zxcvbnm` *(ma też flagę admin)*
