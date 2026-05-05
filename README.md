# chess-DOMination

![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-Drag%20%26%20Drop-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Grid-1572B6?logo=css3&logoColor=white)

A fully functional, interactive chess game built from scratch with Vanilla JavaScript and Vite.

The core idea behind this project was to build a **playable chess game in the browser** using the **DOM**.

---

## Features

- **Native Drag & Drop** — No external UI libraries. Smooth and responsive piece movement.
- **Full move validation** — Computes legal trajectories, prevents friendly captures, and dynamically highlights valid squares.
- **Official rules** — Includes Check, Checkmate, Stalemate, and En Passant.
- **Algebraic notation** — Every move is recorded in standard chess notation.
- **PGN export** — Copy the full PGN at the end of the game to save or analyze it on any compatible platform.
- **DOM-driven state** — Pieces and their positions live in the HTML. If it's visible on screen, the code sees it the same way.
- **Responsive design** — Adapted for mobile with CSS Grid.

---

## Tech Stack

| Technology | Role |
|---|---|
| **Vite** | Bundler and development environment |
| **Vanilla JavaScript (ES6+)** | Game logic and DOM manipulation |
| **HTML5** | Board structure and native Drag & Drop API |
| **CSS3 + Grid** | Styling and responsive layout |

---

## Getting Started

```bash
git clone https://github.com/sebas-gith/chess-DOMination.git
cd chess-DOMination
npm install
npm run dev
```

---

## Assistance

The core of the project — the DOM architecture, coordinate system, and base movement logic — was built entirely by hand. In the later stages, I used AI *(Gemini)* to refine complex features without breaking the existing structure. Assistance was limited to:

- **Checkmate, and Stalemate** detection via temporary DOM simulations.
- **En Passant** implementation.
- Responsive design adjustments.
- Improving this README.

---

## Closing Thoughts

The biggest lesson from this project wasn't technical — it was architectural.

When the project was small, using the DOM as the "source of truth" felt like a fast and intuitive approach. But past the 400-line mark, adding any new feature became expensive: changing one thing broke another, and fixing one bug opened three more.

The takeaway is simple: **separating data from the view isn't an elegant formality — it's a practical necessity**. Planning your architecture before writing code is what determines whether a project scales or collapses under its own weight.