# Battleship (DTEK2090 Programming Exercise - Category B)

## Overview
This project is a two-player Battleship game built with React. The game supports ship placement using drag-and-drop and turn-based shooting with clear feedback.

## How to run
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open the shown localhost URL.

## Implemented screens (UI flow)
1. Setup screen  
   - Player names
   - Grid size (5–10)
   - Ship counts
   - Validation rule: Grid Area >= 2 × Ship Area

2. Placement screen (Player 1, then Player 2)  
   - Drag ships onto the grid to place them
   - Press **R** to rotate the ship
   - Invalid placement feedback (overlap / out of bounds)

3. Pass screen  
   - Asks to pass the device to the next player (prevents cheating)

4. Game screen  
   - Shows own board + enemy board
   - Click or use keyboard to shoot enemy grid
   - Rule: **hit = shoot again**, **miss = turn passes**

5. Game over screen  
   - Shows winner + restart

## Input modalities (2+)
- Mouse / pointer:
  - Drag-and-drop ship placement
  - Click to shoot on enemy grid
- Keyboard:
  - **R** rotates ships during placement
  - Arrow keys move cursor on enemy grid
  - Enter/Space shoots the selected enemy cell

## Output modalities (2+)
- Graphics:
  - Dynamic grid drawing (size changes based on setup)
  - Visual hit/miss markers and cursor highlight
- Audio:
  - Sound effects for hit/miss/sunk/click actions

## Usability notes
- Visibility of system status: turn indicator + message after each shot
- Feedback: hit/miss markers + sound effects
- Error prevention: placement validation and “already shot” warning
- Learnability: simple setup flow and clear instructions on screen

## Known limitations / future work
- Could add stronger animations for hits/misses
- Could add mobile-friendly layout

## AI usage
- (Write honestly.) Example:
  - Used AI for brainstorming code structure and naming.
  - All logic was tested manually in the browser.
