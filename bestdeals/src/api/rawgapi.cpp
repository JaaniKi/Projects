#include "rawgapi.h"
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <sstream>
#include <algorithm>
#include <QDebug>
#include <QPixmap>
#include <QDate>
#include <memory>

using json = nlohmann::json;

namespace {
    size_t WriteCallback(char* contents, size_t size, size_t nmemb, void* userp) {
        size_t totalSize = size * nmemb;
        static_cast<std::string*>(userp)->append(contents, totalSize);
        return totalSize;
    }

    // Funktio julkaisuajan muotoiluun dd.mm.yyyy
    static std::string formatDate(const std::string& dateStr) {
        if (dateStr.empty() || dateStr.length() < 10) {
            return "";
        }
        QString qdate = QString::fromStdString(dateStr);
        QDate date = QDate::fromString(qdate, "yyyy-MM-dd");
        if (date.isValid()) {
            return date.toString("dd.MM.yyyy").toStdString();
        }
        return dateStr; // Palauta alkuperäinen jos epäonnistuu
    }

    // Apustaja funktio JSON datalle
    RAWG::RawGameData parseGame(const json& j) { 
        RAWG::RawGameData game;
        game.id = j.value("id", 0);
        game.name = j.value("name", "Unknown");

        std::string releasedStr = j.value("released", "");
        // Muotoillaan julkaisuaika
        game.released = formatDate(releasedStr);

        game.thumbnail = j.value("background_image", "");

        if (j.contains("metacritic") && !j["metacritic"].is_null())
        {
            game.rating = j.value("metacritic", -1);
        }
        else { game.rating = -1; }
        
        
        if (j.contains("genres") && j["genres"].is_array()) {
            for (const auto& genre : j["genres"]) {
                game.genres.push_back(genre.value("name", ""));
            }
        }
        
        if (j.contains("platforms") && j["platforms"].is_array()) {
            for (const auto& platform : j["platforms"]) {
                if (platform.contains("platform")) {
                    game.platforms.push_back(platform["platform"].value("name", ""));
                }
            }
        }
        
        return game;
    }
}

// RAWG API toiminnallisuus
namespace RAWG { 

API::API(const std::string& apiKey) : apiKey_(apiKey) {}

// HTTP GET pyyntö RAWG API:in
std::string API::makeRequest(const std::string& url) {
    CURL* curl = curl_easy_init();
    if (!curl) return "";
    
    std::string buffer;
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &buffer);
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 15L);

    // HTTP pyyntö
    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    return (res == CURLE_OK) ? buffer : "";
}
// Ladataan kuva URL:ista QPixmap objektina
QPixmap* API::downloadPixmap(const std::string& url) {

    std::string data = makeRequest(url);
    auto pix = new QPixmap();
    if (!data.empty()) {
        pix->loadFromData(QByteArray(data.data(), data.size()));
    }
    else {
        qWarning() << "thumbnail pixmap empty!";
    }
    return pix;
}

// Haetaan yksittäisen pelin kuvaus erikseen
void API::fetchDescription(RawGameData& game) {
    std::string url = "https://api.rawg.io/api/games/" + 
                      std::to_string(game.id) + "?key=" + apiKey_;
    
    std::string response = makeRequest(url);
    if (response.empty()) return;

    try {
        json j = json::parse(response);
        game.description = j.value("description_raw", "");
    } catch (...) {}
}

// Tallennetaan pelidata vektoriin
std::vector<RawGameData> API::fetchAllGames() {
    // Näytetään 40 peliä ilman parametreja (sovelluksen käynnistyessä)
        SearchParams params;
        params.page_size = PAGE_SIZE;
    return searchGames(params);
}

std::vector<RawGameData> API::searchGames(const SearchParams& params, int) {
        const int TARGET = PAGE_SIZE; // näytetään korkeintaan 40 (page size) peliä
    std::vector<RawGameData> out;

    CURL* escCurl = curl_easy_init();
    if (!escCurl) { 
        qDebug() << "[RAWG] Curl ei toiminut\n";
    }

    int page = 1;
    int pageSize = PAGE_SIZE; // Tää löytyy headerista
    const int MAX_PAGES = 1; // Minimoidaan turhat kutsut

    while ((int)out.size() < TARGET && page <= MAX_PAGES) {
        std::ostringstream u;
        u << "https://api.rawg.io/api/games?key=" << apiKey_;

        // API-hakuehtojen lisäys curlilla
        // Parametrina pelin nimi
        if (!params.query.empty()) {
            if (escCurl) {
                char* esc = curl_easy_escape(escCurl, params.query.c_str(), (int)params.query.size());
                if (esc) { u << "&search=" << esc; curl_free(esc); }
                else { u << "&search=" << params.query; }
            } else {
                u << "&search=" << params.query;
            }
        }

        // Parametrina genret
        if (!params.genres.empty()) {
            std::string joined;
            for (size_t i = 0; i < params.genres.size(); ++i) {
                if (i) joined.push_back(',');
                joined += params.genres[i];
            }
            if (escCurl) {
                char* esc = curl_easy_escape(escCurl, joined.c_str(), (int)joined.size());
                if (esc) { u << "&genres=" << esc; curl_free(esc); }
                else { u << "&genres=" << joined; }
            } else {
                u << "&genres=" << joined;
            }
        }

        // Parametrina platformit
        if (!params.platforms.empty()) {
            std::string joined;
            for (size_t i = 0; i < params.platforms.size(); ++i) {
                if (i) joined.push_back(',');
                joined += params.platforms[i];
            }
            if (escCurl) {
                char* esc = curl_easy_escape(escCurl, joined.c_str(), (int)joined.size());
                if (esc) { u << "&platforms=" << esc; curl_free(esc); }
                else { u << "&platforms=" << joined; }
            } else {
                u << "&platforms=" << joined;
            }
        }

        // Parametrina julkaisupäivä, mikäli halutaan toteuttaa
        if (!params.dates.empty()) {
            if (escCurl) {
                char* esc = curl_easy_escape(escCurl, params.dates.c_str(), (int)params.dates.size());
                if (esc) { u << "&dates=" << esc; curl_free(esc); }
                else { u << "&dates=" << params.dates; }
            } else {
                u << "&dates=" << params.dates;
            }
        }

        // Parametrina lajittelu nimen tai julkaisupäivän mukaan
        if (!params.ordering.empty()) {
            if (escCurl) {
                char* esc = curl_easy_escape(escCurl, params.ordering.c_str(), (int)params.ordering.size());
                if (esc) { u << "&ordering=" << esc; curl_free(esc); }
                else { u << "&ordering=" << params.ordering; }
            } else {
                u << "&ordering=" << params.ordering;
            }
        }

        // API-pyynnön vaatimat parametrit
        u << "&page_size=" << pageSize;
        // Future proof, mahdollistetaan ehkä joskus monen sivun haku
        u << "&page=" << page;

        // Parametrien perusteella muodostettu haku-URL
        std::string url = u.str();
        std::string response = makeRequest(url);
        if (response.empty()) break;

        // Käsitellään vastaus
        try {
            json j = json::parse(response);
            if (!j.contains("results") || !j["results"].is_array()) break;
            for (const auto& item : j["results"]) {
                out.push_back(parseGame(item));
                if ((int)out.size() >= TARGET) break;
            }

            page++;
            if (!j.contains("next") || j["next"].is_null()) break;
        } catch (...) {
            break;
        }

    }

    if (escCurl) curl_easy_cleanup(escCurl);
    return out;
}

}