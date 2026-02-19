## Contribution
- Name: Muhammad Taimur
- Student number: 1.2.246.562.24.54403797018
- Contribution: Implemented the full project in React (setup and validation, ship placement with drag and drop and rotation, gameplay and turn handoff, UI styling, sound effects, and testing).

# Neon Battleships

Neon Battleships is a two player Battleship game built with React. The project includes configurable setup, ship placement with drag and drop, a pass screen between turns, turn based shooting with mouse and keyboard, sound effects, and a game over screen with restart.

## How to run

### Requirements
- Node.js (LTS recommended)
- npm

### Start
1. Install dependencies:
   - `npm install`
2. Run the development server:
   - `npm run dev`
3. Open the localhost URL printed in the terminal.

### Optional build check
1. Build:
   - `npm run build`
2. Preview:
   - `npm run preview`

## Game flow

### 1) Setup screen
- Enter Player 1 and Player 2 names
- Choose grid size from 5 to 10
- Choose ship counts for each ship type
- Validation shown in the UI:
  - GA = gridSize × gridSize
  - SA = sum(shipCount × shipLength)
  - Rule: GA must be at least 2 × SA

### 2) Placement screen (Player 1, then Player 2)
- Place ships using drag and drop
- Press `R` to rotate ship orientation (horizontal or vertical)
- The grid shows a preview highlight during drag:
  - Valid placement is highlighted
  - Invalid placement shows an error message
- Confirm placement after all ships are placed

### 3) Pass screen
- A handoff screen appears between turns so the next player can take the device
- This helps prevent the next player from seeing the board early

### 4) Gameplay screen
- Two boards are shown:
  - Your board (ships visible)
  - Enemy board (ships hidden)
- Shoot the enemy board until one side loses all ships
- The UI shows hit and miss markers
- Sound effects play for key actions (for example hit, miss, and sink)
- Turn behaviour:
  - Hit: the current player continues
  - Miss: the turn passes and the pass screen is shown

### 5) Game over screen
- The winner is displayed
- Restart returns to the setup screen

## Controls

### Placement
- Mouse or trackpad: drag and drop ships onto the grid
- Keyboard: press `R` to rotate

### Gameplay
- Mouse or trackpad: click a cell on the enemy board to shoot
- Keyboard: arrow keys move the cursor on the enemy board
- Keyboard: press `Enter` to shoot the selected cell
- Restart button: ends the current game and returns to setup

## Assignment requirement mapping

### Input modalities
- Mouse or trackpad: form inputs, drag and drop placement, click to shoot
- Keyboard: rotate with `R`, aim with arrow keys, shoot with `Enter`

### Output modalities
- Graphics: dynamic rendering of grids and game state (ships on own board, hits, misses, cursor highlight)
- Audio: sound effects for gameplay feedback

### Views and state transitions
Setup → Placement (Player 1) → Placement (Player 2) → Pass → Play → Game over → Restart

### Domain model
- Board and cell state (ship presence, shot, hit)
- Ship definitions and placement rules
- Shooting logic and win detection
- Setup validation using GA and SA

## Project structure
- `src/model/` game logic (board creation, placement, shooting, win checks, setup validation)
- `src/ui/screens/` SetupScreen, PlacementScreen, PassScreen, GameScreen
- `src/ui/components/` BoardGrid
- `src/ui/theme.css` dark theme styling
- `src/assets/sounds/` sound effect files

## Notes
- This is a local two player game on a shared device.
- Enemy ships are hidden during gameplay.

## AI usage statement
AI tools were used to assist with UI styling and implementation guidance. All final code was integrated and tested manually.
