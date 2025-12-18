// Trip Optimizer Module
// Implements algorithms to minimize parking moves and optimize routes

class TripOptimizer {
    constructor(maxMovesPerDay = 2, maxWalkingDistance = 1.5) {
        this.maxMovesPerDay = maxMovesPerDay;
        this.maxWalkingDistance = maxWalkingDistance; // km
        this.numDays = 6;
    }

    // Main optimization function
    optimizeTrip(locations) {
        if (!locations || locations.length === 0) {
            return null;
        }

        // Filter locations with coordinates
        const validLocations = locations.filter(loc => loc.lat && loc.lng);
        
        if (validLocations.length === 0) {
            return null;
        }

        // Create distance matrix
        const distanceMatrix = createDistanceMatrix(validLocations);
        
        // Cluster locations into parking zones
        const clusters = this.clusterByDistance(validLocations, distanceMatrix);
        
        // Distribute zones across days
        const dailyPlans = this.distributeToDays(clusters, validLocations);
        
        return dailyPlans;
    }

    // Cluster locations based on walking distance using hierarchical clustering
    clusterByDistance(locations, distanceMatrix) {
        const n = locations.length;
        const clusters = locations.map((loc, i) => ({
            locations: [loc],
            indices: [i],
            center: { lat: loc.lat, lng: loc.lng }
        }));

        while (clusters.length > this.numDays * this.maxMovesPerDay) {
            let minDist = Infinity;
            let mergeI = -1, mergeJ = -1;

            // Find closest pair of clusters
            for (let i = 0; i < clusters.length; i++) {
                for (let j = i + 1; j < clusters.length; j++) {
                    const dist = this.clusterDistance(clusters[i], clusters[j], distanceMatrix);
                    if (dist < minDist) {
                        minDist = dist;
                        mergeI = i;
                        mergeJ = j;
                    }
                }
            }

            // Check if merging would exceed walking distance
            if (minDist > this.maxWalkingDistance * 2) {
                break;
            }

            // Merge clusters
            if (mergeI !== -1 && mergeJ !== -1) {
                clusters[mergeI].locations.push(...clusters[mergeJ].locations);
                clusters[mergeI].indices.push(...clusters[mergeJ].indices);
                clusters[mergeI].center = this.calculateCentroid(clusters[mergeI].locations);
                clusters.splice(mergeJ, 1);
            } else {
                break;
            }
        }

        return clusters;
    }

    // Calculate distance between two clusters
    clusterDistance(cluster1, cluster2, distanceMatrix) {
        let totalDist = 0;
        let count = 0;

        for (const i of cluster1.indices) {
            for (const j of cluster2.indices) {
                totalDist += distanceMatrix[i][j];
                count++;
            }
        }

        return count > 0 ? totalDist / count : Infinity;
    }

    // Calculate centroid of a cluster
    calculateCentroid(locations) {
        const n = locations.length;
        const sumLat = locations.reduce((sum, loc) => sum + loc.lat, 0);
        const sumLng = locations.reduce((sum, loc) => sum + loc.lng, 0);
        
        return {
            lat: sumLat / n,
            lng: sumLng / n
        };
    }

    // Distribute clusters to days
    distributeToDays(clusters, allLocations) {
        const dailyPlans = [];
        const daysInfo = [
            { date: 'Tuesday, Dec 24', day: 'Christmas Eve' },
            { date: 'Wednesday, Dec 25', day: 'Christmas Day' },
            { date: 'Thursday, Dec 26', day: 'Boxing Day' },
            { date: 'Friday, Dec 27', day: 'Day 4' },
            { date: 'Saturday, Dec 28', day: 'Day 5' },
            { date: 'Sunday, Dec 29', day: 'Day 6' }
        ];

        // Sort clusters by size (descending)
        clusters.sort((a, b) => b.locations.length - a.locations.length);

        // Distribute clusters to days trying to balance
        const daysAssignment = Array(this.numDays).fill(null).map(() => []);
        const daysCounts = Array(this.numDays).fill(0);

        for (const cluster of clusters) {
            // Find day with minimum locations
            let minDay = 0;
            let minCount = daysCounts[0];
            
            for (let d = 1; d < this.numDays; d++) {
                if (daysCounts[d] < minCount || 
                    (daysCounts[d] === minCount && daysAssignment[d].length < this.maxMovesPerDay)) {
                    minCount = daysCounts[d];
                    minDay = d;
                }
            }

            // Check if day can accommodate another parking zone
            if (daysAssignment[minDay].length < this.maxMovesPerDay) {
                daysAssignment[minDay].push(cluster);
                daysCounts[minDay] += cluster.locations.length;
            } else {
                // Find day with space
                let assigned = false;
                for (let d = 0; d < this.numDays; d++) {
                    if (daysAssignment[d].length < this.maxMovesPerDay) {
                        daysAssignment[d].push(cluster);
                        daysCounts[d] += cluster.locations.length;
                        assigned = true;
                        break;
                    }
                }
                
                // If no space, add to day with fewest zones
                if (!assigned) {
                    let minZones = daysAssignment[0].length;
                    let targetDay = 0;
                    for (let d = 1; d < this.numDays; d++) {
                        if (daysAssignment[d].length < minZones) {
                            minZones = daysAssignment[d].length;
                            targetDay = d;
                        }
                    }
                    daysAssignment[targetDay].push(cluster);
                    daysCounts[targetDay] += cluster.locations.length;
                }
            }
        }

        // Create daily plan objects
        for (let day = 0; day < this.numDays; day++) {
            const zones = daysAssignment[day].map((cluster, zoneIndex) => {
                // Order locations within zone to minimize walking
                const orderedLocations = this.orderLocationsInZone(cluster.locations);
                
                return {
                    zoneNumber: zoneIndex + 1,
                    parking: cluster.center,
                    locations: orderedLocations,
                    walkingRadius: this.calculateMaxRadius(cluster.center, orderedLocations),
                    totalLocations: orderedLocations.length
                };
            });

            dailyPlans.push({
                day: day + 1,
                date: daysInfo[day].date,
                dayName: daysInfo[day].day,
                zones: zones,
                totalLocations: daysCounts[day],
                parkingMoves: zones.length,
                estimatedTime: this.estimateTimeForDay(zones)
            });
        }

        return dailyPlans;
    }

    // Order locations within a zone to minimize walking distance (nearest neighbor)
    orderLocationsInZone(locations) {
        if (locations.length <= 1) return locations;

        const ordered = [locations[0]];
        const remaining = [...locations.slice(1)];

        while (remaining.length > 0) {
            const current = ordered[ordered.length - 1];
            let nearest = 0;
            let minDist = calculateDistance(
                current.lat, current.lng,
                remaining[0].lat, remaining[0].lng
            );

            for (let i = 1; i < remaining.length; i++) {
                const dist = calculateDistance(
                    current.lat, current.lng,
                    remaining[i].lat, remaining[i].lng
                );
                if (dist < minDist) {
                    minDist = dist;
                    nearest = i;
                }
            }

            ordered.push(remaining[nearest]);
            remaining.splice(nearest, 1);
        }

        return ordered;
    }

    // Calculate maximum radius from center to any location
    calculateMaxRadius(center, locations) {
        let maxDist = 0;
        for (const loc of locations) {
            const dist = calculateDistance(center.lat, center.lng, loc.lat, loc.lng);
            if (dist > maxDist) {
                maxDist = dist;
            }
        }
        return maxDist;
    }

    // Estimate time needed for a day
    estimateTimeForDay(zones) {
        let totalTime = 0;
        
        for (const zone of zones) {
            // 30 min per location + 15 min walking between locations
            totalTime += zone.locations.length * 30;
            totalTime += (zone.locations.length - 1) * 15;
            
            // Add parking time (10 min per move)
            totalTime += 10;
        }
        
        // Add travel time between zones (20 min per move)
        if (zones.length > 1) {
            totalTime += (zones.length - 1) * 20;
        }
        
        return {
            minutes: totalTime,
            hours: Math.floor(totalTime / 60),
            remainingMinutes: totalTime % 60
        };
    }

    // Generate summary statistics
    generateSummary(dailyPlans) {
        const totalLocations = dailyPlans.reduce((sum, day) => sum + day.totalLocations, 0);
        const totalParkingMoves = dailyPlans.reduce((sum, day) => sum + day.parkingMoves, 0);
        const avgMovesPerDay = totalParkingMoves / this.numDays;
        
        return {
            totalLocations,
            totalParkingMoves,
            avgMovesPerDay: avgMovesPerDay.toFixed(1),
            daysUsed: dailyPlans.filter(day => day.totalLocations > 0).length
        };
    }

    // Update optimization parameters
    updateParameters(maxMoves, maxWalk) {
        this.maxMovesPerDay = maxMoves;
        this.maxWalkingDistance = maxWalk;
    }
}
