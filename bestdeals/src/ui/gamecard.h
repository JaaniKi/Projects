#ifndef GAMECARD_H
#define GAMECARD_H

#include <QWidget>
#include <QLabel>
#include <QPushButton>
#include <QPixmap>

class GameCard : public QWidget {
    Q_OBJECT

public:
    explicit GameCard(const QString& title,
        const QString& description,
        const QPixmap& thumbnail,
        int rating = -1,
        QWidget* parent = nullptr);

    // Accessors
    QLabel* getThumbnailLabel() const { return thumbnailLabel; }
    QLabel* getTitleLabel() const { return titleLabel; }
    QLabel* getDescriptionLabel() const { return releasedLabel; }
    QPushButton* getDealButton() const { return dealButton; }

    // Mutators
    void setTitle(const QString& title);
    void setDescription(const QString& description);
    void updateThumbnail(const QPixmap& thumbnail);
    void emitShowDeals();
    void resizeEvent(QResizeEvent* event) override;

signals:
    void showDealsClicked();

private:
    QLabel* thumbnailLabel;
    QLabel* titleLabel;
    QLabel* releasedLabel;
    QPushButton* dealButton;
};

#endif // GAMECARD_H