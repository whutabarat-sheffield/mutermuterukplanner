# 🎄 London Christmas Trip Planner

An interactive web application for planning and optimizing a multi-day trip to London during the Christmas period (December 24-29, 2025). Designed to minimize parking moves while maximizing sightseeing efficiency, with special considerations for infant-friendly locations and weather conditions.

![London Trip Planner](https://img.shields.io/badge/Status-Ready-green) ![No Dependencies](https://img.shields.io/badge/Dependencies-None-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎯 Core Functionality
- **Parking Optimization**: Minimizes the number of parking location changes (Priority #1)
- **Interactive Map**: Visualize all locations using Leaflet.js and OpenStreetMap
- **Smart Clustering**: Groups nearby locations into walking-distance zones
- **Day-by-Day Planning**: Distributes locations across 6 days optimally
- **Route Optimization**: Orders locations within each parking zone efficiently

### 👶 Family-Friendly
- Mark infant-friendly locations
- Identify indoor venues (weather-proof)
- Visual indicators on map and itinerary

### 📍 Location Management
- Add locations individually with detailed info
- Bulk import from text list
- Automatic geocoding (address lookup)
- Edit and delete locations
- Persistent storage (localStorage)

### 📅 Itinerary Features
- Visual day tabs for easy navigation
- Parking zone visualization with radius circles
- Time estimates per day
- Walking distance calculations
- Export to JSON
- Print-friendly view

### 🎨 User Experience
- Responsive design (mobile & desktop)
- Real-time map updates
- Color-coded parking zones
- Christmas-themed styling

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or build process required!

### Quick Start

1. **Clone or download** this repository:
   ```bash
   git clone <repository-url>
   cd mutermuterukplanner
   ```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (with http-server)
     npx http-server
     ```

3. **Access the app**:
   - Direct: Open `index.html` in browser
   - Server: Navigate to `http://localhost:8000`

## 📖 How to Use

### Step 1: Add Your Locations

**Single Location:**
1. Fill in the place name (required)
2. Optionally add address for better accuracy
3. Check boxes for infant-friendly/indoor if applicable
4. Add notes (opening hours, parking info, etc.)
5. Click "Add Location"

**Bulk Import:**
1. Paste a list of place names (one per line) in the text area
2. Click "Import List"
3. Wait for automatic geocoding (1 second delay per location)

**Example places to try:**
```
British Museum
Tower of London
Natural History Museum
Covent Garden
Sky Garden
Borough Market
Churchill War Rooms
Somerset House
```

### Step 2: Configure Optimization Settings

- **Max parking moves per day**: How many times you're willing to move your car (default: 2)
- **Average walking distance**: Maximum radius you're comfortable walking from parking (default: 1.5 km)

### Step 3: Optimize Your Trip

1. Click the "🎯 Optimize Itinerary" button
2. The algorithm will:
   - Cluster nearby locations
   - Minimize parking moves
   - Balance locations across 6 days
   - Order visits efficiently within each zone

### Step 4: Review Your Itinerary

1. Use day tabs to view each day's plan
2. See parking zones on the map (color-coded circles)
3. Review time estimates and walking distances
4. Toggle parking zone visibility with the 🅿️ button

### Step 5: Export & Use

- **Export JSON**: Save your itinerary and locations
- **Print View**: Generate a printer-friendly version

## 🏗️ Project Structure

```
mutermuterukplanner/
├── index.html          # Main application page
├── styles.css          # All styling
├── app.js              # Main controller & UI logic
├── map.js              # Leaflet map functionality
├── optimizer.js        # Optimization algorithms
├── data.js             # Data management & geocoding
├── .github/
│   └── copilot-instructions.md  # Project context for GitHub Copilot
└── README.md           # This file
```

## 🧮 Optimization Algorithm

The trip planner uses a **hierarchical clustering algorithm** with these steps:

1. **Distance Matrix**: Calculate distances between all locations
2. **Clustering**: Group locations within walking distance
3. **Constraint Checking**: Ensure clusters don't exceed max walking radius
4. **Day Distribution**: Balance locations across 6 days
5. **Zone Ordering**: Optimize visit order within each parking zone (nearest neighbor)
6. **Time Estimation**: Calculate estimated time per day

**Priorities:**
1. 🥇 Minimize parking moves
2. 🥈 Time efficiency
3. 🥉 Visit all locations

## 🎨 Customization

### Modify Date Range
Edit the `numDays` and date information in [optimizer.js](optimizer.js#L8):

```javascript
this.numDays = 6; // Change number of days

// Update date labels in distributeToDays method
const daysInfo = [
    { date: 'Your Date 1', day: 'Day Label 1' },
    // ... add more days
];
```

### Adjust Map Center
Change London center in [map.js](map.js#L6):

```javascript
this.map = L.map(mapElementId).setView([lat, lng], zoomLevel);
```

### Change Color Scheme
Edit CSS variables in [styles.css](styles.css#L8):

```css
:root {
    --primary: #2c5f8d;    /* Main color */
    --secondary: #c41e3a;  /* Accent color */
    /* ... */
}
```

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Structure
- **CSS3**: Styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks required
- **Leaflet.js 1.9.4**: Interactive maps
- **OpenStreetMap**: Map tiles and geocoding (Nominatim API)

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

### Data Storage
- **LocalStorage**: Locations persist in browser
- **No backend**: Fully client-side application
- **Privacy**: All data stays on your device

### API Usage
- **Nominatim Geocoding**: Free OpenStreetMap geocoding service
- **Rate Limit**: 1 request per second (automatically enforced)
- **No API key required**

## 🎄 Christmas-Specific Features

- **Opening Hours Tracking**: Add notes about Christmas/Boxing Day hours
- **Weather Considerations**: Mark indoor venues for bad weather
- **Infant-Friendly**: Flag family-appropriate venues
- **Special Days**: Labels for Christmas Eve, Christmas Day, Boxing Day

## 🐛 Troubleshooting

**Locations not showing on map?**
- Check browser console for errors
- Ensure location names are specific enough
- Try adding the full address
- Check internet connection (needed for geocoding)

**Geocoding fails?**
- Wait a few seconds between bulk imports
- Use more specific names (e.g., "British Museum, London" vs "Museum")
- Manually add address in the address field

**Optimization not working?**
- Ensure at least 2-3 locations have coordinates
- Check max walking distance isn't too restrictive
- Try adjusting max parking moves per day

**Map not loading?**
- Check internet connection (map tiles load from OpenStreetMap)
- Disable browser extensions that might block map requests
- Check browser console for CORS or network errors

## 📝 Example Itinerary

After adding popular London locations, you might get:

**Day 1 (Christmas Eve):**
- Parking Zone 1: British Museum, Covent Garden, Somerset House
- Walking radius: 1.2 km

**Day 2 (Christmas):**
- Most attractions closed - plan rest day or walking tour

**Day 3 (Boxing Day):**
- Parking Zone 1: Tower of London, Borough Market
- Parking Zone 2: Natural History Museum, V&A Museum

## 🤝 Contributing

Feel free to fork this project and customize it for your needs! Some ideas:
- Add real-time traffic data (requires Google Maps API)
- Implement drag-and-drop itinerary reordering
- Add weather forecast integration
- Create shareable itinerary links
- Add restaurant recommendations near parking zones

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Leaflet.js**: Excellent mapping library
- **OpenStreetMap**: Free map data and geocoding
- **Nominatim**: Geocoding API

## 📧 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Ensure you're using a modern browser
4. Try clearing localStorage: `localStorage.clear()`

---

**Happy Planning! 🎄🎅🇬🇧**

Enjoy your London Christmas adventure with optimized parking and efficient routes!
