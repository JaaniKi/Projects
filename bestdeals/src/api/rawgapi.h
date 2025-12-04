#pragma once

#include <string>
#include <vector>

class QPixmap;

namespace RAWG {

// Sivun koko rajoitettu turhien pyyntöjen välttämiseksi
static constexpr int PAGE_SIZE = 10;

//struct rawg -datalle
struct RawGameData {
    int id = 0;
    std::string name;
    std::string description;
    std::string released;
    std::vector<std::string> genres;
    std::vector<std::string> platforms;
    std::string thumbnail;
    int rating;
};

// pelihaun parametrit
struct SearchParams {
    std::string query;                    // tekstihaku
    std::vector<std::string> genres;      // Genret (pilkulla eroteltuna)
    std::vector<std::string> platforms;   // RAWG platform ID:t (pilkulla eroteltuna)
    std::string dates;                    // julkaisuajat (YYYY-MM-DD)
    std::string ordering;                 // lajittelu (nimen tai julkaisupäivän mukaan)
    int page_size = PAGE_SIZE;            // pelien määrä per sivu (40 rawg max)
};

class API {
public:
    explicit API(const std::string& apiKey);
    // hae pelejä ilman parametreja (lähinnä käynnistäessä)
    std::vector<RawGameData> fetchAllGames();
    // hae pelejä parametreilla
    std::vector<RawGameData> searchGames(const SearchParams& params, int maxGames = 40);
    // lataa kuva URL:ista QPixmap objektina
    QPixmap* downloadPixmap(const std::string& url);
    // hae pelin kuvaus erikseen (koska se vaatii erillisen pyynnön)
    void fetchDescription(RawGameData& game);


private:
    std::string apiKey_;
    std::string makeRequest(const std::string& url);
};

}