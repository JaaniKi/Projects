// Kuningattaren toteutus


#include "queen.hh"

Queen::Queen(ChessColor color)
    : ChessPiece(color, QUEEN, "queen") {}

set<Coord> Queen::get_allowed_moves(const ChessBoard &board) const {
    set<Coord> moves;
    Coord pos = get_position();
    ChessColor myColor = get_color();

    const vector<pair<int, int>> directions = {
        {1, 0}, {-1, 0}, {0, 1}, {0, -1},    // suorat suunnat
        {1, 1}, {-1, -1}, {-1, 1}, {1, -1}   // diagonaaliset suunnat
    };

    for (auto [dr, dc] : directions) {
        Coord next = pos;
        while (true) {
            next = {next.row + dr, next.col + dc};
            if (!board.coord_in_bounds(next)) break;
            auto piece = board.get_piece_at(next);
            if (!piece) {
                moves.insert(next);
            } else {
                if (piece->get_color() != myColor) {
                    moves.insert(next);
                }
                break;
            }
        }
    }

    return moves;
}
