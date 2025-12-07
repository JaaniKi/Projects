#include "pawn.hh"

Pawn::Pawn(ChessColor col): ChessPiece(col, PAWN, "pawn") {}

set<Coord> Pawn::get_allowed_moves(const ChessBoard &board) const
{
    // Define which direction is forward
    int direction = get_color() == WHITE ? 1 : -1;

    set<Coord> moves;

    auto [row, col] = get_position();

    // Check if the square in front is in bounds and empty
    if (board.get_piece_at({row + direction, col}) == nullptr)
    {
        moves.insert({row + direction, col});

        // Check if the pawn is in the starting position
        if ((direction == 1 && row == 1) || (direction == -1 && row == BOARD_SIZE - 2))
        {
            if (board.get_piece_at({row + 2 * direction, col}) == nullptr)
            {
                moves.insert({row + 2 * direction, col});
            }
        }
    }

    // Check if the pawn can capture
    auto diag1 = board.get_piece_at({row + direction, col + 1});
    if (diag1 != nullptr && diag1->get_color() != get_color())
    {
        moves.insert({row + direction, col + 1});
    }

    auto diag2 = board.get_piece_at({row + direction, col - 1});
    if (diag2 != nullptr && diag2->get_color() != get_color())
    {
        moves.insert({row + direction, col - 1});
    }

    return moves;
}

