# Bestdeals

Bestdeals is a Qt-based desktop application for finding video game deals. It combines game
metadata from the RAWG API with price data from CheapShark, allowing users to search for games,
view detailed information, and compare current deals across multiple stores.

## Features
- Search games by title
- View game details: release date, genres, platforms, description, and Metacritic rating
- Fetch and display deals from CheapShark with store names and prices
- Match deals to games using Levenshtein distance
- Sort deals by lowest price
- Asynchronous thumbnail loading for responsive UI
- Easy navigation between game list and deal list views

## Architecture
The application follows a layered structure:
- **GUI layer:** `MainWindow`, `GameCard`, `DealCard`
- **API layer:** `RAWG::API` (game data), `CheapSharkAPI` (deal data)
- **Utility layer:** string normalization and Levenshtein distance matching

`MainWindow` coordinates API calls and UI updates, while `GameCard` and `DealCard` are reusable
widgets for presenting games and deals.

## Data Models
- `RawGameData`: stores game metadata retrieved from RAWG
- `DealPrice`: stores deal information retrieved from CheapShark
- `SearchParams`: defines RAWG API search parameters

## Instructions:

Easiest way to run project:
- run bestdeals.exe in /run directory



Setting up env:

* Install Qt, CMake \& C++ 
* Set up build
* Configure your own curl library (ready library, sample format in folder)

Use:

* OPTIONAL: Build
* OPTIONAL: Copy dlls from external/runtime\_lib to dir with .exe
* Run build or run executable in bestdeals/run folder



