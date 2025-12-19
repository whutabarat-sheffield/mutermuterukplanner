// Data Management Module
// Handles location storage and retrieval

// Default trip locations from task_context.md
const DEFAULT_LOCATIONS = [
    { id: 1, name: "Buckingham Palace", lat: 51.5014, lng: -0.1419, infantFriendly: true, indoor: false, notes: "Changing of Guard 30 Dec at 11:00 - arrive 45min early" },
    { id: 2, name: "British Museum", lat: 51.5194, lng: -0.1270, infantFriendly: true, indoor: true, notes: "Closed 25 Dec. Free entry." },
    { id: 3, name: "Covent Garden", lat: 51.5117, lng: -0.1240, infantFriendly: true, indoor: false, notes: "Christmas market. Scheduled 24 Dec." },
    { id: 4, name: "Winter Lights", lat: 51.5100, lng: -0.1350, infantFriendly: true, indoor: false, notes: "Best after dark. Scheduled 24 Dec." },
    { id: 5, name: "Tower of London", lat: 51.5081, lng: -0.0759, infantFriendly: true, indoor: true, notes: "Closed 25-26 Dec. Book 29 Dec 09:30. 3hrs visit." },
    { id: 6, name: "Tower Bridge", lat: 51.5055, lng: -0.0754, infantFriendly: true, indoor: false, notes: "300m from Tower of London - visit together" },
    { id: 7, name: "Borough Market", lat: 51.5055, lng: -0.0910, infantFriendly: true, indoor: false, notes: "Closed Sun & 25 Dec. Opens 10:00. Scheduled 26 Dec." },
    { id: 8, name: "South Bank", lat: 51.5055, lng: -0.1150, infantFriendly: true, indoor: false, notes: "Thames walk. Scheduled 25 Dec." },
    { id: 9, name: "National Gallery", lat: 51.5089, lng: -0.1283, infantFriendly: true, indoor: true, notes: "Closed 25-26 Dec. Free entry. Scheduled 30 Dec." },
    { id: 10, name: "Trafalgar Square", lat: 51.5080, lng: -0.1281, infantFriendly: true, indoor: false, notes: "Near National Gallery" },
    { id: 11, name: "West End Musical", lat: 51.5115, lng: -0.1280, infantFriendly: false, indoor: true, notes: "26 Dec 19:30. 5 tickets - infant cannot attend." },
    { id: 12, name: "Soho", lat: 51.5137, lng: -0.1337, infantFriendly: true, indoor: false, notes: "Explore + early dinner. Scheduled 26 Dec." },
    { id: 13, name: "Snow Centre", lat: 51.7520, lng: -0.4690, infantFriendly: false, indoor: true, notes: "Hemel Hempstead. 27 Dec 11:00. 5 people ski - infant cannot." },
    { id: 14, name: "Westminster Abbey", lat: 51.4994, lng: -0.1273, infantFriendly: true, indoor: true, notes: "Closed 25 Dec. Book 26 Dec 13:00." },
    { id: 15, name: "London Eye", lat: 51.5033, lng: -0.1195, infantFriendly: true, indoor: false, notes: "Book 29 Dec 16:30 for sunset views." },
    { id: 16, name: "Shoreditch", lat: 51.5255, lng: -0.0795, infantFriendly: true, indoor: false, notes: "Optional 30 Dec. Tube access." },
    { id: 17, name: "Hyde Park", lat: 51.5073, lng: -0.1657, infantFriendly: true, indoor: false, notes: "Walk to Winter Wonderland. Scheduled 28 Dec." },
    { id: 18, name: "Harrods", lat: 51.4994, lng: -0.1633, infantFriendly: true, indoor: true, notes: "Better hours on Saturday. Scheduled 28 Dec." },
    { id: 19, name: "Winter Wonderland", lat: 51.5073, lng: -0.1600, infantFriendly: true, indoor: false, notes: "Hyde Park. Book 28 Dec 14:00. Very crowded." },
    { id: 20, name: "Notting Hill + Portobello Road", lat: 51.5170, lng: -0.2050, infantFriendly: true, indoor: false, notes: "Saturday is best (full market). Closed Sunday. 28 Dec." },
    { id: 21, name: "Oxford Street / Primark", lat: 51.5152, lng: -0.1418, infantFriendly: true, indoor: true, notes: "Buy warm clothes. Scheduled 24 Dec." },
    { id: 22, name: "Chinatown", lat: 51.5114, lng: -0.1315, infantFriendly: true, indoor: false, notes: "Lunch option. Open Christmas Day." }
];

class LocationData {
    constructor() {
        const stored = this.loadFromStorage();
        // Load defaults if no stored data
        this.locations = stored && stored.length > 0 ? stored : this.getDefaultLocations();
        this.listeners = [];

        // Save defaults if we just loaded them
        if (!stored || stored.length === 0) {
            this.saveToStorage();
        }
    }

    // Get default locations with unique IDs
    getDefaultLocations() {
        const now = Date.now();
        return DEFAULT_LOCATIONS.map((loc, index) => ({
            ...loc,
            id: now + index,
            address: '',
            christmasHours: '',
            addedAt: new Date().toISOString()
        }));
    }

    // Add a new location
    addLocation(location) {
        const newLocation = {
            id: Date.now(),
            name: location.name,
            address: location.address || '',
            lat: location.lat || null,
            lng: location.lng || null,
            infantFriendly: location.infantFriendly || false,
            indoor: location.indoor || false,
            notes: location.notes || '',
            christmasHours: location.christmasHours || '',
            addedAt: new Date().toISOString()
        };
        
        this.locations.push(newLocation);
        this.saveToStorage();
        this.notifyListeners();
        return newLocation;
    }

    // Update an existing location
    updateLocation(id, updates) {
        const index = this.locations.findIndex(loc => loc.id === id);
        if (index !== -1) {
            this.locations[index] = { ...this.locations[index], ...updates };
            this.saveToStorage();
            this.notifyListeners();
            return this.locations[index];
        }
        return null;
    }

    // Delete a location
    deleteLocation(id) {
        const index = this.locations.findIndex(loc => loc.id === id);
        if (index !== -1) {
            this.locations.splice(index, 1);
            this.saveToStorage();
            this.notifyListeners();
            return true;
        }
        return false;
    }

    // Get all locations
    getAllLocations() {
        return [...this.locations];
    }

    // Get location by ID
    getLocation(id) {
        return this.locations.find(loc => loc.id === id);
    }

    // Get locations with coordinates
    getLocationsWithCoordinates() {
        return this.locations.filter(loc => loc.lat !== null && loc.lng !== null);
    }

    // Clear all locations
    clearAll() {
        if (confirm('Are you sure you want to delete all locations?')) {
            this.locations = [];
            this.saveToStorage();
            this.notifyListeners();
        }
    }

    // Subscribe to changes
    subscribe(callback) {
        this.listeners.push(callback);
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.locations));
    }

    // Save to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('londonTripLocations', JSON.stringify(this.locations));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    // Load from localStorage
    loadFromStorage() {
        try {
            const data = localStorage.getItem('londonTripLocations');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    }

    // Export to JSON
    exportToJSON() {
        const dataStr = JSON.stringify(this.locations, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportName = `london-trip-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
    }

    // Import from JSON
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (Array.isArray(data)) {
                this.locations = data;
                this.saveToStorage();
                this.notifyListeners();
                return true;
            }
        } catch (e) {
            console.error('Failed to import JSON:', e);
            return false;
        }
    }
}

// Geocoding helper using Nominatim (OpenStreetMap)
async function geocodeAddress(placeName, address = '') {
    const query = address || placeName;
    const searchQuery = `${query}, London, UK`;
    
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(searchQuery)}` +
            `&format=json` +
            `&limit=1` +
            `&bounded=1` +
            `&viewbox=-0.5103,51.6919,0.3340,51.2868` // London bounding box
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

// Create distance matrix for all locations
function createDistanceMatrix(locations) {
    const n = locations.length;
    const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const dist = calculateDistance(
                locations[i].lat, locations[i].lng,
                locations[j].lat, locations[j].lng
            );
            matrix[i][j] = dist;
            matrix[j][i] = dist;
        }
    }
    
    return matrix;
}
