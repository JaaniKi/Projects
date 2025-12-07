/*
STUDENT: DO NOT MODIFY THIS FILE!
*/

#ifndef CHESSBOARD_H
#define CHESSBOARD_H

#include <array>
#include <memory>
#include <string>


using namespace std;


/**
 * @brief The Coord class
 * Represents a two dimensional coordinate.
 */
struct Coord
{
    int row;
    int col;

    // Comparison operators
    bool operator== (const Coord &other) const {
        return row == other.row && col == other.col;
    }
    bool operator!= (const Coord &other) const {
        return !(*this == other);
    }
    bool operator< (const Coord &other) const {
        return row < other.row || (row == other.row && col < other.col);
    }
};
const Coord NULL_COORD = {-1, -1};


// Forward declaration of ChessPiece because ChessBoard and ChessPiece depend on each other
class ChessPiece;

const int BOARD_SIZE = 8;

// Board data structure. A two dimensional array of shared pointers to ChessPieces.
using Board = array<array<shared_ptr<ChessPiece>, BOARD_SIZE>, BOARD_SIZE>;

/**
 * @brief The ChessBoard class
 * Represents a chess board. It is responsible for keeping track of the pieces on the board.
 */
class ChessBoard
{
public:
    ChessBoard();

    /**
     * @brief get_piece_at Gets the piece at a given coordinate if one exists there.
     * @param c the coord
     * @return the piece at the coord if there is one, nullptr otherwise. Out of bounds coords
     * return nullptr as well.
     */
    shared_ptr<ChessPiece> get_piece_at(Coord const& c) const;
    shared_ptr<ChessPiece> get_piece_at(int row, int col) const;



    /**
     * @brief coord_in_bounds checks if a coord is within the bounds of the chess board
     * @param c the coord to check
     * @return true if the coord is in bounds, false otherwise
     */
    bool coord_in_bounds(Coord const& c) const;

    /**
     * @brief set_piece Sets the piece at the given coordinates. Do not use for moving pieces, only for
     * setting new pieces onto the board.
     * @param row
     * @param col
     * @param piece
     * @return true if piece was set, false otherwise
     */
    bool set_piece(int row, int col, shared_ptr<ChessPiece> piece);
    bool set_piece(Coord coord, shared_ptr<ChessPiece> piece);

private:
    Board board_;
};

#endif // CHESSBOARD_H
