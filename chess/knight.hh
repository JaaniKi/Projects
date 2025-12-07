#ifndef KNIGHT_HH
#define KNIGHT_HH

#include "chesspiece.hh"

/**
 * @brief The Knight class
 * The knight moves in an L-shape: two squares in one direction and then one square in a perpendicular direction.
 * It can jump over other pieces, and captures by landing on an enemy piece.
 */
class Knight : public ChessPiece
{
public:
    Knight(ChessColor col);
    virtual ~Knight() = default;

    virtual set<Coord> get_allowed_moves(ChessBoard const& board) const override;

private:
    void check_move(const ChessBoard &board, const Coord &dest, set<Coord> &moves) const;
};

#endif // KNIGHT_HH
