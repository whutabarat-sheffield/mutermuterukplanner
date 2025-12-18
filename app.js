// Main Application Controller
// Coordinates all modules and handles user interactions

let locationData;
let tripMap;
let optimizer;
let currentDailyPlans = null;
let currentDay = 1;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize modules
    locationData = new LocationData();
    tripMap = new TripMap('map');
    optimizer = new TripOptimizer(2, 1.5);

    // Load existing data
    const existingLocations = locationData.getAllLocations();
    if (existingLocations.length > 0) {
        updateLocationsList();
        updateMap();
    }

    // Setup event listeners
    setupEventListeners();

    // Subscribe to data changes
    locationData.subscribe(() => {
        updateLocationsList();
        updateMap();
    });

    console.log('London Trip Planner initialized!');
}

function setupEventListeners() {
    // Location form
    document.getElementById('location-form').addEventListener('submit', handleAddLocation);
    
    // Bulk import
    document.getElementById('bulk-import-btn').addEventListener('click', handleBulkImport);
    
    // Optimization
    document.getElementById('optimize-btn').addEventListener('click', handleOptimize);
    document.getElementById('max-moves').addEventListener('change', updateOptimizerParams);
    document.getElementById('max-walk').addEventListener('change', updateOptimizerParams);
    
    // Map controls
    document.getElementById('center-map').addEventListener('click', () => tripMap.centerOnLondon());
    document.getElementById('toggle-clusters').addEventListener('click', () => tripMap.toggleParkingZones());
    
    // Day tabs
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const day = parseInt(e.target.dataset.day);
            switchDay(day);
        });
    });
    
    // Export functions
    document.getElementById('export-json').addEventListener('click', () => {
        if (currentDailyPlans) {
            exportItinerary();
        } else {
            locationData.exportToJSON();
        }
    });
    
    document.getElementById('export-print').addEventListener('click', () => {
        if (currentDailyPlans) {
            printItinerary();
        }
    });
}

// Handle adding a single location
async function handleAddLocation(e) {
    e.preventDefault();
    
    const name = document.getElementById('place-name').value.trim();
    const address = document.getElementById('place-address').value.trim();
    const infantFriendly = document.getElementById('infant-friendly').checked;
    const indoor = document.getElementById('indoor').checked;
    const notes = document.getElementById('place-notes').value.trim();
    
    if (!name) return;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '🔍 Geocoding...';
    submitBtn.disabled = true;
    
    // Geocode the location
    const coords = await geocodeAddress(name, address);
    
    if (coords) {
        locationData.addLocation({
            name,
            address: address || coords.displayName,
            lat: coords.lat,
            lng: coords.lng,
            infantFriendly,
            indoor,
            notes
        });
        
        // Clear form
        e.target.reset();
        
        showNotification(`✅ Added: ${name}`, 'success');
    } else {
        showNotification(`⚠️ Could not find location: ${name}. Try adding a more specific address.`, 'warning');
    }
    
    // Restore button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

// Handle bulk import
async function handleBulkImport() {
    const textarea = document.getElementById('bulk-places');
    const text = textarea.value.trim();
    
    if (!text) return;
    
    const places = text.split('\n').filter(line => line.trim());
    
    if (places.length === 0) return;
    
    const btn = document.getElementById('bulk-import-btn');
    btn.textContent = `⏳ Importing ${places.length} places...`;
    btn.disabled = true;
    
    let successCount = 0;
    
    for (const placeName of places) {
        const name = placeName.trim();
        if (!name) continue;
        
        const coords = await geocodeAddress(name);
        
        if (coords) {
            locationData.addLocation({
                name,
                address: coords.displayName,
                lat: coords.lat,
                lng: coords.lng,
                infantFriendly: false,
                indoor: false,
                notes: ''
            });
            successCount++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    textarea.value = '';
    btn.textContent = 'Import List';
    btn.disabled = false;
    
    showNotification(`✅ Successfully imported ${successCount} of ${places.length} locations`, 'success');
}

// Update locations list display
function updateLocationsList() {
    const container = document.getElementById('locations-container');
    const locations = locationData.getAllLocations();
    
    document.getElementById('location-count').textContent = locations.length;
    
    if (locations.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#7f8c8d;padding:20px;">No locations added yet</p>';
        return;
    }
    
    container.innerHTML = locations.map(loc => `
        <div class="location-item ${loc.infantFriendly ? 'infant-friendly' : ''}" data-id="${loc.id}">
            <div class="location-info">
                <div class="location-name">${loc.name}</div>
                <div class="location-badges">
                    ${loc.infantFriendly ? '<span class="badge">👶 Infant-friendly</span>' : ''}
                    ${loc.indoor ? '<span class="badge">🏠 Indoor</span>' : ''}
                    ${!loc.lat ? '<span class="badge" style="background:#f39c12;color:white;">⚠️ No coords</span>' : ''}
                </div>
            </div>
            <div class="location-actions">
                <button class="btn-small" onclick="editLocation(${loc.id})" title="Edit">✏️</button>
                <button class="btn-small" onclick="deleteLocation(${loc.id})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Update map with all locations
function updateMap() {
    const locations = locationData.getLocationsWithCoordinates();
    tripMap.updateMarkers(locations);
}

// Delete location
function deleteLocation(id) {
    if (confirm('Delete this location?')) {
        locationData.deleteLocation(id);
        // Clear itinerary if exists
        currentDailyPlans = null;
        showItineraryEmptyState();
    }
}

// Edit location (simplified - just shows alert for now)
function editLocation(id) {
    const location = locationData.getLocation(id);
    alert(`Edit functionality coming soon!\n\nLocation: ${location.name}\nFor now, please delete and re-add to modify.`);
}

// Handle trip optimization
function handleOptimize() {
    const locations = locationData.getLocationsWithCoordinates();
    
    if (locations.length === 0) {
        showNotification('⚠️ Please add some locations first!', 'warning');
        return;
    }
    
    const btn = document.getElementById('optimize-btn');
    btn.textContent = '⚙️ Optimizing...';
    btn.disabled = true;
    
    // Run optimization
    setTimeout(() => {
        currentDailyPlans = optimizer.optimizeTrip(locations);
        
        if (currentDailyPlans) {
            displayItinerary(currentDailyPlans);
            switchDay(1);
            showNotification('✅ Itinerary optimized!', 'success');
        } else {
            showNotification('⚠️ Could not optimize itinerary', 'error');
        }
        
        btn.textContent = '🎯 Optimize Itinerary';
        btn.disabled = false;
    }, 500);
}

// Display itinerary
function displayItinerary(dailyPlans) {
    const container = document.getElementById('itinerary-content');
    
    container.innerHTML = dailyPlans.map(day => `
        <div class="day-content" data-day="${day.day}">
            <h3>${day.date} - ${day.dayName}</h3>
            <p><strong>${day.totalLocations} locations</strong> | ${day.parkingMoves} parking move${day.parkingMoves !== 1 ? 's' : ''} | ~${day.estimatedTime.hours}h ${day.estimatedTime.remainingMinutes}m</p>
            
            ${day.zones.length === 0 ? '<p style="color:#7f8c8d;margin-top:20px;">No locations scheduled for this day</p>' : ''}
            
            ${day.zones.map(zone => `
                <div class="parking-zone">
                    <h3>🅿️ Parking Zone ${zone.zoneNumber} <span style="font-size:0.9rem;font-weight:normal;color:#7f8c8d;">(${zone.totalLocations} stops)</span></h3>
                    <div class="zone-locations">
                        ${zone.locations.map((loc, idx) => `
                            <div class="zone-location ${loc.infantFriendly ? 'infant' : ''}">
                                <strong>${idx + 1}. ${loc.name}</strong>
                                ${loc.infantFriendly ? ' 👶' : ''}
                                ${loc.indoor ? ' 🏠' : ''}
                                ${loc.notes ? `<br><small>${loc.notes}</small>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <div class="zone-info">
                        📏 Walking radius: ${zone.walkingRadius.toFixed(2)} km
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
    
    // Show summary
    const summary = optimizer.generateSummary(dailyPlans);
    console.log('Trip Summary:', summary);
}

// Show empty state for itinerary
function showItineraryEmptyState() {
    document.getElementById('itinerary-content').innerHTML = `
        <div class="empty-state">
            <p>Add locations and click "Optimize Itinerary" to generate your trip plan.</p>
        </div>
    `;
}

// Switch between days
function switchDay(dayNumber) {
    currentDay = dayNumber;
    
    // Update tabs
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.dataset.day) === dayNumber);
    });
    
    // Update content
    document.querySelectorAll('.day-content').forEach(content => {
        content.classList.toggle('active', parseInt(content.dataset.day) === dayNumber);
    });
    
    // Update map visualization
    if (currentDailyPlans) {
        const dayPlan = currentDailyPlans.find(d => d.day === dayNumber);
        if (dayPlan) {
            tripMap.visualizeDayItinerary(dayPlan, dayNumber);
        }
    }
}

// Update optimizer parameters
function updateOptimizerParams() {
    const maxMoves = parseInt(document.getElementById('max-moves').value);
    const maxWalk = parseFloat(document.getElementById('max-walk').value);
    optimizer.updateParameters(maxMoves, maxWalk);
}

// Export itinerary
function exportItinerary() {
    const exportData = {
        generated: new Date().toISOString(),
        tripDates: 'December 24-29, 2025',
        settings: {
            maxParkingMovesPerDay: optimizer.maxMovesPerDay,
            maxWalkingDistance: optimizer.maxWalkingDistance
        },
        itinerary: currentDailyPlans,
        locations: locationData.getAllLocations()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportName = `london-trip-itinerary-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
    
    showNotification('✅ Itinerary exported!', 'success');
}

// Print itinerary
function printItinerary() {
    window.print();
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple console notification for now
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Could be enhanced with a toast notification system
    alert(message);
}

// Make functions globally accessible
window.deleteLocation = deleteLocation;
window.editLocation = editLocation;
