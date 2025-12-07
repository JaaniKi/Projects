// Kuninkaan toteutus


#include "king.hh"

King::King(ChessColor color)
    : ChessPiece(color, KING, "king") {}


set<Coord> King::get_allowed_moves(const ChessBoard &board) const {
    set<Coord> moves;
    Coord pos = get_position();
    ChessColor myColor = get_color();

    for (int dr = -1; dr <= 1; ++dr) {
        for (int dc = -1; dc <= 1; ++dc) {
            if (dr == 0 && dc == 0) continue;
            Coord next = {pos.row + dr, pos.col + dc};
            if (!board.coord_in_bounds(next)) continue;
            auto piece = board.get_piece_at(next);
            if (!piece || piece->get_color() != myColor) {
                moves.insert(next);  // Tyhjä tai vihollinen
            }
        }
    }

    return moves;
}
