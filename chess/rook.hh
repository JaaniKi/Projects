// Torni, voi liikkua vaaka ja pystysuorassa kuinka pitkälle vain.


#ifndef ROOK_HH
#define ROOK_HH

#include "chesspiece.hh"

/**
 * @brief The Rook class
 * The rook moves horizontally or vertically, through any number of unoccupied squares
 * until it meets an edge or another piece, which it can capture if it is an enemy piece.
 */
class Rook : public ChessPiece
{
public:
    Rook(ChessColor col);
    virtual ~Rook() = default;

    virtual set<Coord> get_allowed_moves(ChessBoard const& board) const override;

private:

};

#endif // ROOK_HH
