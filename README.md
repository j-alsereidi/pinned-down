# PINNED DOWN

This is a playable prototype built using Vite, React, and TailwindCSS. You can play it at [https://pinned-down.onrender.com/](https://pinned-down.onrender.com/) or run it yourself with the instructions below.

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/j-alsereidi/pinned-down
   ```

2. Navigate to the project directory:
   ```bash
   cd pinned-down
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Provide a Google Maps API key
   Rename .env.example to .env and add your API key to it

### Running the Development Server

To start the development server, run:
```bash
npm run dev
```
This will start the Vite development server. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

### Building for Production

To build the project for production, run:
```bash
npm run build
```
The production-ready files will be generated in the `dist` directory.

### Previewing the Production Build

To preview the production build locally, run:
```bash
npm run preview
```
This will start a local server to serve the production build.
