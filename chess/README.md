# Chess Game (Qt / C++)

A simple graphical chess game implemented in **C++** using **Qt**.

The project was originally started as a school assignment and later extended independently.  
Files marked with *"STUDENT: DO NOT MODIFY THIS FILE!"* were provided as part of the course and were not developed by me.

---

## Game Overview

This is a simplified version of chess where the goal is to **capture the opponent’s king**.
The game does not include check, checkmate, or draw rules.

---

## How to Play

- Click a piece of your own color to select it
- Legal moves are highlighted on the board
- Click a highlighted square to move the piece
- Turns switch automatically after a move
- The first player to capture the opponent’s king wins

---

## User Interface

- 8×8 graphical chess board
- Information label showing the current turn or the game result
- Buttons:
  - **Restart** – starts a new game (White begins)
  - **Quit** – closes the application

---

## Requirements

- Qt 6.x (Qt 5.x may also work)
- Qt Creator (recommended)
- C++17 compatible compiler (MinGW or MSVC)

---

## Build and Run

### Using Qt Creator (Recommended)

1. Install Qt (including Qt Creator and a compiler)
2. Open Qt Creator
3. Select **File → Open File or Project**
4. Open `chess.pro`
5. Choose a Desktop kit
6. Configure, build, and run the project

---

### Command Line (qmake)

**Windows (Qt Command Prompt + MinGW):**

```bat
qmake chess.pro
mingw32-make
chess.exe
