#include "cheapshark.h"
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <algorithm>
#include <cstdlib>
#include <cctype>
#include <QDebug>
#include <QUrl>
#include <QUrlQuery>
#include <QString>
#include <QByteArray>

using json = nlohmann::json;

static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp)
{
    size_t total = size * nmemb;
    std::string* buffer = static_cast<std::string*>(userp);
    buffer->append(static_cast<char*>(contents), total);
    return total;
}

// Muuttaa "Dark Souls III" -> "dark_souls_iii"
static std::string normalizeTitleForCheapShark(const QString& title)
{
    QString t = title;
    std::string out;
    out.reserve(t.size());

    for (QChar c : t) {
        if (c == ' ') {
            out.push_back('_');
        }
        else if (c == QChar(0x2019)) {
            out.push_back('\'');
        }
        else {
            out.push_back(c.toLower().toLatin1());
        }
    }
    return out;
}

std::string CheapSharkAPI::fetchDealsRaw(const QString& title)
{
    std::string buffer;
    
    CURL* curl = curl_easy_init();
    if (!curl) {
        qDebug() << "curl init failed\n";
        return {};
    }

    // Normalisoi nimi CheapSharkia varten
    std::string q = normalizeTitleForCheapShark(title);

    char* encoded = curl_easy_escape(curl, q.c_str(), q.length());
    
    std::string url = "https://www.cheapshark.com/api/1.0/deals?title=" + std::string(encoded) + "&pageSize=20";
    qDebug() << "finding deals with title param: " << encoded;


    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &buffer);

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        qDebug() << "curl request failed: " << curl_easy_strerror(res) << "\n";
        return {};
    }

    // Just return the std::string buffer directly
    return buffer;
}


// palauttaa pelkät hinnat
std::vector<DealPrice> CheapSharkAPI::fetchPrices(const QString& title)
{  
    std::vector<DealPrice> prices;
    std::string raw = fetchDealsRaw(title);
    if (raw.empty())
        return prices;

    try {
        auto j = json::parse(raw);

        for (auto& item : j) {
            DealPrice p;
            p.title       = QString::fromStdString(item.value("title", ""));
            p.storeID     = QString::fromStdString(item.value("storeID", ""));
            p.salePrice   = QString::fromStdString(item.value("salePrice", "0"));
            p.normalPrice = QString::fromStdString(item.value("normalPrice", "0"));
            p.dealID      = QString::fromStdString(item.value("dealID", ""));

            prices.push_back(p);
        }
    }
    catch (const std::exception& e) {
        qDebug() << "JSON parse error: " << e.what() << "\n";
    }

    std::sort(prices.begin(), prices.end(),
        [](const DealPrice& a, const DealPrice& b) {
            // Convert QString -> double
            bool okA, okB;
            double pa = a.salePrice.toDouble(&okA);
            double pb = b.salePrice.toDouble(&okB);

            // If conversion fails, treat as 0.0 (or handle differently)
            if (!okA) pa = 0.0;
            if (!okB) pb = 0.0;

            return pa < pb; // ascending order
        });


    return prices;
}

QMap<QString, QString> CheapSharkAPI::fetchStoreNames()
{
    QMap<QString, QString> stores;
    std::string url = "https://www.cheapshark.com/api/1.0/stores";
    std::string buffer;

    CURL* curl = curl_easy_init();
    if (!curl) return stores;

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &buffer);

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        qDebug() << "curl request failed (stores): " << curl_easy_strerror(res);
        return stores;
    }

    try {
        auto j = json::parse(buffer);
        for (auto& item : j) {
            std::string idStd = item.value("storeID", "");
            std::string nameStd = item.value("storeName", "");

            if (!idStd.empty() && !nameStd.empty()) {
                QString id = QString::fromStdString(idStd);
                QString name = QString::fromStdString(nameStd);
                stores.insert(id, name);
            }
        }
    }
    catch (const std::exception& e) {
        qDebug() << "JSON parse error (stores): " << e.what();
    }

    return stores;
}

