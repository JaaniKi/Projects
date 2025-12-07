// Lähetti, voi vinottain liikkua kuinka pitkälle tahansa.


#ifndef BISHOP_HH
#define BISHOP_HH

#include "chesspiece.hh"

/**
 * @brief The Bishop class
 * The bishop moves diagonally, through any number of unoccupied squares
 * until it meets an edge or another piece, which it can capture if it is an enemy piece.
 */
class Bishop : public ChessPiece
{
public:
    Bishop(ChessColor col);
    virtual ~Bishop() = default;

    virtual set<Coord> get_allowed_moves(ChessBoard const& board) const override;

private:

};

#endif // BISHOP_HH
