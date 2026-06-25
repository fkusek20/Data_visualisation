# Data Visualisation — Interactive React + D3.js Dashboard

An interactive data visualisation application built with **React 19** and **D3.js v7** as part of a university individual assignment in the Data Visualisation course at the University of Luxembourg.

The application ingests structured CSV data using **PapaParse**, processes it in JavaScript, and renders a set of interactive D3.js charts embedded in a React single-page application.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Visualisation | D3.js v7 |
| CSV parsing | PapaParse 5 |
| Build tooling | Create React App / react-scripts |
| Testing | React Testing Library + Jest |
| Language | JavaScript (ES6+) |

---

## Features

- **CSV data ingestion** — PapaParse parses and streams structured CSV data into React state
- **Interactive D3 charts** — SVG-based charts rendered with D3, integrated cleanly with the React component lifecycle using `useEffect` and `useRef`
- **Dynamic filtering** — chart views respond to user interactions and state changes
- **Component-based architecture** — separate components for data loading, chart rendering, and UI controls
- **Responsive layout** — charts adapt to container dimensions

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
git clone https://github.com/fkusek20/Data_visualisation.git
cd Data_visualisation
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
```

Output is in the `build/` directory.

### Run tests

```bash
npm test
```

---

## Project Structure

```
src/
├── components/     # Reusable React components (charts, controls)
├── data/           # CSV data files and PapaParse loading utilities
├── App.js          # Root component and layout
└── index.js        # Entry point
public/
└── index.html
```

---

## Key Implementation Notes

**D3 + React integration** — D3 handles all SVG rendering and scales; React manages state, component lifecycle, and re-renders. D3's DOM mutations are scoped to a `ref`-attached element inside a `useEffect` to avoid conflicts with React's virtual DOM.

**Data pipeline** — CSV files are parsed client-side by PapaParse on component mount. Parsed rows are stored in React state and passed as props to chart components.

**Scales and axes** — D3 linear, ordinal, and time scales are recalculated on data or container-size change to keep charts correct on update.

---

## Assignment Context

This project was submitted as an individual assignment for the Data Visualisation course. The full assignment report (`Individual_Assignment_Report_Franco_Kusek.pdf`) and the original instructions (`IndividualAssignmentInstructions.pdf`) are included in the repository.

---

## Author

**Franco Kušek**
[github.com/fkusek20](https://github.com/fkusek20) · [linkedin.com/in/franco-kusek](https://www.linkedin.com/in/franco-ku%C5%A1ek)
