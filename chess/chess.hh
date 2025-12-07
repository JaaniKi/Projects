/**
 * STUDENT: DO NOT MODIFY THIS FILE!
 */

#ifndef CHESS_H
#define CHESS_H

#include "chessboard.hh"
#include "queen.hh"
#include "king.hh"
#include "rook.hh"
#include "knight.hh"
#include "bishop.hh"
#include "pawn.hh"

enum GameState {
    IN_PROGRESS,
    BLACK_WIN,
    WHITE_WIN
};


// Describes an attempted move and whether it was made or not. Used internally by the Chess class.
struct Move {
    // Was the move made or not?
    bool moved;

    // Source and destination of the move
    Coord src;
    Coord dest;

    // The moved piece if there was one
    shared_ptr<ChessPiece> moved_piece;

    // The captured piece if there was one
    shared_ptr<ChessPiece> captured_piece;
};

/**
 * @brief The Chess class
 * The chess class represents a game of chess. It keeps track of the board state and
 * whose turn it is. It also has a method for making a move.
 */
class Chess
{
public:
    Chess();

    /**
     * @brief get_current_turn Returns the color of the player whose turn it it.
     * @return ChessColor - whose turn
     */
    ChessColor get_current_turn() const;

    /**
     * @brief get_board Getter for the ChessBoard used in this game.
     * @return ChessBoard
     */
    ChessBoard get_board() const;

    /**
     * @brief get_game_state Getter for the current game state, in progress or who won.
     * @return GameState
     */
    GameState get_game_state() const;

    /**
     * @brief make_move Makes a move in the game of chess. If the move is illegal, meaning that
     * the game is over, it is the other player's turn, or it is not an allowed move by the piece,
     * the move is not made.
     * @param piece The piece to move
     * @param dest The destination of the move
     * @return true if the move was made, false otherwise.
     */
    bool make_move(shared_ptr<ChessPiece> piece, Coord dest);

    /**
     * @brief start_game Starts a new game of chess.
     * @param starting_player The player who starts the game.
     */
    void start_game(ChessColor starting_player = WHITE);

private:
    ChessColor current_turn_;
    ChessBoard board_;
    GameState game_state_;

    void change_turn();

    void reset_board();

    /**
     * Moves a piece from the source tile to a new position. If the coordinates are incorrect
     * or there is no piece at source, the move is not made.
     * @param start the starting position of the move
     * @param end the ending position of the move
     * @return The details of the chess move.
     */
    Move move_piece(Coord src, Coord dest);

    void set_piece(Coord coord, shared_ptr<ChessPiece> piece);
    void set_piece(int row, int col, shared_ptr<ChessPiece> piece);
};

#endif // CHESS_H
