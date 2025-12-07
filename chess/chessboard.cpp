/*
STUDENT: DO NOT MODIFY THIS FILE!
*/

#include <memory>

#include "chessboard.hh"

ChessBoard::ChessBoard() {}

shared_ptr<ChessPiece> ChessBoard::get_piece_at(const Coord &c) const
{
    if (not coord_in_bounds(c))
    {
        return nullptr;
    }

    return board_[c.row][c.col];
}

shared_ptr<ChessPiece> ChessBoard::get_piece_at(int row, int col) const
{
    return get_piece_at({row, col});
}


bool ChessBoard::coord_in_bounds(Coord const& coord) const
{
    return coord.row >= 0 && coord.row < BOARD_SIZE && coord.col >= 0 && coord.col < BOARD_SIZE;
}

bool ChessBoard::set_piece(int row, int col, shared_ptr<ChessPiece> piece)
{
    if (not coord_in_bounds({row, col}))
    {
        return false;
    }

    board_[row][col] = piece;
    return true;
}

bool ChessBoard::set_piece(Coord coord, shared_ptr<ChessPiece> piece)
{
    return set_piece(coord.row, coord.col, piece);
}

