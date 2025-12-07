// mainwindow.hh. Tässä tiedostossa on pääikkuna.


#ifndef MAINWINDOW_HH
#define MAINWINDOW_HH

#include <QMainWindow>
#include <QPushButton>
#include <QLabel>
#include <QGridLayout>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QVector>
#include <memory>
#include <set>

#include "chess.hh"

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    // Rakentaja: alustaa käyttöliittymän elementit.
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    // Käsittelee ruudun klikkauksen: valinta ja siirto.
    void handle_square_click();

    // Käynnistää uuden pelin nollaten kaiken tilan.
    void restart_game();

    // Sulkee ohjelman.
    void quit_game();

private:
    // Luo 8×8-nappulat ja lisää ne ruudukkoon.
    void initialize_board();

    // Korostaa ruudut, joihin valittu nappula voi liikkua.
    void highlight_moves(const std::set<Coord>& moves);

    // Poistaa kaikki korostukset laudalta.
    void clear_highlights();

    // Päivittää infotekstin pelin tilasta.
    void show_game_status();

    // Päivittää kaikkien ruutujen kuvakkeet pelilaudan mukaan.
    void update_board();

    QWidget* central_widget_;
    QLabel* info_label_;
    QGridLayout* board_layout_;
    QPushButton* restart_button_;
    QPushButton* quit_button_;
    QVector<QVector<QPushButton*>> board_buttons_;

    // Shakkipelin logiikka
    Chess game_;
    std::shared_ptr<ChessPiece> selected_piece_;
    std::set<Coord> highlighted_moves_;
};

#endif // MAINWINDOW_HH
