// Map Module - Handles all map-related functionality using Leaflet

class TripMap {
    constructor(mapElementId) {
        // Initialize map centered on London
        this.map = L.map(mapElementId).setView([51.5074, -0.1278], 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        this.markers = [];
        this.parkingZones = [];
        this.routeLines = [];
        this.showClusters = false;
        
        // Custom icons
        this.icons = {
            default: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background:#2c5f8d;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);">📍</div>',
                iconSize: [30, 30]
            }),
            infant: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background:#27ae60;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);">👶</div>',
                iconSize: [30, 30]
            }),
            parking: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background:#c41e3a;color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-weight:bold;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.4);font-size:20px;">🅿️</div>',
                iconSize: [40, 40]
            })
        };
    }

    // Add a location marker
    addMarker(location) {
        if (!location.lat || !location.lng) return null;
        
        const icon = location.infantFriendly ? this.icons.infant : this.icons.default;
        
        const marker = L.marker([location.lat, location.lng], { icon })
            .addTo(this.map);
        
        // Create popup content
        const popupContent = `
            <div class="popup-title">${location.name}</div>
            <div class="popup-info">
                ${location.address ? `📍 ${location.address}<br>` : ''}
                ${location.infantFriendly ? '👶 Infant-friendly<br>' : ''}
                ${location.indoor ? '🏠 Indoor<br>' : ''}
                ${location.notes ? `📝 ${location.notes}` : ''}
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        this.markers.push({
            marker,
            locationId: location.id,
            location
        });
        
        return marker;
    }

    // Remove a specific marker
    removeMarker(locationId) {
        const index = this.markers.findIndex(m => m.locationId === locationId);
        if (index !== -1) {
            this.map.removeLayer(this.markers[index].marker);
            this.markers.splice(index, 1);
        }
    }

    // Clear all markers
    clearMarkers() {
        this.markers.forEach(m => this.map.removeLayer(m.marker));
        this.markers = [];
    }

    // Update all markers from location data
    updateMarkers(locations) {
        this.clearMarkers();
        locations.forEach(location => {
            if (location.lat && location.lng) {
                this.addMarker(location);
            }
        });
        
        // Fit bounds if there are markers
        if (this.markers.length > 0) {
            const bounds = L.latLngBounds(
                this.markers.map(m => m.marker.getLatLng())
            );
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    // Add parking zone visualization
    addParkingZone(center, radius, zoneNumber, locations) {
        // Draw circle for walking radius
        const circle = L.circle([center.lat, center.lng], {
            color: '#c41e3a',
            fillColor: '#c41e3a',
            fillOpacity: 0.1,
            radius: radius * 1000, // convert km to meters
            weight: 2,
            dashArray: '5, 5'
        }).addTo(this.map);
        
        // Add parking marker at center
        const parkingMarker = L.marker([center.lat, center.lng], {
            icon: this.icons.parking
        }).addTo(this.map);
        
        const popupContent = `
            <div class="popup-title">🅿️ Parking Zone ${zoneNumber}</div>
            <div class="popup-info">
                <strong>${locations.length} locations</strong><br>
                ${locations.map(loc => `• ${loc.name}`).join('<br>')}
            </div>
        `;
        
        parkingMarker.bindPopup(popupContent);
        
        this.parkingZones.push({ circle, marker: parkingMarker });
    }

    // Clear parking zones
    clearParkingZones() {
        this.parkingZones.forEach(zone => {
            this.map.removeLayer(zone.circle);
            this.map.removeLayer(zone.marker);
        });
        this.parkingZones = [];
    }

    // Draw route between locations
    drawRoute(locations, color = '#2c5f8d') {
        if (locations.length < 2) return;
        
        const points = locations
            .filter(loc => loc.lat && loc.lng)
            .map(loc => [loc.lat, loc.lng]);
        
        const polyline = L.polyline(points, {
            color: color,
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 5'
        }).addTo(this.map);
        
        this.routeLines.push(polyline);
    }

    // Clear all routes
    clearRoutes() {
        this.routeLines.forEach(line => this.map.removeLayer(line));
        this.routeLines = [];
    }

    // Center map on London
    centerOnLondon() {
        this.map.setView([51.5074, -0.1278], 12);
    }

    // Toggle parking zones visibility
    toggleParkingZones() {
        this.showClusters = !this.showClusters;
        
        if (this.showClusters) {
            // Show parking zones
            this.parkingZones.forEach(zone => {
                zone.circle.addTo(this.map);
                zone.marker.addTo(this.map);
            });
        } else {
            // Hide parking zones
            this.parkingZones.forEach(zone => {
                this.map.removeLayer(zone.circle);
                this.map.removeLayer(zone.marker);
            });
        }
    }

    // Visualize day itinerary
    visualizeDayItinerary(dayPlan, dayNumber) {
        this.clearRoutes();
        this.clearParkingZones();
        
        if (!dayPlan || !dayPlan.zones) return;
        
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        
        dayPlan.zones.forEach((zone, index) => {
            // Add parking zone
            if (zone.parking && zone.locations.length > 0) {
                this.addParkingZone(
                    zone.parking,
                    zone.walkingRadius || 1.5,
                    index + 1,
                    zone.locations
                );
            }
            
            // Draw route through locations in this zone
            this.drawRoute(zone.locations, colors[index % colors.length]);
        });
        
        // Show clusters by default when visualizing
        this.showClusters = true;
    }

    // Get map bounds
    getBounds() {
        return this.map.getBounds();
    }

    // Fit to bounds
    fitBounds(bounds, options = {}) {
        this.map.fitBounds(bounds, options);
    }
}
