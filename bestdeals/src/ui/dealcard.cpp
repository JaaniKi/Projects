#include "dealcard.h"

#include <QVBoxLayout>
#include <QResizeEvent>
#include <QDesktopServices>
#include <QUrl>

/*
 * Konstruktori:
 *  - tallentaa deal + storeName
 *  - rakentaa UI:n
 *  - täyttää tekstit
 */
DealCard::DealCard(const DealPrice& deal,
                   const QString& storeName,
                   QWidget* parent)
    : QWidget(parent),
      deal(deal),
      storeName(storeName),
      titleLabel(nullptr),
      storeLabel(nullptr),
      priceLabel(nullptr)
{
    setFixedHeight(140);
    setMaximumWidth(300);

    setupUi();
    updateTexts();
}


/*
 * Rakennetaan UI-elementit ja asetetaan layout.
 */
void DealCard::setupUi()
{
    auto* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(2, 2, 2, 2);
    mainLayout->setSpacing(5);
    setLayout(mainLayout);

    titleLabel = new QLabel(this);
    titleLabel->setObjectName("titleLabel");
    titleLabel->setFixedHeight(30);
    titleLabel->setAlignment(Qt::AlignCenter);

    storeLabel = new QLabel(this);
    storeLabel->setObjectName("textLabel");
    storeLabel->setFixedHeight(24);
    storeLabel->setAlignment(Qt::AlignCenter);

    priceLabel = new QLabel(this);
    priceLabel->setObjectName("textLabel");
    priceLabel->setFixedHeight(24);
    priceLabel->setAlignment(Qt::AlignCenter);

    openButton = new QPushButton(tr("Open store"), this);
    openButton->setObjectName("openButton");
    openButton->setFixedHeight(28);
    openButton->setFixedWidth(80);

    mainLayout->addStretch();
    mainLayout->addWidget(titleLabel, 0, Qt::AlignCenter);
    mainLayout->addWidget(storeLabel, 0, Qt::AlignCenter);
    mainLayout->addWidget(priceLabel, 0, Qt::AlignCenter);
    mainLayout->addStretch();
    mainLayout->addWidget(openButton, 0, Qt::AlignCenter);

    // nappi avaa selaimessa kaupan sivun
    connect(openButton, &QPushButton::clicked, this, [this]() {
        if (deal.dealID.isEmpty())
            return;

        QString url = QString("https://www.cheapshark.com/redirect?dealID=%1")
                          .arg(deal.dealID);
        QDesktopServices::openUrl(QUrl(url));
    });
    
}


/*
 * Päivitetään tekstit DealPrice–rakenteen pohjalta.
 */
void DealCard::updateTexts()
{
    titleLabel->setText(deal.title);

    storeLabel->setText("Store: " + storeName);

    priceLabel->setText(
        QString("Sale: %1 | Normal: %2")
            .arg(deal.salePrice)
            .arg(deal.normalPrice)
    );
}


void DealCard::resizeEvent(QResizeEvent* event)
{
    QWidget::resizeEvent(event);

    // Lyhennetään otsikko, jos se ei mahdu kortin leveyteen
    QFontMetrics fm(titleLabel->font());
    QString elided = fm.elidedText(titleLabel->text(), Qt::ElideRight, 260);
    titleLabel->setText(elided);
}
