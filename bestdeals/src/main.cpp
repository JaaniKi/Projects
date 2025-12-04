#include "cheapshark.h"
#include <iostream>
#include <QApplication>
#include <QMainWindow>

#include <mainwindow.h>


std::string GAME_TITLE = "dark_souls";


int main(int argc, char* argv[])
{
    QApplication app(argc, argv);

    MainWindow w;
    w.show();

    return app.exec();
}
