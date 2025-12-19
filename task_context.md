# London Trip Planning: Complete Context for Further Analysis

## Changelog

### 2025-12-19: Accommodation Location Update
**Agent**: Claude Code (Opus 4.5)
**Change**: Base location updated from Colindale NW9 to Staybridge Suites Heathrow

**New Accommodation**:
- **Hotel**: Staybridge Suites London - Heathrow Bath Road by IHG
- **Address**: 276A Bath Rd, Sipson, West Drayton UB7 0DQ
- **Coordinates**: (51.4819, -0.4474)
- **Distance to Heathrow terminals**: 1.3 miles (~5 min)

**Impact on Trip**:
- **Dec 24 (Arrival)**: MAJOR IMPROVEMENT - Hotel is at Heathrow, no 45-min drive after long flight
- **All other days**: Longer drives to central/east London (adds ~10-15 min vs Colindale)
- **Dec 28 (West London)**: Slightly closer to Notting Hill/Hyde Park area
- **Dec 29 (Tower of London)**: Longest drive now 19 miles vs 12 miles from Colindale

**Route optimization still valid** - geographic clustering unchanged, just different starting point.

---

### 2025-12-18: Route Optimization & Corrections
**Agent**: Claude Code (Opus 4.5)
**Reviewed by**: User confirmed approach

**Changes Made**:
1. **Date correction**: 2024 → 2025 throughout document
2. **ULEZ removed**: Vehicle confirmed ULEZ-compliant, all ULEZ costs removed
3. **Dec 26/28/29 routes redesigned** to eliminate cross-London zigzag:
   - Original Dec 28 route: Tower of London (east) → Notting Hill (west) → London Eye (south) = ~15 miles unnecessary driving
   - New approach clusters geographically:
     - Dec 26: East London morning (Borough Market + Tower Bridge), then Westminster/West End
     - Dec 28: Pure West London day (Portobello → Hyde Park → Winter Wonderland → Harrods)
     - Dec 29: Linear east→south (Tower of London → Tower Bridge → London Eye)
4. **Infant care plan**: Added for musical (Dec 26) and skiing (Dec 27)

**Constraints that drove routing decisions**:
- Portobello Road: MUST be Saturday (closed Sundays) → locked to Dec 28
- Borough Market: Wed-Sat only → cannot be Dec 29 (Sunday)
- Tower of London: Closed Dec 25-26 → must be Dec 28 or 29
- Harrods: Closes 20:00 Sunday vs normal hours Saturday → better on Dec 28

**TODO for future agents**:
- [x] Validate drive times with Google Maps API for specific dates/times ✓ (completed 2025-12-18)
- [x] Update accommodation to actual hotel location ✓ (completed 2025-12-19)
- [ ] Book attractions in priority order (see Booking Priorities section)

---

## Overview

Planning a 7-day London trip (24-30 December 2025) for a group arriving from Bali. Driver (Windo) based in Sheffield, staying near Heathrow during the trip.

**Accommodation**: Staybridge Suites London - Heathrow Bath Road by IHG
**Address**: 276A Bath Rd, Sipson, West Drayton UB7 0DQ
**Key benefit**: 1.3 miles from Heathrow terminals - ideal for arrival day

---

## Group Composition

```
Total: 7 people
- Adults: 5
- Youth: 1 (age 14)
- Infant: 1 (age 1)
```

### Constraints by Group Member
- **Infant (1yr)**: Cannot attend West End musical (age restrictions), cannot participate in skiing
- **Youth (14yr)**: Can participate in all activities
- **Adults**: One parent must stay with infant during musical and skiing

---

## Driver Constraints

```yaml
base_location: Sheffield
accommodation_during_trip: Staybridge Suites Heathrow, 276A Bath Rd, Sipson UB7 0DQ
accommodation_coords: (51.4819, -0.4474)
distance_to_heathrow: 1.3 miles (~5 min)
daily_hour_limit: 8 hours (before overtime)
driving_days: [24, 25, 26, 27, 28, 29]  # December 2025
day_off: 30  # December 2025
```

### Drive Times from Staybridge Suites Heathrow (minutes)

**UPDATED 2025-12-19** - New base location near Heathrow Airport.
Sources: Rome2Rio, transfer services, taxi estimates.

```python
drive_times_from_heathrow_hotel = {
    "heathrow_terminals": {
        "distance_miles": 1.3,
        "base_time_min": 5,
        "with_traffic": "5-10",
        "note": "Hotel is adjacent to airport - major benefit for arrival day",
        "source": "ihg.com, rome2rio.com"
    },
    "notting_hill_portobello": {
        "distance_miles": 14,
        "base_time_min": 28,
        "with_traffic": "35-50",
        "dec_28_sat_0930": "40-55",  # Saturday morning, busy
        "source": "rome2rio.com"
    },
    "hyde_park_winter_wonderland": {
        "distance_miles": 13,
        "base_time_min": 25,
        "with_traffic": "30-45",
        "source": "estimated"
    },
    "westminster_london_eye": {
        "distance_miles": 17,
        "base_time_min": 35,
        "with_traffic": "40-60",
        "source": "rome2rio.com"
    },
    "borough_market": {
        "distance_miles": 18,
        "base_time_min": 39,
        "with_traffic": "45-65",
        "dec_26_thu_0930": "50-65",  # Boxing Day, cross-city
        "source": "rome2rio.com"
    },
    "tower_of_london": {
        "distance_miles": 19,
        "base_time_min": 43,
        "with_traffic": "50-70",
        "dec_29_sun_0830": "45-55",  # Sunday morning, lighter traffic
        "source": "rome2rio.com"
    },
    "snow_centre_hemel_hempstead": {
        "distance_miles": 20,
        "base_time_min": 42,
        "with_traffic": "45-60",
        "route": "via M25 (not M1 like from Colindale)",
        "parking": "FREE on-site",
        "source": "uber.com, skiresort.info"
    },
    "south_bank_chinatown": {
        "distance_miles": 16,
        "base_time_min": 33,
        "with_traffic": "40-55",
        "dec_25_christmas": "30-40",  # Empty roads on Christmas Day
        "source": "estimated"
    }
}

# Intra-London transfers (unchanged - these don't depend on starting point)
intra_london_transfers = {
    "tower_to_westminster": {
        "distance_miles": 3.5,
        "base_time_min": 15,
        "with_traffic": "20-40",
        "dec_29_sun_1500": "25-35",
        "note": "Consider river boat as alternative (40-50 min but scenic)",
        "source": "meetways.com"
    },
    "notting_hill_to_hyde_park": {
        "distance_miles": 1.5,
        "base_time_min": 8,
        "with_traffic": "15-30",
        "dec_28_winter_wonderland": "20-35",
        "note": "Winter Wonderland causes severe congestion around Hyde Park",
        "source": "hydeparkwinterwonderland.com"
    },
    "borough_market_to_westminster": {
        "distance_miles": 2.5,
        "base_time_min": 12,
        "with_traffic": "15-30",
        "source": "estimated"
    }
}

# Comparison: Heathrow hotel vs Colindale (old location)
location_comparison = {
    "heathrow_terminals": {"heathrow_hotel": 1.3, "colindale": 17, "difference": "-15.7 miles"},
    "tower_of_london": {"heathrow_hotel": 19, "colindale": 12, "difference": "+7 miles"},
    "notting_hill": {"heathrow_hotel": 14, "colindale": 8, "difference": "+6 miles"},
    "borough_market": {"heathrow_hotel": 18, "colindale": 11, "difference": "+7 miles"},
    "snow_centre": {"heathrow_hotel": 20, "colindale": 17, "difference": "+3 miles"},
    "verdict": "Dec 24 arrival much easier. Other days add 10-20 min drive time."
}
```

---

## Critical Date Constraints

### Christmas Closures
```python
closures = {
    "25_dec": {
        "closed": ["Tower of London", "Borough Market", "Westminster Abbey", "National Gallery", "British Museum", "most_retail"],
        "open": ["Chinatown restaurants"],
        "transport": "No public transport"
    },
    "26_dec": {
        "closed": ["National Gallery", "Tower of London"],
        "open": ["Borough Market", "Westminster Abbey", "most_attractions"]
    }
}
```

### Changing of the Guard Schedule
```python
changing_of_guard = {
    "29_dec": False,  # CANCELLED
    "30_dec": True,   # CONFIRMED at 11:00
}
```

### Market Schedules
```python
markets = {
    "portobello_road": {
        "best_day": "Saturday",  # Full market
        "closed": "Sunday",
        "stalls_close": "17:00"
    },
    "borough_market": {
        "open": ["Wed", "Thu", "Fri", "Sat"],
        "opens": "10:00",
        "boxing_day": True
    }
}
```

### Seasonal Constraints
```python
seasonal = {
    "buckingham_palace_interior": "closed_in_winter",  # Exterior only
    "sunset_time": "15:55",  # Late Dec
    "school_holidays": True,  # 24 Dec - 1 Jan
    "expected_crowds": "high"
}
```

---

## Congestion Charge & ULEZ

```python
congestion_charge = {
    "daily_rate": 15.00,  # GBP
    "operating_hours": {
        "weekday": "07:00-18:00",
        "weekend": "12:00-18:00"
    },
    "christmas_suspension": {
        "start": "2025-12-25",
        "end": "2026-01-01",
        "inclusive": True
    },
    "applies_on_trip": ["2025-12-24"]  # Only this day
}

ulez = {
    "vehicle_compliant": True,  # CONFIRMED - no ULEZ charges apply
    "daily_rate": 12.50,  # GBP, if non-compliant (N/A for this trip)
    "cost_for_trip": 0  # Vehicle is ULEZ compliant
}
```

---

## All 21 Required Locations

```python
locations = [
    {
        "id": 1,
        "name": "Buckingham Palace + Changing of Guard",
        "coords": (51.5014, -0.1419),
        "type": "attraction",
        "cost": 0,
        "duration_hours": 1.5,
        "booking_required": False,
        "best_time": "10:15 arrival for 11:00 ceremony",
        "constraints": ["changing_guard_only_30_dec"],
        "scheduled_day": "30_dec",
        "transport": "guests_tube"
    },
    {
        "id": 2,
        "name": "British Museum",
        "coords": (51.5194, -0.1270),
        "type": "museum",
        "cost": 0,
        "duration_hours": 2,
        "booking_required": False,
        "constraints": ["closed_25_dec"],
        "scheduled_day": "30_dec",
        "transport": "guests_tube"
    },
    {
        "id": 3,
        "name": "Covent Garden",
        "coords": (51.5117, -0.1240),
        "type": "shopping_entertainment",
        "cost": 0,
        "duration_hours": 1.5,
        "booking_required": False,
        "scheduled_day": "24_dec",
        "transport": "driver"
    },
    {
        "id": 4,
        "name": "Winter Lights",
        "coords": (51.5100, -0.1350),
        "type": "seasonal",
        "cost": 0,
        "duration_hours": 1,
        "booking_required": False,
        "best_time": "after_dark",
        "scheduled_day": "24_dec",
        "transport": "driver"
    },
    {
        "id": 5,
        "name": "Tower of London",
        "coords": (51.5081, -0.0759),
        "type": "attraction",
        "cost": 192,  # 5 adult + 1 youth
        "duration_hours": 3,
        "booking_required": True,
        "booking_url": "https://www.hrp.org.uk/tower-of-london/",
        "constraints": ["closed_25_dec", "closed_26_dec"],
        "scheduled_day": "29_dec",  # CHANGED: moved from 28_dec to cluster with Tower Bridge
        "scheduled_time": "09:30",
        "transport": "driver"
    },
    {
        "id": 6,
        "name": "Tower Bridge",
        "coords": (51.5055, -0.0754),
        "type": "landmark",
        "cost": 0,
        "duration_hours": 0.5,
        "booking_required": False,
        "scheduled_day": "29_dec",  # CHANGED: moved from 26_dec to cluster with Tower of London
        "transport": "driver"
    },
    {
        "id": 7,
        "name": "Borough Market",
        "coords": (51.5055, -0.0910),
        "type": "market",
        "cost": 0,
        "duration_hours": 1.75,
        "booking_required": False,
        "constraints": ["closed_25_dec", "opens_10:00"],
        "scheduled_day": "26_dec",
        "scheduled_time": "10:15",
        "transport": "driver"
    },
    {
        "id": 8,
        "name": "South Bank",
        "coords": (51.5055, -0.1150),
        "type": "walk",
        "cost": 0,
        "duration_hours": 1.25,
        "booking_required": False,
        "scheduled_day": "25_dec",
        "transport": "driver"
    },
    {
        "id": 9,
        "name": "National Gallery",
        "coords": (51.5089, -0.1283),
        "type": "museum",
        "cost": 0,
        "duration_hours": 2,
        "booking_required": False,
        "constraints": ["closed_25_dec", "closed_26_dec"],
        "scheduled_day": "30_dec",
        "transport": "guests_tube"
    },
    {
        "id": 10,
        "name": "Trafalgar Square",
        "coords": (51.5080, -0.1281),
        "type": "landmark",
        "cost": 0,
        "duration_hours": 0.5,
        "booking_required": False,
        "scheduled_day": "30_dec",
        "transport": "guests_tube"
    },
    {
        "id": 11,
        "name": "West End Musical",
        "coords": (51.5115, -0.1280),
        "type": "entertainment",
        "cost": 250,  # 4 adult + 1 youth (1 parent stays with infant)
        "duration_hours": 3,
        "booking_required": True,
        "booking_url": "https://officiallondontheatre.com/",
        "constraints": ["infant_cannot_attend", "one_parent_stays"],
        "scheduled_day": "26_dec",
        "scheduled_time": "19:30",
        "transport": "driver"
    },
    {
        "id": 12,
        "name": "Soho",
        "coords": (51.5137, -0.1337),
        "type": "neighbourhood",
        "cost": 0,
        "duration_hours": 2.5,
        "booking_required": False,
        "scheduled_day": "26_dec",
        "transport": "driver"
    },
    {
        "id": 13,
        "name": "Indoor Skiing (Snow Centre)",
        "coords": (51.7520, -0.4690),
        "address": "St Albans Hill, Hemel Hempstead HP3 9NH",
        "type": "activity",
        "cost": 295,  # 5 people x 2hr beginner lesson
        "duration_hours": 3.5,  # Including check-in, lunch
        "booking_required": True,
        "booking_url": "https://www.thesnowcentre.com/",
        "constraints": ["infant_cannot_participate", "one_parent_stays", "outside_london"],
        "scheduled_day": "27_dec",
        "scheduled_time": "11:00",
        "transport": "driver",
        "parking": "free"
    },
    {
        "id": 14,
        "name": "Westminster Abbey",
        "coords": (51.4994, -0.1273),
        "type": "attraction",
        "cost": 169,  # 5 adult + 1 youth
        "duration_hours": 2.5,
        "booking_required": True,
        "booking_url": "https://www.westminster-abbey.org/",
        "constraints": ["closed_25_dec"],
        "scheduled_day": "26_dec",
        "scheduled_time": "13:00",
        "transport": "driver"
    },
    {
        "id": 15,
        "name": "London Eye",
        "coords": (51.5033, -0.1195),
        "type": "attraction",
        "cost": 210,  # 5 adult + 1 youth
        "duration_hours": 1,
        "booking_required": True,
        "booking_url": "https://www.londoneye.com/",
        "best_time": "after_sunset",  # Sunset ~15:55 in late Dec
        "scheduled_day": "29_dec",  # CHANGED: moved from 28_dec for linear east→south route
        "scheduled_time": "16:30",  # Adjusted for sunset timing
        "transport": "driver"
    },
    {
        "id": 16,
        "name": "Shoreditch",
        "coords": (51.5255, -0.0795),
        "type": "neighbourhood",
        "cost": 0,
        "duration_hours": 2,
        "booking_required": False,
        "scheduled_day": "30_dec",
        "optional": True,
        "transport": "guests_tube"
    },
    {
        "id": 17,
        "name": "Winter Markets",
        "coords": (51.5073, -0.1600),  # Winter Wonderland as primary
        "type": "seasonal",
        "cost": 0,
        "duration_hours": 1,
        "booking_required": False,
        "note": "Covered by Covent Garden (24 Dec) and Winter Wonderland (29 Dec)",
        "scheduled_day": "multiple",
        "transport": "driver"
    },
    {
        "id": 18,
        "name": "Hyde Park",
        "coords": (51.5073, -0.1657),
        "type": "park",
        "cost": 0,
        "duration_hours": 1.25,
        "booking_required": False,
        "scheduled_day": "28_dec",  # CHANGED: moved from 29_dec to cluster with west London
        "transport": "driver"
    },
    {
        "id": 19,
        "name": "Harrods",
        "coords": (51.4994, -0.1633),
        "type": "shopping",
        "cost": 0,
        "duration_hours": 1.5,
        "booking_required": False,
        "closing_time_sunday": "20:00",  # Note: Saturday (28_dec) has better hours
        "scheduled_day": "28_dec",  # CHANGED: moved from 29_dec - better hours on Saturday
        "transport": "driver"
    },
    {
        "id": 20,
        "name": "Winter Wonderland",
        "coords": (51.5073, -0.1600),
        "type": "seasonal",
        "cost": 145,  # Entry £45 + rides ~£100
        "duration_hours": 3,
        "booking_required": True,
        "booking_url": "https://hydeparkwinterwonderland.com/",
        "constraints": ["very_crowded_school_holidays"],
        "scheduled_day": "28_dec",  # CHANGED: moved from 29_dec to cluster with west London locations
        "scheduled_time": "14:00",
        "transport": "driver"
    },
    {
        "id": 21,
        "name": "Notting Hill + Portobello Road",
        "coords": (51.5170, -0.2050),
        "type": "market_neighbourhood",
        "cost": 0,
        "duration_hours": 2.25,
        "booking_required": False,
        "constraints": ["best_on_saturday", "closed_sunday", "stalls_close_17:00"],
        "scheduled_day": "28_dec",
        "scheduled_time": "14:00",
        "transport": "driver"
    }
]

# Bonus location
bonus_location = {
    "id": 22,
    "name": "Oxford Street / Primark",
    "coords": (51.5152, -0.1418),
    "type": "shopping",
    "cost": 0,
    "duration_hours": 1.25,
    "booking_required": False,
    "scheduled_day": "24_dec",
    "transport": "driver"
}
```

---

## Current Optimized Itinerary

```python
itinerary = {
    "24_dec": {
        "day_name": "Tuesday",
        "theme": "Arrival Day",
        "depart_hotel": "07:30",  # UPDATED: Later start - hotel is at Heathrow!
        "return_hotel": "18:00",
        "total_hours": 5.5,  # REDUCED: No long airport transfer
        "overtime_hours": 0,
        "congestion_charge": 15.00,
        "ulez": 0,  # Vehicle is ULEZ compliant
        "parking_cost": (15, 25),  # REDUCED: No Heathrow parking needed
        "hotel": "Staybridge Suites Heathrow, 276A Bath Rd, Sipson UB7 0DQ",
        "stops": [
            {"time": "07:30-08:00", "location": "Heathrow Airport", "activity": "Pickup (1.3 miles from hotel)", "parking": "Short Stay or pickup zone", "parking_cost": (5, 10)},
            {"time": "08:00-12:00", "location": "Hotel", "activity": "Check-in & REST", "note": "Critical jet lag recovery - guests can sleep immediately after landing"},
            {"time": "12:30-14:00", "location": "Oxford Street / Primark", "activity": "Shopping - buy warm clothes", "parking": "NCP Cavendish Square", "parking_cost": (10, 15)},
            {"time": "14:30-16:00", "location": "Covent Garden", "activity": "Explore Christmas market", "parking": "Walk from Oxford St"},
            {"time": "16:00-17:30", "location": "Winter Lights", "activity": "Evening lights walk", "parking": "Same"}
        ],
        "route_note": "IMPROVED: Hotel at Heathrow eliminates 45-min post-flight drive. Guests can rest immediately.",
        "backup": "If flight delayed >3 hrs, cancel afternoon"
    },
    "25_dec": {
        "day_name": "Wednesday",
        "theme": "Christmas Day - Relaxed",
        "depart_hotel": "10:00",
        "return_hotel": "17:00",
        "total_hours": 7,
        "overtime_hours": 0,
        "congestion_charge": 0,  # Christmas suspension
        "ulez": 0,  # Vehicle is ULEZ compliant
        "parking_cost": 0,  # Free street parking
        "drive_to_central": "30-40 min (empty Christmas roads)",
        "stops": [
            {"time": "10:45-12:00", "location": "South Bank", "activity": "Walk along Thames"},
            {"time": "12:00-13:00", "location": "Westminster Bridge / Big Ben", "activity": "Photos"},
            {"time": "13:00-14:30", "location": "Chinatown", "activity": "Lunch"},
            {"time": "14:30-16:00", "location": "Central London", "activity": "Quiet walk, enjoy empty streets"}
        ],
        "note": "Most attractions closed. No public transport. Roads quiet - good day for central London driving."
    },
    "26_dec": {
        "day_name": "Thursday",
        "theme": "Boxing Day - East London + West End",
        "depart_hotel": "09:00",  # Earlier start due to longer drive
        "return_hotel": "23:30",
        "total_hours": 8,  # If driver goes home during show
        "overtime_hours": 0,  # Or 3 if stays
        "congestion_charge": 0,  # Christmas suspension
        "ulez": 0,  # Vehicle is ULEZ compliant
        "parking_cost": (25, 40),
        "drive_to_borough": "50-65 min (18 miles cross-city)",
        "stops": [
            {"time": "10:00-12:00", "location": "Borough Market", "activity": "Brunch", "parking": "Snowsfields", "parking_cost": (10, 15)},
            {"time": "12:30-15:00", "location": "Westminster Abbey", "activity": "Visit", "parking": "Q-Park Westminster", "parking_cost": (15, 25)},
            {"time": "15:00-18:30", "location": "Soho", "activity": "Explore, early dinner", "parking": "Walk from Westminster"},
            {"time": "19:30-22:30", "location": "West End Musical", "activity": "Show (5 people)", "parking": "Walk from Soho"}
        ],
        "parking_moves": 2,
        "infant_care": {
            "during_musical": "Driver + 1 parent with infant",
            "plan": "Return to hotel near Heathrow (40-50 min drive) or explore quiet area",
            "note": "See infant_care_plan section for details"
        },
        "driver_option": "Return to hotel 19:30, collect group 22:30 (saves OT + parking)",
        "route_note": "Long initial drive from Heathrow area to Borough Market. Once in London, stays central."
    },
    "27_dec": {
        "day_name": "Friday",
        "theme": "Skiing Day",
        "depart_hotel": "09:00",
        "return_hotel": "17:00",
        "total_hours": 8,
        "overtime_hours": 0,
        "congestion_charge": 0,  # Outside London
        "ulez": 0,  # Outside London
        "parking_cost": 0,  # Free at Snow Centre
        "drive_to_snow_centre": "45-60 min via M25 (20 miles)",
        "stops": [
            {"time": "10:00", "location": "Snow Centre", "activity": "Arrive", "parking": "On-site FREE"},
            {"time": "11:00-13:00", "location": "Snow Centre", "activity": "2hr beginner lessons (5 people)"},
            {"time": "13:00-14:00", "location": "Snow Centre", "activity": "Lunch at café"},
            {"time": "14:30", "location": "Depart Snow Centre"},
            {"time": "15:30", "location": "Hotel", "activity": "Return"}
        ],
        "infant_arrangement": "Driver + 1 parent with infant at café",
        "backup": "Marlowes Shopping Centre (10 min drive)",
        "route_note": "Via M25 from Heathrow area (different route than M1 from Colindale)"
    },
    "28_dec": {
        "day_name": "Saturday",
        "theme": "West London Day",
        "depart_hotel": "09:00",
        "return_hotel": "20:00",
        "total_hours": 11,
        "overtime_hours": 3,
        "congestion_charge": 0,  # Christmas suspension
        "ulez": 0,  # Vehicle is ULEZ compliant
        "parking_cost": (32, 48),
        "drive_to_notting_hill": "40-55 min (14 miles)",
        "stops": [
            {"time": "10:00-13:00", "location": "Notting Hill + Portobello Road", "activity": "Market (Saturday - best day)", "parking": "Q-Park Queensway", "parking_cost": (15, 20)},
            {"time": "13:30-14:00", "location": "Hyde Park", "activity": "Walk to Winter Wonderland", "parking": "Q-Park Park Lane", "parking_cost": (17, 28)},
            {"time": "14:00-17:00", "location": "Winter Wonderland", "activity": "Rides, food, explore", "parking": "Same (walk)"},
            {"time": "17:30-19:30", "location": "Harrods", "activity": "Browse (better hours on Saturday)", "parking": "Walk from Park Lane"}
        ],
        "parking_moves": 2,
        "route_note": "West London is relatively close to Heathrow. All locations cluster well together."
    },
    "29_dec": {
        "day_name": "Sunday",
        "theme": "East + South London - Final Driving Day",
        "depart_hotel": "08:00",  # Earlier start - longest drive of the trip
        "return_hotel": "19:00",
        "total_hours": 11,
        "overtime_hours": 3,
        "congestion_charge": 0,  # Christmas suspension
        "ulez": 0,  # Vehicle is ULEZ compliant
        "parking_cost": (25, 40),
        "drive_to_tower": "45-55 min (19 miles - longest drive)",
        "stops": [
            {"time": "09:30-12:30", "location": "Tower of London", "activity": "Visit (3 hrs)", "parking": "Minories", "parking_cost": (15, 20)},
            {"time": "12:30-13:00", "location": "Tower Bridge", "activity": "Photos (5 min walk from Tower)", "parking": "Walk"},
            {"time": "13:00-14:30", "location": "Near Tower Bridge", "activity": "Lunch", "parking": "Walk", "note": "Borough Market closed Sundays - use nearby restaurants"},
            {"time": "15:00-15:30", "location": "Drive to Westminster", "activity": "Transit (25-35 min)"},
            {"time": "16:00-17:00", "location": "London Eye", "activity": "Ride at dusk/sunset", "parking": "Q-Park Westminster", "parking_cost": (10, 20)}
        ],
        "parking_moves": 2,
        "route_note": "Longest initial drive from Heathrow to east London. Linear east→south route once there.",
        "note": "END OF DRIVING DUTIES"
    },
    "30_dec": {
        "day_name": "Monday",
        "theme": "Guests Independent - Driver Day Off",
        "driver_status": "day_off",
        "transport": "Piccadilly line from Heathrow or Elizabeth line",
        "tube_cost_per_person": 8.10,  # Daily cap
        "tube_cost_total": 50,  # 6 people
        "stops": [
            {"time": "09:30", "location": "Depart hotel for Heathrow tube station"},
            {"time": "10:15", "location": "Buckingham Palace", "activity": "Arrive for viewing spot"},
            {"time": "11:00-11:45", "location": "Buckingham Palace", "activity": "Changing of Guard"},
            {"time": "12:00-14:00", "location": "National Gallery", "activity": "Visit (FREE)"},
            {"time": "15:00-17:00", "location": "British Museum", "activity": "Visit (FREE)"},
            {"time": "Optional", "location": "Shoreditch", "activity": "If energy permits"}
        ],
        "tube_route": [
            "Hotel → Heathrow Terminal 2/3 station (bus or walk)",
            "Heathrow → Green Park (Piccadilly line, ~45 min)",
            "Walk to Buckingham Palace (5 min)",
            "Walk to National Gallery (15 min via The Mall)",
            "Walk or tube to British Museum",
            "Holborn → Heathrow (Piccadilly line, ~50 min)"
        ],
        "alternative_route": "Elizabeth line from Heathrow to Paddington, then tube to Green Park",
        "note": "Heathrow stations are step-free. Journey is longer than from Colindale but straightforward."
    }
}
```

---

## Parking Database

```python
parking_locations = {
    "ncp_cavendish_square": {
        "name": "NCP Cavendish Square",
        "address": "Cavendish Square, W1G 0PN",
        "coords": (51.5165, -0.1445),
        "hourly_rate_approx": 8,
        "nearby": ["Oxford Street", "Regent Street", "Covent Garden"]
    },
    "snowsfields": {
        "name": "Snowsfields Car Park",
        "address": "Snowsfields, SE1 3SU",
        "coords": (51.5020, -0.0850),
        "hourly_rate_approx": 5,
        "nearby": ["Borough Market", "Tower Bridge"]
    },
    "q_park_westminster": {
        "name": "Q-Park Westminster",
        "address": "Great College Street, SW1P 3RX",
        "coords": (51.4975, -0.1265),
        "hourly_rate_approx": 7,
        "nearby": ["Westminster Abbey", "London Eye", "South Bank"]
    },
    "ncp_wardour_street": {
        "name": "NCP Wardour Street",
        "address": "Wardour Street, W1D 6QF",
        "coords": (51.5130, -0.1340),
        "hourly_rate_approx": 6,
        "nearby": ["Soho", "West End theatres", "Chinatown"]
    },
    "snow_centre": {
        "name": "Snow Centre Car Park",
        "address": "St Albans Hill, HP3 9NH",
        "coords": (51.7520, -0.4690),
        "hourly_rate_approx": 0,
        "free": True
    },
    "minories": {
        "name": "Minories Car Park",
        "address": "1 Shorter Street, E1 8LP",
        "coords": (51.5105, -0.0745),
        "hourly_rate_approx": 6,
        "nearby": ["Tower of London", "Tower Bridge"]
    },
    "q_park_queensway": {
        "name": "Q-Park Queensway",
        "address": "Queensway, W2 4YL",
        "coords": (51.5115, -0.1875),
        "hourly_rate_approx": 7,
        "nearby": ["Notting Hill", "Portobello Road", "Hyde Park"]
    },
    "q_park_park_lane": {
        "name": "Q-Park Park Lane",
        "address": "Park Lane, W1K 7TN",
        "coords": (51.5045, -0.1505),
        "hourly_rate_approx": 5,  # Better for longer stays
        "nearby": ["Hyde Park", "Winter Wonderland", "Harrods"],
        "good_for_all_day": True
    }
}
```

---

## Cost Summary

```python
costs = {
    "attractions": {
        "westminster_abbey": 169,
        "west_end_musical": 250,
        "snow_centre_lessons": 295,
        "tower_of_london": 192,
        "london_eye": 210,
        "winter_wonderland_entry": 45,
        "winter_wonderland_rides": 100,
        "subtotal": 1261
    },
    "driving": {
        "congestion_charge": 15,  # Only 24 Dec
        "ulez": 0,  # UPDATED: Vehicle is ULEZ compliant
        "parking_low": 112,  # UPDATED: reduced due to route optimization
        "parking_high": 168,
        "fuel": 50,
        "subtotal_low": 177,
        "subtotal_high": 233
    },
    "other": {
        "tube_30_dec": 50,
        "lunch_restaurant": 120  # Removed date - flexible
    },
    "grand_total_excl_meals": {
        "low": 1608,  # UPDATED
        "high": 1664   # UPDATED
    },
    "meals_estimate": {
        "low": 500,
        "high": 650
    },
    "grand_total": {
        "low": 2108,  # UPDATED
        "high": 2314   # UPDATED
    }
}
```

---

## Overtime Analysis

```python
overtime = {
    "daily_limit_hours": 8,
    "days": {
        "24_dec": {"total": 5.5, "overtime": 0, "note": "REDUCED - hotel at Heathrow!"},
        "25_dec": {"total": 7, "overtime": 0},
        "26_dec": {"total": 8, "overtime": 0, "note": "If driver goes home during show; else 3 hrs OT"},
        "27_dec": {"total": 8, "overtime": 0, "note": "Reduced vs Colindale - shorter M25 return"},
        "28_dec": {"total": 11, "overtime": 3},
        "29_dec": {"total": 11, "overtime": 3, "note": "Longest day - 19 miles to Tower of London"},
        "30_dec": {"total": 0, "overtime": 0, "driver_day_off": True}
    },
    "total_best_case": 6,   # UPDATED for Heathrow location
    "total_worst_case": 9   # If driver stays during musical on Dec 26
}
```

---

## Risk Matrix

```python
risks = [
    {
        "risk": "Flight delay from Bali",
        "day": "24_dec",
        "likelihood": "medium",
        "impact": "high",
        "mitigation": "Afternoon activities optional. Cancel if >3hr delay."
    },
    {
        "risk": "Severe jet lag (especially infant)",
        "day": "24-26_dec",
        "likelihood": "high",
        "impact": "medium",
        "mitigation": "Light schedules first 2 days. Mandatory rest period Day 1."
    },
    {
        "risk": "Rain",
        "day": "any",
        "likelihood": "high",  # Dec avg 11 rainy days
        "impact": "medium",
        "mitigation": "Indoor backups: museums, Harrods, Primark"
    },
    {
        "risk": "Cold weather shock (guests from Bali)",
        "day": "all",
        "likelihood": "high",
        "impact": "medium",
        "mitigation": "Primark Day 1 for warm layers"
    },
    {
        "risk": "Musical sold out",
        "day": "26_dec",
        "likelihood": "high_if_not_booked",
        "impact": "high",
        "mitigation": "BOOK IMMEDIATELY"
    },
    {
        "risk": "Snow Centre lessons full",
        "day": "27_dec",
        "likelihood": "medium",
        "impact": "high",
        "mitigation": "Book NOW - school holidays"
    },
    {
        "risk": "Winter Wonderland overcrowded",
        "day": "29_dec",
        "likelihood": "high",
        "impact": "medium",
        "mitigation": "Pre-book entry + ride tickets"
    },
    {
        "risk": "Portobello stalls closed",
        "day": "28_dec",
        "likelihood": "low",
        "impact": "low",
        "mitigation": "Scheduled Saturday (best day), arrive 14:00 with 3hrs margin"
    },
    {
        "risk": "Guests lost on tube (30 Dec)",
        "day": "30_dec",
        "likelihood": "medium",
        "impact": "low",
        "mitigation": "Install Citymapper, print backup route"
    },
    {
        "risk": "Driver fatigue",
        "day": "26_dec, 28_dec",
        "likelihood": "medium",
        "impact": "high",
        "mitigation": "Go home during show (26 Dec). Free evening (27 Dec). Plan rest."
    }
]
```

---

## Infant Care Plan

```python
infant_care = {
    "26_dec_musical": {
        "time": "19:30-22:30",
        "attendees_at_show": 5,  # 4 adults + 1 youth
        "carers": ["Driver (Windo)", "1 parent"],
        "infant_age": "1 year",
        "options": [
            {
                "option": "Return to Heathrow hotel",
                "pros": ["Infant can sleep in familiar environment", "No parking cost"],
                "cons": ["40-50 min drive each way", "Driver must return at 22:30 for pickup"],
                "recommended": True
            },
            {
                "option": "Stay in West End area",
                "location_ideas": ["Leicester Square", "Covent Garden (quieter by evening)", "Walk along South Bank"],
                "pros": ["No driving", "Can explore"],
                "cons": ["Late evening with infant", "Need to manage tiredness"],
                "recommended": False
            }
        ],
        "decision": "Recommend Option 1: Return to Heathrow hotel. Driver drops group at theatre 19:15, drives back to Heathrow with parent + infant, returns for 22:30 pickup. Saves parking + gives infant proper rest."
    },
    "27_dec_skiing": {
        "time": "11:00-13:00 (lesson) + 13:00-14:00 (lunch)",
        "participants_skiing": 5,  # 4 adults + 1 youth (one parent stays)
        "carers": ["Driver (Windo)", "1 parent"],
        "infant_age": "1 year",
        "location": "Snow Centre, Hemel Hempstead",
        "options": [
            {
                "option": "Stay at Snow Centre café/viewing area",
                "duration": "~3 hours",
                "facilities": ["Café with food", "Viewing gallery", "Soft play area nearby"],
                "pros": ["Can watch skiing", "Everyone together for lunch"],
                "cons": ["3 hours is long with a 1-year-old"],
                "recommended": True
            },
            {
                "option": "Visit Marlowes Shopping Centre",
                "location": "10 min drive from Snow Centre",
                "facilities": ["Shops", "Food court", "Baby changing"],
                "pros": ["More variety", "Indoor warm environment"],
                "cons": ["Separate from group", "Needs coordination for pickup"],
                "recommended": False
            }
        ],
        "decision": "Recommend Option 1: Stay at Snow Centre. Café has good facilities, can watch the lesson from viewing gallery. Bring toys/snacks for infant. Join group for lunch at 13:00."
    }
}
```

---

## Booking Priorities

```python
bookings = [
    {"item": "West End Musical", "tickets": 5, "date": "26 Dec 19:30", "priority": "CRITICAL", "url": "https://officiallondontheatre.com/"},
    {"item": "Winter Wonderland entry", "tickets": 7, "date": "28 Dec 14:00", "priority": "CRITICAL", "url": "https://hydeparkwinterwonderland.com/"},  # UPDATED: moved to 28 Dec
    {"item": "Snow Centre lessons", "people": 5, "date": "27 Dec 11:00", "priority": "HIGH", "url": "https://www.thesnowcentre.com/"},
    {"item": "Tower of London", "tickets": 7, "date": "29 Dec 09:30", "priority": "HIGH", "url": "https://www.hrp.org.uk/tower-of-london/"},  # UPDATED: moved to 29 Dec
    {"item": "London Eye", "tickets": 7, "date": "29 Dec 16:30", "priority": "HIGH", "url": "https://www.londoneye.com/"},  # UPDATED: moved to 29 Dec, 16:30 for sunset
    {"item": "Westminster Abbey", "tickets": 7, "date": "26 Dec 13:00", "priority": "MEDIUM", "url": "https://www.westminster-abbey.org/"},
    {"item": "Lunch restaurant (near Hyde Park)", "people": 7, "date": "28 Dec 13:00", "priority": "MEDIUM", "url": "OpenTable"}  # UPDATED: moved to 28 Dec
]
```

---

## Geographic Clusters

```python
clusters = {
    "east_london": {
        "locations": ["Tower of London", "Tower Bridge"],
        "best_parking": "Minories",
        "scheduled": "29_dec",
        "note": "Tower + Bridge are 300m apart - always visit together"
    },
    "east_london_market": {
        "locations": ["Borough Market"],
        "best_parking": "Snowsfields",
        "scheduled": "26_dec",
        "note": "Separated from Tower cluster due to Sunday closure (Borough closed Sun, Tower closed 25-26)"
    },
    "central_south": {
        "locations": ["Westminster Abbey", "London Eye", "South Bank", "Westminster Bridge"],
        "best_parking": "Q-Park Westminster",
        "scheduled": "26_dec (Abbey), 29_dec (Eye)",
        "note": "Walk along river connects all"
    },
    "west_end": {
        "locations": ["Covent Garden", "Soho", "West End theatres", "Trafalgar Square", "National Gallery", "Chinatown"],
        "best_parking": "NCP Wardour Street or walk from Westminster",
        "scheduled": "24_dec (Covent Garden), 26_dec (Soho, Musical)",
        "note": "All within 10 min walk"
    },
    "west_london": {
        "locations": ["Hyde Park", "Winter Wonderland", "Harrods", "Notting Hill", "Portobello Road"],
        "best_parking": "Q-Park Queensway (Notting Hill) → Q-Park Park Lane (Hyde Park area)",
        "scheduled": "28_dec (all)",
        "note": "OPTIMIZED: All west London on same day. 2 parking moves."
    },
    "north_london_museums": {
        "locations": ["British Museum"],
        "scheduled": "30_dec",
        "note": "Best accessed by tube (driver day off)"
    },
    "east_trendy": {
        "locations": ["Shoreditch"],
        "scheduled": "30_dec (optional)",
        "note": "Optional, best accessed by tube"
    },
    "outside_london": {
        "locations": ["Snow Centre"],
        "scheduled": "27_dec",
        "note": "45 min from Colindale, free parking"
    }
}
```

---

## Optimization Opportunities

### Potential Further Analysis
1. **Route optimization**: Calculate optimal driving routes between stops using real distance/time matrices
2. **Parking cost optimization**: Model parking duration vs cost trade-offs
3. **Time sensitivity analysis**: What if flight is delayed? What if an attraction takes longer?
4. **Weather contingency planning**: Create alternative indoor itinerary
5. **Walking route optimization**: For 30 Dec tube day, optimize walking between attractions
6. **Real-time availability**: API integration with booking systems
7. **Cost sensitivity**: How do different musical/restaurant choices affect total cost?

### Visualization Ideas
1. **Interactive map**: Day-by-day route visualization with markers
2. **Gantt chart**: Timeline view of each day
3. **Cost breakdown charts**: Pie/bar charts of spending categories
4. **Risk matrix visualization**: 2D plot of likelihood vs impact
5. **Geographic clustering**: Show how locations group spatially
6. **Driving time heatmap**: Visualize congestion patterns by time of day
7. **Walking radius circles**: Show what's reachable from each parking location

---

## Key Constraints Summary

```python
hard_constraints = [
    "Changing of Guard only available 30 Dec (not 29 Dec)",
    "Tower of London closed 25-26 Dec",
    "National Gallery closed 25-26 Dec",
    "Borough Market closed 25 Dec AND Sundays",  # UPDATED: added Sunday closure
    "Portobello Road closed Sundays",
    "Infant cannot attend musical",
    "Infant cannot ski",
    "Congestion Charge applies 24 Dec only (£15)",
    "No public transport 25 Dec",
    "Driver day off 30 Dec"
]
# NOTE: ULEZ removed - vehicle is compliant

soft_constraints = [
    "Portobello best on Saturday (full market) → scheduled 28 Dec ✓",
    "London Eye best after sunset (city lights) → scheduled 29 Dec 16:30 ✓",
    "Arrive Changing of Guard 45 min early for good spot",
    "Borough Market opens 10:00 → scheduled 26 Dec 10:15 ✓",
    "Harrods better on Saturday (closes 20:00 Sundays) → scheduled 28 Dec ✓",
    "8-hour driver limit before overtime",
    "Jet lag recovery needed first 2 days",
    "Tower of London + Tower Bridge should be same day (300m apart) → both 29 Dec ✓"
]
```

---

## Data Export Formats

All data above is provided in Python dict/list format for easy parsing. The data can be converted to:
- JSON for web applications
- pandas DataFrames for analysis
- GeoJSON for mapping
- CSV for spreadsheet analysis

---

## Notes for Claude Code

1. All coordinates are in (latitude, longitude) format
2. All costs are in GBP (£)
3. All times are in 24-hour format, UK timezone
4. Duration estimates include buffer time
5. Parking costs are ranges based on typical rates
6. Vehicle is ULEZ compliant (confirmed) - no ULEZ charges
7. The itinerary has been optimized for:
   - Christmas closures ✓
   - Geographic clustering (minimize driving) ✓ (see Dec 28 west London clustering)
   - Portobello on Saturday (28 Dec) ✓
   - Borough Market on weekday (26 Dec) - avoids Sunday closure ✓
   - Tower of London + Tower Bridge clustered (29 Dec) ✓
   - London Eye at sunset (29 Dec 16:30) ✓
   - Harrods on Saturday for better hours ✓
   - Changing of Guard on 30 Dec ✓
   - Driver day off on 30 Dec ✓
   - Infant care plans documented ✓

**Remaining TODO for future agents**:
- [x] Validate driving times with Google Maps API for specific dates/times ✓ (see Drive Times section)
- [ ] Create interactive visualization
- [ ] Build cost calculator with adjustable parameters
- [ ] Generate printable day cards
- [ ] Create weather contingency planner
- [ ] Book attractions in priority order (see Booking Priorities section)