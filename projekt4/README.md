# OpenSamples

Aplikacja to prosty model strony do rozpowszechniania darmowych sampli muzycznych. Layout bazowany jest na stronach typu [samplefocus](https://samplefocus.com). Obsługuje proste wyszukiwanie sampli, upload, usuwanie i ich edycje.

## Wymagania

Projekt należy uruchomić w środowisku `linux` z `nodejs` i `npm`.

## Instalacja

### 1. Instalacja pakietów

`npm install`

### 2. Ustawienie zmiennych środowiskowych

Ustawienie zmiennych środowiskowych *(SECRET, PEPPER i PORT do pliku `.env`)*:

`npm run setup`

## Uruchamianie Aplikacji

`npm run start`

## Dodatkowe polecenia

### Uzupełnianie bazy danych przykładowymi danymi

Dostępne jest polecenie `npm run populate` które dodaje 20 losowo wygenerowanych sampli oraz trzech użytkowników:
- `Marcel` z hasłem `qwertyuio`
- `Lex` z hasłem `asdfghjkl`
- `admin` z hasłem `zxcvbnm` *(ma też flagę admin)*

## Dostępne ścieżki

| Metoda | Ścieżka                     | Opis                         |
|--------|-----------------------------|------------------------------|
| GET    | /                           | Przekierowanie do /samples   |
| GET    | /auth/login                 | Strona logowania             |
| POST   | /auth/login                 | Logowanie                    |
| GET    | /auth/signup                | Strona rejestracji           |
| POST   | /auth/signup                | Rejestracja                  |
| GET    | /auth/logout                | Wylogowanie                  |
| GET    | /samples                    | Lista wszystkich sampli      |
| GET    | /samples/random             | Losowy sampel                |
| GET    | /samples/upload             | Strona wysyłania sampla      |
| POST   | /samples/upload             | Wysyłanie sampla             |
| GET    | /samples/:id                | Szczegóły sampla             |
| GET    | /samples/:id/play           | Odtwarzanie sampla           |
| GET    | /samples/:id/download       | Pobieranie sampla            |
| GET    | /samples/:id/delete         | Usuwanie sampla              |
| GET    | /samples/:id/edit           | Strona edycji sampla         |
| POST   | /samples/:id/edit           | Edycja sampla                |
| GET    | /profile                    | Strona profilu użytkownika   |
