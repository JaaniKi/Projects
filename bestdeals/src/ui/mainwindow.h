#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QToolBar>
#include <QPushButton>
#include <QTimer>
#include <QPalette>
#include <QWidget>
#include <QVBoxLayout>
#include <QDebug>
#include <QListWidget>
#include <QGroupBox>
#include <QLabel>
#include <QTextBrowser>
#include <QFutureWatcher>
#include <QMap>

#include "cheapshark.h"  // DealPrice-tietue
#include "rawgapi.h"    // RawGameData-tietue

class GameCard;  // eteenpäin viittaava luokka

enum class ViewMode {
    Games,
    Deals
};

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget* parent = nullptr);
    ~MainWindow();

    void show();

public slots:
    void onSearchAction();
    void showDealsForTitle(const QString& title,
                           const QString& releaseDate,
                           int rating,
                           const QString& genres,
                           const QString& platforms,
                           const QString& description);
    void onBackToGames();
    void onThumbnailLoaded(int gameId, QPixmap pixmap);



private:
    QToolBar* toolBar;
    QGroupBox* mainContainer;
    QListWidget* mainWidget;
    QTextBrowser* gameInfoBox;


    RAWG::API* api;

    ViewMode currentView = ViewMode::Games;  // missä näkymässä ollaan
    QString lastSearchText;                  // muista viimeisin haku

    QPushButton* backButton = nullptr;       // nappi takaisin peleihin

    void clearResults();                     // tyhjentää mainwidgetin
    void addDealCard(const DealPrice& p, const QString& storeName);
    void loadInitialGames();
    void addGameCard(const RAWG::RawGameData& game);
    
    // Map to track GameCards by game ID for updating thumbnails
    QMap<int, GameCard*> gameCardMap;
    
};

#endif // MAINWINDOW_H
