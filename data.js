// Data Management Module
// Handles location storage and retrieval

class LocationData {
    constructor() {
        this.locations = this.loadFromStorage() || [];
        this.listeners = [];
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
