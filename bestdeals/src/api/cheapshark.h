// cheapshark.h
#pragma once
#include <string>
#include <vector>
#include <map>
#include <QString>
#include <QMap>



struct DealPrice {
    QString title;       // esim. "Hades"
    QString storeID;     // esim. "1"
    QString salePrice;   // esim. "19.99"
    QString normalPrice; // esim. "24.99"
    QString dealID;      // linkkiä varten
};

namespace CheapSharkAPI {
    // hakee raw JSON -stringin CheapSharkilta
    std::string fetchDealsRaw(const QString& title);
    // hakee pelin tarjoukset ja palauttaa vektorin DealPrice-rakenteita
    std::vector<DealPrice> fetchPrices(const QString& title);
    // hakee kauppojen nimet ja palauttaa mapin storeID->storeName
    QMap<QString, QString> fetchStoreNames();
    static constexpr int PAGE_SIZE = 20;
}
