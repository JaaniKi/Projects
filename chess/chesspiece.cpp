/*
STUDENT: DO NOT MODIFY THIS FILE!
*/

#include "chesspiece.hh"

ChessPiece::ChessPiece(ChessColor color, PieceType type, string name): color_(color), type_(type), name_(name) {}

ChessColor ChessPiece::get_color() const
{
    return color_;
}

PieceType ChessPiece::get_type() const
{
    return type_;
}

Coord ChessPiece::get_position() const
{
    return position_;
}

void ChessPiece::set_position(Coord pos)
{
    position_ = pos;
}

string ChessPiece::get_name() const
{
    return name_;
}
