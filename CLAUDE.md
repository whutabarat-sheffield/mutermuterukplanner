# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

London Christmas Trip Planner - a client-side web application for planning a multi-day London trip (December 24-29, 2025). The primary goal is minimizing parking moves while maximizing sightseeing efficiency, with considerations for infant-friendly locations and Christmas opening hours.

## Running the Application

No build process required. Open `index.html` directly in a browser or serve via:
```bash
python -m http.server 8000
# or
npx http-server
```

## Architecture

Four JavaScript modules with global scope (no bundler):

- **app.js** - Main controller coordinating UI, form handling, and module orchestration. Initializes `LocationData`, `TripMap`, and `TripOptimizer` on DOMContentLoaded.

- **data.js** - `LocationData` class for CRUD operations with localStorage persistence. Contains `geocodeAddress()` (Nominatim API with 1-second rate limit), `calculateDistance()` (Haversine formula), and `createDistanceMatrix()`.

- **map.js** - `TripMap` class wrapping Leaflet.js. Handles markers, parking zone circles, and route visualization.

- **optimizer.js** - `TripOptimizer` class implementing hierarchical clustering. Algorithm: 1) Build distance matrix, 2) Cluster by walking distance, 3) Distribute clusters to 6 days respecting `maxMovesPerDay`, 4) Order locations within zones via nearest-neighbor.

## Key Optimization Priorities

1. Minimize parking location changes (highest priority)
2. Time efficiency within zones
3. Cover all locations

## External Dependencies

- Leaflet.js 1.9.4 (CDN) - mapping
- OpenStreetMap - tiles and Nominatim geocoding API
