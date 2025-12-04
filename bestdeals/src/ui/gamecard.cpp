#include "gamecard.h"

#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QFont>
#include <QDebug>
#include <QPixmap>
#include <QResizeEvent>

GameCard::GameCard(const QString& title,
    const QString& releaseDate,
    const QPixmap& thumbnail,
    int rating,
    QWidget* parent)
    : QWidget(parent)
{
    setMaximumHeight(500);
    setFixedWidth(300);

    thumbnailLabel = new QLabel(this);
    thumbnailLabel->setFixedSize(290, 220);
    if (thumbnail.isNull())
        thumbnailLabel->setText("No Image");

    thumbnailLabel->setAlignment(Qt::AlignCenter);
    thumbnailLabel->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Fixed);

    titleLabel = new QLabel(this);
    titleLabel->setAlignment(Qt::AlignCenter);
    titleLabel->setFixedHeight(40);
    titleLabel->setObjectName("titleLabel");
    titleLabel->setText(title);


    releasedLabel = new QLabel(QString("Released: " + releaseDate));
    releasedLabel->setAlignment(Qt::AlignCenter);
    releasedLabel->setFixedHeight(40);
    releasedLabel->setObjectName("releasedLabel");
    releasedLabel->setFixedWidth(180);


    dealButton = new QPushButton("See Deals", this);
    dealButton->setFixedHeight(30);
    dealButton->setFixedWidth(70);
    dealButton->setObjectName("gameDealButton");

    QHBoxLayout* buttonLayout = new QHBoxLayout;

    buttonLayout->addWidget(releasedLabel, 0, Qt::AlignLeft);
    buttonLayout->addWidget(dealButton, 0, Qt::AlignLeft);
    buttonLayout->addStretch();

    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->addWidget(thumbnailLabel, 0, Qt::AlignTop);
    mainLayout->addWidget(titleLabel, 0, Qt::AlignTop);

    if (rating != -1)
    {
        QLabel* ratingLabel = new QLabel("Metacritic rating (0-100):   " + QString::number(rating));
        ratingLabel->setAlignment(Qt::AlignCenter);
        ratingLabel->setFixedHeight(50);
        ratingLabel->setObjectName("gameRatingLabel");
        mainLayout->addWidget(ratingLabel);
    }

    mainLayout->addLayout(buttonLayout);

    mainLayout->setSpacing(5);
    mainLayout->setContentsMargins(2, 2, 2, 2);


    setLayout(mainLayout);

    connect(dealButton, &QPushButton::clicked, this, &GameCard::emitShowDeals);
}

// Mutators
void GameCard::setTitle(const QString& title) {
    titleLabel->setText(title);
}

void GameCard::setDescription(const QString& releaseDate) {
    releasedLabel->setText(releaseDate);
}

void GameCard::updateThumbnail(const QPixmap& thumbnail) {
    if (!thumbnail.isNull()) {
        thumbnailLabel->setPixmap(thumbnail.scaledToWidth(290, Qt::SmoothTransformation));
    }
}

void GameCard::emitShowDeals()
{
    qDebug() << "show deals clicked";
    emit showDealsClicked();
}

// Edit titles to continue with 3 dots if they can't fit in the card
void GameCard::resizeEvent(QResizeEvent* event) 
{ 
    QWidget::resizeEvent(event);

    QFontMetrics fm(titleLabel->font());
    QString elided = fm.elidedText(titleLabel->text(), Qt::ElideRight, 260);
    titleLabel->setText(elided);
    
}
