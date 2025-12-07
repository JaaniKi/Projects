// mainwindow.hh. Tässä tiedostossa on pääikkunan toteutus


#include "mainwindow.hh"
#include <QIcon>
#include <QSize>
#include <QDebug>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , selected_piece_(nullptr)
{
    central_widget_ = new QWidget(this);
    setCentralWidget(central_widget_);
    QVBoxLayout* main_layout = new QVBoxLayout(central_widget_);

    info_label_ = new QLabel(this);
    main_layout->addWidget(info_label_);

    // shakkilautagrid
    board_layout_ = new QGridLayout();
    main_layout->addLayout(board_layout_);
    board_buttons_.resize(8);
    for (int r = 0; r < 8; ++r)
        board_buttons_[r].resize(8);
    initialize_board();

    // Restart ja Quit napit
    QHBoxLayout* btn_layout = new QHBoxLayout();
    restart_button_ = new QPushButton("Restart", this);
    quit_button_    = new QPushButton("Quit", this);
    btn_layout->addWidget(restart_button_);
    btn_layout->addWidget(quit_button_);
    main_layout->addLayout(btn_layout);

    connect(restart_button_, &QPushButton::clicked, this, &MainWindow::restart_game);
    connect(quit_button_,    &QPushButton::clicked, this, &MainWindow::quit_game);

    // aloita peli
    game_.start_game();
    update_board();
    show_game_status();
}

MainWindow::~MainWindow() {}

void MainWindow::initialize_board()
{
    for (int r = 0; r < 8; ++r) {
        for (int c = 0; c < 8; ++c) {
            QPushButton* btn = new QPushButton(this);
            btn->setFixedSize(64, 64);
            btn->setFlat(true);  // jotta border näkyy
            QString base = ((r + c) % 2 == 0) ? "wt" : "bl";
            btn->setIcon(QIcon(QString(":/pieces/empty-%1.png").arg(base)));
            btn->setIconSize(QSize(64, 64));
            board_layout_->addWidget(btn, r, c);
            board_buttons_[r][c] = btn;
            connect(btn, &QPushButton::clicked, this, &MainWindow::handle_square_click);
        }
    }
}

void MainWindow::handle_square_click()
{
    QPushButton* clicked = qobject_cast<QPushButton*>(sender());
    int row = -1, col = -1;
    for (int r = 0; r < 8; ++r)
        for (int c = 0; c < 8; ++c)
            if (board_buttons_[r][c] == clicked) {
                row = r; col = c;
            }
    if (row < 0) return;

    Coord coord{row, col};
    const ChessBoard& board = game_.get_board();

    // 1) Jos on jo valittu nappula ja klikkaus on korostettu -> siirrä
    if (selected_piece_ && highlighted_moves_.count(coord)) {
        if (game_.make_move(selected_piece_, coord)) {
            // Siirto onnistui: päivitä lauta ja tilateksti
            selected_piece_.reset();
            clear_highlights();
            update_board();
            show_game_status();
        }
        return;
    }

    // 2) Muuten, jos klikkasit nappulaa, korosta sen siirrot
    auto piece = board.get_piece_at(coord);

    if (piece && piece->get_color() == game_.get_current_turn()
        && game_.get_game_state() == IN_PROGRESS) {
        clear_highlights();
        selected_piece_ = piece;
        highlighted_moves_ = piece->get_allowed_moves(board);
        highlight_moves(highlighted_moves_);
    } else {
        clear_highlights();
    }
}


void MainWindow::highlight_moves(const std::set<Coord>& moves)
{
    for (const auto& m : moves) {
        // tarkistus
        if (m.row >= 0 && m.row < BOARD_SIZE && m.col >= 0 && m.col < BOARD_SIZE) {
            QPushButton* btn = board_buttons_[m.row][m.col];
            btn->setIconSize(QSize(56, 56));
            btn->setStyleSheet("border: 2px solid red;");

        }
    }
}

void MainWindow::clear_highlights()
{
    for (int r = 0; r < 8; ++r) {
        for (int c = 0; c < 8; ++c) {
            QPushButton* btn = board_buttons_[r][c];
            btn->setStyleSheet("");
            btn->setIconSize(QSize(64, 64));
        }

    }


    highlighted_moves_.clear();
}

void MainWindow::update_board()
{
    const ChessBoard& board = game_.get_board();
    for (int r = 0; r < 8; ++r) {
        for (int c = 0; c < 8; ++c) {
            auto piece = board.get_piece_at({r, c});
            QPushButton* btn = board_buttons_[r][c];
            QString base = ((r + c) % 2 == 0) ? "wt" : "bl";
            if (!piece) {
                btn->setIcon(QIcon(QString(":/pieces/empty-%1.png").arg(base)));
            } else {
                QString color = piece->get_color() == WHITE ? "wt" : "bl";
                QString type  = QString::fromStdString(piece->get_name());
                btn->setIcon(QIcon(QString(":/pieces/%1-%2-on-%3.png").arg(color, type, base)));
            }
            btn->setIconSize(QSize(64, 64));
        }
    }
}

void MainWindow::show_game_status()
{
    if (game_.get_game_state() == IN_PROGRESS) {
        info_label_->setText(game_.get_current_turn() == WHITE ? "White's turn" : "Black's turn");
    } else {
        info_label_->setText(game_.get_game_state() == WHITE_WIN ? "White won!" : "Black won!");
    }
}

void MainWindow::restart_game()
{
    selected_piece_.reset();
    clear_highlights();
    game_.start_game();
    update_board();
    show_game_status();
}

void MainWindow::quit_game()
{
    close();
}
