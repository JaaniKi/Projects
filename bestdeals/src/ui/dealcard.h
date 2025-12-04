#ifndef DEALCARD_H
#define DEALCARD_H

#include <QWidget>
#include <QLabel>
#include <QString>
#include <QPushButton>
#include <QLabel>


#include "cheapshark.h"   // DealPrice

/*
 * Yksi kortti, joka näyttää CheapShark-diilin:
 *  - pelin nimi
 *  - kaupan nimi
 *  - alennushinta + normaalihinta
 */
class DealCard : public QWidget
{
    Q_OBJECT

public:
    explicit DealCard(const DealPrice& deal,
                      const QString& storeName,
                      QWidget* parent = nullptr);

    // Accessors jos tarvii
    QLabel* getTitleLabel() const      { return titleLabel; }
    QLabel* getStoreLabel() const      { return storeLabel; }
    QLabel* getPriceLabel() const      { return priceLabel; }


protected:
    void resizeEvent(QResizeEvent* event) override;

private:
    DealPrice deal;        // CheapSharkin data (kopio)
    QString   storeName;   // kaupan nimi, esim. "Steam"

    QLabel* titleLabel;    // pelin nimi
    QLabel* storeLabel;    // kaupan nimi
    QLabel* priceLabel;    // "Sale: xx | Normal: yy"
    QPushButton* openButton; // linkkinappi
    


    void setupUi();
    void updateTexts();
};

#endif // DEALCARD_H
