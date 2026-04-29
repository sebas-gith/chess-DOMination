# chess-DOMination

A functional, interactive chess board built with Vanilla JavaScript and Vite. It focuses on direct DOM manipulation and the native HTML5 Drag and Drop API, and was entirely hand-coded without the use of AI generators.

## Key Features
- **Custom Logic Engine:** Movement rules calculated using a linear 64-square coordinate system (0-63).
- **DOM-Driven State:** The HTML structure acts as the source of truth, updating nodes in real-time.
- **Native Drag & Drop:** Piece movement built without external UI libraries.
- **Move Validation:** Calculates allowed trajectories, prevents self-captures, and dynamically highlights valid squares.

## Tech Stack
- Vite
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3

## Usage

```bash
git clone https://github.com/sebas-gith/chess-DOMination.git
cd chess-DOMination
npm install
npm run dev
```

