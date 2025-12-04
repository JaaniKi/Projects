#include "mainwindow.h"
#include "cheapshark.h"
#include "rawgapi.h"
#include "gamecard.h"
#include "dealcard.h"


#include <QWidgetAction>
#include <QLineEdit>
#include <QDebug>
#include <QFrame>
#include <QLabel>
#include <QPushButton>
#include <climits>
#include <vector>
#include <QFile>
#include <QShortcut>
#include <QStringList>
#include <QtConcurrent/QtConcurrent>

static QString forcePlainAscii(QString title)
{   
    qDebug() << "before conversion" << title;
    QString cleanedTitle = title.replace(QChar(0x2019), '\'');
    qDebug() << "after conversion" << cleanedTitle;
    return cleanedTitle;
}

// Apufunktio: yhdistää std::vector<std::string> -> "A, B, C"
static QString joinStrings(const std::vector<std::string>& v)
{
    QStringList list;
    for (const auto& s : v) {
        if (!s.empty())
            list << QString::fromStdString(s);
    }
    return list.join(", ");
}

QString normalize(QString& s);
int levenshtein(const QString& a, const QString& b);

MainWindow::MainWindow(QWidget* parent) :
    QMainWindow(parent),
    toolBar(new QToolBar("Search bar", this)),
    mainWidget(nullptr),
    mainContainer(new QGroupBox("Results", this))
{
    // MainWindow minimum dimensions
    int MWminWidth = 1200;
    int MWminHeight = 850;
    setMinimumSize(MWminWidth, MWminHeight);

    mainContainer->setBaseSize(QSize(1200, 500));

    // Keskelle "korttialue"
    setCentralWidget(mainContainer);
 
    // List widget conf
    // Pelilista (GameCardit)
    mainWidget = new QListWidget(mainContainer);
    mainWidget->setViewMode(QListView::IconMode);
    mainWidget->setFlow(QListView::LeftToRight);
    mainWidget->setResizeMode(QListView::Adjust);
    mainWidget->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOn);
    mainWidget->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    mainWidget->setWrapping(false);
    mainWidget->setSpacing(10);
    mainWidget->setFocusPolicy(Qt::StrongFocus);

    // Estää korttien liikuttamisen
    mainWidget->setMovement(QListView::Static);
    mainWidget->setDragEnabled(false);
    mainWidget->setDragDropMode(QAbstractItemView::NoDragDrop);
    mainWidget->setDropIndicatorShown(false);    

    // infoboxi
    gameInfoBox = new QTextBrowser(mainContainer);
    gameInfoBox->setObjectName("gameInfoBox");
    gameInfoBox->setVisible(false);
    gameInfoBox->setLineWidth(2);
    gameInfoBox->setMidLineWidth(0);

    // kokoasetukset
    gameInfoBox->setMinimumWidth(700);
    gameInfoBox->setMaximumWidth(1000);
    gameInfoBox->setMinimumHeight(300);

    // rivinvaihdot & wrap
    gameInfoBox->setWordWrapMode(QTextOption::WordWrap);
    gameInfoBox->setReadOnly(true);
    gameInfoBox->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    gameInfoBox->setVerticalScrollBarPolicy(Qt::ScrollBarAsNeeded);
    gameInfoBox->setSizePolicy(QSizePolicy::Preferred, QSizePolicy::MinimumExpanding);

    QVBoxLayout* mainLayout = new QVBoxLayout();
    mainLayout->setContentsMargins(10, 20, 10, 5);
    mainLayout->addWidget(gameInfoBox, 0, Qt::AlignHCenter);
    mainLayout->addWidget(mainWidget);
    mainLayout->setStretch(0, 1);  // info
    mainLayout->setStretch(1, 3);  // listwidget 


    mainContainer->setLayout(mainLayout);

    setWindowTitle("Bestdeals");

    // Toolbar
    addToolBar(Qt::TopToolBarArea, toolBar);
    toolBar->setMovable(false);

    // Create a QWidgetAction so we can insert a custom widget
    QWidgetAction* searchAction = new QWidgetAction(this);

    // Outer container (fills full width of toolbar)
    QWidget* outer = new QWidget(this);
    auto* outerLayout = new QHBoxLayout(outer);
    outerLayout->setContentsMargins(0, 8, 0, 8);
    outerLayout->setSpacing(0);

    // Center box to keeps content centered no matter the window size
    QWidget* centerBox = new QWidget(this);
    auto* centerLayout = new QHBoxLayout(centerBox);
    centerLayout->setContentsMargins(0,0,0,0);
    centerLayout->setSpacing(8);

    // Prevents stretching on ultrawide screens
    centerBox->setMaximumWidth(1200);

    // Search bar
    QLineEdit* searchBar = new QLineEdit(this);
    searchBar->setObjectName("searchBar");
    searchBar->setMinimumHeight(34);
    searchBar->setPlaceholderText("Search game");

    // Search button
    QPushButton* searchButton = new QPushButton("Search", this);
    searchButton->setObjectName("searchButton");
    searchButton->setMinimumHeight(34);
    searchButton->setFixedWidth(70);
    connect(searchButton, &QPushButton::clicked,
            this, &MainWindow::onSearchAction);

    
    // Back button (hidden by default)
    backButton = new QPushButton("Back", this);
    searchButton->setObjectName("backButton");
    backButton->setMinimumHeight(34);
    backButton->setFixedWidth(70);
    backButton->setVisible(false);
    connect(backButton, &QPushButton::clicked,
    this, &MainWindow::onBackToGames);
    
    searchButton->setShortcut(QKeySequence(Qt::Key_Return));


    // Add widgets into center layout
    // Also apply stretch factor
    centerLayout->addWidget(searchBar, 6);
    centerLayout->addWidget(searchButton, 1);
    centerLayout->addWidget(backButton, 1);


    // Center it horizontally
    outerLayout->addStretch();
    outerLayout->addWidget(centerBox);
    outerLayout->addStretch();

    // Assign widget to the QWidgetAction
    searchAction->setDefaultWidget(outer);

    // Add the widget action to toolbar
    toolBar->addAction(searchAction); 
    

    QFile file(":/theme.qss");
    if (file.open(QFile::ReadOnly)) {
        QString appStyleSheet = QLatin1String(file.readAll());
        setStyleSheet(appStyleSheet);
    } 

    api = new RAWG::API("f4c70e996f53499899391dca8fa6b910");
    loadInitialGames();

}
MainWindow::~MainWindow()
{
}
void MainWindow::show()
{
    QMainWindow::show();
}

//Lataa 40 pelin tiedot sovelluksen käynnistyessä
void MainWindow::loadInitialGames()
{
    clearResults();

    if (!api) {
        qCritical() << "No RAWG API instance found!";
        return;
    }
    
    // Käytetään olemassaolevaa funktiota pelien hakemiseen
    std::vector<RAWG::RawGameData> games = api->fetchAllGames();

    //listataan pelit UI:hin
    for (const auto& g : games) {
        addGameCard(g);
    }
}


// Tyhjentää vanhat kortit layoutista
void MainWindow::clearResults()
{
    mainWidget->clear();
    gameCardMap.clear();
}

void MainWindow::onSearchAction()
{
    qDebug() << "search action initiated";

    clearResults();

    gameInfoBox->clear();
    gameInfoBox->setVisible(false);

    QLineEdit* searchBar = toolBar->findChild<QLineEdit*>("searchBar");
    if (!searchBar) {
        qCritical() << "Search bar not found under toolbar element!";
        return;
    }

    QString searchText = searchBar->text();

    lastSearchText = searchText;
    currentView = ViewMode::Games;
    backButton->setVisible(false);
    mainContainer->setTitle("Results");

    // Tehdään haku käyttäen RAWG API:ta
    RAWG::SearchParams params;
    params.query = searchText.toStdString();
    params.page_size = RAWG::PAGE_SIZE;

    // Näistä tehdään joskus hakuehtoja
    params.genres.clear();
    params.platforms.clear();
    params.dates = "";
    params.ordering = "";

    // Haetaan pelit, tyhjennetään vanhat kortit ja näytetään uudet
    std::vector<RAWG::RawGameData> results = api->searchGames(params);

    for (const RAWG::RawGameData& g : results) {
        addGameCard(g);
    }
}


static std::vector<DealPrice> filterDealsForTitle(
    const std::vector<DealPrice>& prices,
    const QString& intendedTitle)
{
    if (prices.empty())
        return {};
    
    int best = INT_MAX;
    std::vector<int> distances;
    distances.reserve(prices.size());

    // Laske Levenshtein-etäisyys jokaiselle CheapShark-nimelle
    for (const auto& p : prices) {
        int d = levenshtein(intendedTitle, p.title);
        distances.push_back(d);
        if (d < best)
            best = d;
    }
    // Poimi vain ne, joilla on pienin etäisyys
    std::vector<DealPrice> result;
    for (size_t i = 0; i < prices.size(); ++i) {
        if (distances[i] == best) {
            result.push_back(prices[i]);
        }
    }
    return result;
}



void MainWindow::showDealsForTitle(const QString& title,
                                   const QString& releaseDate,
                                   int rating,
                                   const QString& genres,
                                   const QString& platforms,
                                   const QString& description)
{
    auto prices = CheapSharkAPI::fetchPrices(title);
    auto stores = CheapSharkAPI::fetchStoreNames();

    // levenshtein filtteri
    prices = filterDealsForTitle(prices, title);

    currentView = ViewMode::Deals;
    backButton->setVisible(true);

    clearResults();

    // Yleisinfolaatikko pelistä dealien yläpuolella
     QString infoHtml;

    if (!releaseDate.isEmpty()) {
        infoHtml += "<b>Released: </b>" + releaseDate.toHtmlEscaped() + "<br>";
    }
    if (!genres.isEmpty()) {
        infoHtml += "<b>Genres: </b>" + genres.toHtmlEscaped() + "<br>";
    }
    if (!platforms.isEmpty()) {
        infoHtml += "<b>Platforms: </b>" + platforms.toHtmlEscaped() + "<br>";
    }

    if (rating >= 0) {
        infoHtml += "<b>Metacritic: </b>" + QString::number(rating) + " / 100<br>";
    } else {
        infoHtml += "Metacritic: N/A<br>";
    }

    if (!description.isEmpty()) {
        QString desc = description;
        desc = desc.toHtmlEscaped();
        desc.replace("\n", "<br>");    // rivinvaihdot näkyviksi

        infoHtml += "<br>";
        infoHtml += "<b>Description:</b>";
        infoHtml += "<br>" + desc;
    }

    gameInfoBox->setHtml(infoHtml);
    gameInfoBox->setVisible(true);

    if (prices.empty()) {
        QListWidgetItem* item = new QListWidgetItem(mainWidget);
        item->setText(QString("No deals found for \"%1\"").arg(title));
        mainWidget->addItem(item);
        mainContainer->setTitle(QString("Deals for: %1").arg(title));
        return;
    }

    for (const auto& p : prices) {
        QString storeName =
            stores.count(p.storeID)
            ? stores[p.storeID]
            : QString("StoreID %1").arg(p.storeID);

        addDealCard(p, storeName);
    }

    mainContainer->setTitle(QString("Deals for: %1").arg(title));
}



void MainWindow::addGameCard(const RAWG::RawGameData& game)
{
    // Create card immediately with empty pixmap (no blocking)
    QPixmap emptyPix;
    GameCard* gameCard = new GameCard(QString::fromStdString(game.name), 
        QString::fromStdString(game.released), emptyPix, game.rating);

    // Create a list widget item
    QListWidgetItem* item = new QListWidgetItem(mainWidget);
    item->setSizeHint(QSize(300, 500));

    // Add the custom widget into the list
    mainWidget->addItem(item);
    mainWidget->setItemWidget(item, gameCard);

    // Store card reference for later thumbnail update
    gameCardMap[game.id] = gameCard;

    // Make genres and platforms QStrings
    QString genresText    = joinStrings(game.genres);
    QString platformsText = joinStrings(game.platforms);
    QString description   = QString::fromStdString(game.description);
    
    // Show deals when button clicked
    connect(gameCard, &GameCard::showDealsClicked,
            this, [this, game, genresText, platformsText]() mutable {
                // tehdään kopio game:sta, jota voidaan muokata
                RAWG::RawGameData gameCopy = game;

                api->fetchDescription(gameCopy);

                QString description =
                    QString::fromStdString(gameCopy.description);

                showDealsForTitle(
                    QString::fromStdString(gameCopy.name),
                    QString::fromStdString(gameCopy.released),
                    gameCopy.rating,
                    genresText,
                    platformsText,
                    description
                );
            });

    // Load thumbnail asynchronously
    QtConcurrent::run([this, gameId = game.id, url = game.thumbnail]() {
        QPixmap* pixPtr = api->downloadPixmap(url);
        QPixmap pix = pixPtr ? *pixPtr : QPixmap();
        if (pixPtr) delete pixPtr;
        
        // Signal the main thread to update the UI
        emit onThumbnailLoaded(gameId, pix);
    });
}


void MainWindow::addDealCard(const DealPrice& p, const QString& storeName)
{
    DealCard* card = new DealCard(p, storeName, mainWidget);

    QListWidgetItem* item = new QListWidgetItem(mainWidget);
    item->setSizeHint(QSize(300, 300)); // voi säätää

    mainWidget->addItem(item);
    mainWidget->setItemWidget(item, card);
}



void MainWindow::onBackToGames()
{
    currentView = ViewMode::Games;
    backButton->setVisible(false);

    if (!lastSearchText.isEmpty()) {
        // Aseta hakukenttään edellinen teksti ja tee haku
        QLineEdit* searchBar = toolBar->findChild<QLineEdit*>("searchBar");
        if (searchBar) {
            searchBar->setText(lastSearchText);
        }
        onSearchAction();
    } else {
        clearResults();
        gameInfoBox->clear();
        gameInfoBox->setVisible(false);
        mainContainer->setTitle("Results");
        loadInitialGames();
    }
}

void MainWindow::onThumbnailLoaded(int gameId, QPixmap pixmap)
{
    if (gameCardMap.contains(gameId)) {
        gameCardMap[gameId]->updateThumbnail(pixmap);
    }
}