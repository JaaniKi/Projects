#include "knight.hh"

Knight::Knight(ChessColor col): ChessPiece(col, KNIGHT, "knight") {}

set<Coord> Knight::get_allowed_moves(const ChessBoard &board) const
{
    set<Coord> moves;
    auto [row, col] = get_position();

    // down
    check_move(board, {row + 2, col + 1}, moves);
    check_move(board, {row + 2, col - 1}, moves);

    // up
    check_move(board, {row - 2, col + 1}, moves);
    check_move(board, {row - 2, col - 1}, moves);

    // left
    check_move(board, {row - 1, col - 2}, moves);
    check_move(board, {row + 1, col - 2}, moves);

    // right
    check_move(board, {row - 1, col + 2}, moves);
    check_move(board, {row + 1, col + 2}, moves);

    return moves;
}

void Knight::check_move(const ChessBoard &board, const Coord &dest, set<Coord> &moves) const
{
    // Add the move, if the square is in bounds, it's empty or there is an enemy piece
    if (board.coord_in_bounds(dest))
    {
        shared_ptr<ChessPiece> piece = board.get_piece_at(dest);
        if (piece == nullptr || piece->get_color() != get_color())
        {
            moves.insert(dest);
        }
    }
}
