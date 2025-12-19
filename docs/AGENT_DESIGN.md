# Trip Planner Agent System - Design Document

**Version**: 1.0
**Date**: 2025-12-19
**Status**: Draft - Awaiting Review

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Agent Specifications](#agent-specifications)
   - [Constraint Checker Agent](#constraint-checker-agent)
   - [Weather Contingency Agent](#weather-contingency-agent)
   - [Route Validator Agent](#route-validator-agent)
   - [Map Generator Agent](#map-generator-agent)
4. [Constraints Schema](#constraints-schema)
5. [Hook Configuration](#hook-configuration)
6. [API Integration](#api-integration)
7. [File Structure](#file-structure)
8. [Workflow](#workflow)
9. [Implementation Plan](#implementation-plan)

---

## Overview

### Purpose

A reusable multi-agent system for trip planning that:
- Validates itinerary constraints automatically
- Monitors weather and proposes contingency swaps
- Validates route times against real mapping data
- Regenerates visualizations when plans change

### Design Principles

1. **Reusable**: Works with any trip, not just London Christmas 2025
2. **Non-destructive**: Proposes changes for approval, never modifies directly
3. **Event-driven**: Runs automatically via hooks when relevant files change
4. **API-integrated**: Uses external services for accurate, real-time data

### Agent Summary

| Agent | Trigger | External API | Output |
|-------|---------|--------------|--------|
| Constraint Checker | `task_context.md` or `constraints.yaml` changes | None | GitHub issues + report |
| Weather Contingency | Daily schedule or manual trigger | WeatherAPI.com | Proposed swaps |
| Route Validator | Itinerary location/time changes | OpenRouteService | Discrepancy report |
| Map Generator | Any itinerary change | None (Leaflet.js) | Updated HTML maps |

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        File System                               │
├─────────────────────────────────────────────────────────────────┤
│  task_context.md    constraints.yaml    daily-planner.html      │
│         │                  │                    ▲                │
│         ▼                  ▼                    │                │
│    ┌─────────┐       ┌─────────┐          ┌─────────┐           │
│    │ Hook:   │       │ Hook:   │          │ Hook:   │           │
│    │ onChange│       │ onChange│          │ onAgent │           │
│    └────┬────┘       └────┬────┘          └────┬────┘           │
│         │                  │                    │                │
└─────────┼──────────────────┼────────────────────┼────────────────┘
          │                  │                    │
          ▼                  ▼                    ▼
   ┌──────────────────────────────────────────────────────┐
   │                   Agent Orchestrator                  │
   │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │
   │  │ Constraint │  │  Weather   │  │   Route    │      │
   │  │  Checker   │──│Contingency │──│ Validator  │      │
   │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘      │
   │        │               │               │              │
   │        ▼               ▼               ▼              │
   │  ┌─────────────────────────────────────────────┐     │
   │  │              Map Generator                   │     │
   │  └─────────────────────────────────────────────┘     │
   └──────────────────────────────────────────────────────┘
                              │
                              ▼
          ┌───────────────────────────────────────┐
          │            Output Layer               │
          ├───────────────────────────────────────┤
          │  proposed_changes.md                  │
          │  reports/constraint-report-YYYY-MM-DD-HHMM.md │
          │  GitHub Issues                        │
          │  daily-planner.html (pending approval)│
          └───────────────────────────────────────┘
```

### Data Flow

1. User edits `task_context.md` or `constraints.yaml`
2. Hook detects file change, triggers Constraint Checker
3. Constraint Checker validates all constraints, writes report
4. If locations/times changed, Route Validator runs
5. Route Validator checks times against OpenRouteService
6. If discrepancies found, writes to `proposed_changes.md`
7. Map Generator queued (runs after user approves changes)
8. Weather Contingency runs on schedule (daily) or manual trigger

---

## Agent Specifications

### Constraint Checker Agent

#### Purpose
Validate that all itinerary items comply with defined constraints.

#### Input
- `task_context.md` - Current itinerary and location data
- `constraints.yaml` - Constraint definitions (schema below)

#### Processing

```python
constraint_types = {
    "temporal": {
        "opening_hours": "Check visit time falls within opening hours",
        "closures": "Check location not closed on scheduled date",
        "day_of_week": "Check day-specific restrictions (e.g., Portobello = Saturday)",
        "duration": "Check allocated time >= minimum required duration"
    },
    "spatial": {
        "clustering": "Verify locations in same parking zone are within walking distance",
        "walking_radius": "Check max walking distance from parking not exceeded",
        "drive_sequence": "Verify route order is geographically sensible"
    },
    "group": {
        "age_restrictions": "Check infant/child restrictions (e.g., musical age limit)",
        "capacity": "Verify group size doesn't exceed venue limits",
        "accessibility": "Flag accessibility concerns for group composition"
    },
    "booking": {
        "required": "Flag items needing booking that aren't booked",
        "deadline": "Warn if booking deadline approaching",
        "availability": "Flag if scheduled outside booking slot"
    }
}
```

#### Output

1. **Markdown Report** (`reports/constraint-report-YYYY-MM-DD-HHMM.md`):
```markdown
# Constraint Validation Report
Generated: 2025-12-19 14:30

## Summary
- Total constraints checked: 47
- Passed: 44
- Warnings: 2
- Violations: 1

## Violations

### [CRITICAL] Tower of London - Closure Conflict
- **Constraint**: `closures.tower_of_london`
- **Issue**: Scheduled for Dec 26, but Tower of London is closed Dec 25-26
- **Suggestion**: Move to Dec 27, 28, or 29

## Warnings

### [WARNING] West End Musical - Booking Required
- **Constraint**: `booking.west_end_musical`
- **Issue**: Booking required but not confirmed
- **Deadline**: Book ASAP - Boxing Day shows sell out

### [WARNING] Borough Market - Tight Timing
- **Constraint**: `temporal.borough_market`
- **Issue**: Arrival 10:00, market opens 10:00. No buffer time.
- **Suggestion**: Adjust to 10:15 arrival
```

2. **GitHub Issues**: One issue per CRITICAL violation
```
Title: [Constraint Violation] Tower of London - Closure Conflict
Labels: constraint-violation, critical
Body: [Same content as report section]
```

#### Configuration

```yaml
# In constraints.yaml
constraint_checker:
  severity_levels:
    critical: ["closures", "age_restrictions", "required_bookings"]
    warning: ["tight_timing", "booking_deadline", "clustering"]
    info: ["optimization_opportunity"]

  create_github_issues: true
  issue_labels: ["constraint-violation"]

  thresholds:
    timing_buffer_minutes: 15
    walking_radius_km: 1.5
    clustering_tolerance_km: 0.5
```

---

### Weather Contingency Agent

#### Purpose
Monitor weather forecasts and propose activity swaps when conditions are unfavorable.

#### Input
- `task_context.md` - Itinerary with indoor/outdoor flags
- WeatherAPI.com forecast for trip dates

#### Trigger Conditions

```yaml
weather_thresholds:
  rain_probability_percent: 40  # Above this triggers contingency
  temperature_celsius: 4        # Below this triggers contingency
  wind_speed_mph: 20            # Above this triggers contingency

  # Combination rules
  combined_triggers:
    - rain > 30% AND temp < 8°C  # Cold rain is worse
    - wind > 15 mph AND rain > 20%  # Windy rain
```

#### Processing

1. Fetch 7-day forecast for trip location (London)
2. For each trip day, check conditions against thresholds
3. Identify outdoor activities scheduled on bad weather days
4. Find indoor alternatives from same geographic cluster
5. Propose swaps that minimize route disruption

#### Output

**proposed_changes.md**:
```markdown
# Proposed Changes
Generated: 2025-12-19 14:30
Agent: Weather Contingency

## Weather Alert: December 28

### Forecast
- Rain probability: 65%
- Temperature: 3°C
- Wind: 22 mph
- Condition: Cold rain likely

### Affected Activities
1. **Portobello Road Market** (outdoor, 3 hours)
2. **Hyde Park walk** (outdoor, 30 min)

### Proposed Swap

| Current (Dec 28) | Swap To | Reason |
|------------------|---------|--------|
| Portobello Road (10:00-13:00) | Move to Dec 27 PM | Dec 27 forecast: dry, 7°C |
| Hyde Park walk | Skip or reduce to 15 min | Replace with more Harrods time |

### Alternative: Full Day Swap
Swap Dec 27 (skiing, indoor) with Dec 28 (west London, outdoor):
- Dec 27: West London (better weather)
- Dec 28: Skiing (indoor, weather-proof)

**Trade-offs**:
- Pro: All outdoor activities on better day
- Con: Portobello not on Saturday (reduced market stalls)

### Recommendation
Option 1 (swap Portobello to Dec 27) preferred. Saturday market worth the trade-off.

---
**Action Required**: Review and approve/reject above changes.
To approve: Edit task_context.md with the changes.
```

#### API Integration

```python
# WeatherAPI.com integration
weather_api = {
    "base_url": "https://api.weatherapi.com/v1",
    "endpoints": {
        "forecast": "/forecast.json?q=London&days=7",
        "history": "/history.json?q=London&dt=YYYY-MM-DD"
    },
    "auth": "API key via X-Api-Key header",
    "rate_limit": "1M calls/month (free tier)",
    "data_points": [
        "maxtemp_c", "mintemp_c", "avgtemp_c",
        "daily_chance_of_rain", "maxwind_mph",
        "condition.text"
    ]
}
```

---

### Route Validator Agent

#### Purpose
Validate documented drive times against real routing data from OpenRouteService.

#### Input
- `task_context.md` - Locations with coordinates and documented drive times
- OpenRouteService Directions API

#### Processing

1. Extract all route segments from itinerary:
   ```
   Day 1: Hotel → Heathrow → Hotel → Oxford St → Covent Garden
   Day 2: Hotel → South Bank → Westminster → Chinatown → Hotel
   ...
   ```

2. For each segment, query OpenRouteService:
   ```python
   route_query = {
       "coordinates": [[start_lng, start_lat], [end_lng, end_lat]],
       "profile": "driving-car",
       "options": {
           "avoid_features": ["ferries"],
           "departure": "2025-12-26T09:00:00"  # For traffic estimation
       }
   }
   ```

3. Compare API response with documented time
4. Flag discrepancies exceeding threshold (>10 min OR >20%)

#### Output

**reports/route-validation-YYYY-MM-DD-HHMM.md**:
```markdown
# Route Validation Report
Generated: 2025-12-19 14:30

## Summary
- Routes validated: 23
- Within tolerance: 20
- Flagged: 3

## Discrepancies

### Dec 26: Hotel → Borough Market
| Metric | Documented | Calculated | Difference |
|--------|------------|------------|------------|
| Distance | 18 miles | 17.2 miles | -0.8 miles |
| Time | 50-65 min | 42 min | -8 to -23 min |

**Assessment**: Documented time appears conservative. API calculates 42 min
without traffic. With typical Boxing Day traffic (+30%), expect ~55 min.
**Verdict**: ✅ Within tolerance (documented range accounts for traffic)

### Dec 29: Hotel → Tower of London
| Metric | Documented | Calculated | Difference |
|--------|------------|------------|------------|
| Distance | 19 miles | 22.3 miles | +3.3 miles |
| Time | 45-55 min | 58 min | +3 to +13 min |

**Assessment**: Documented distance/time appears underestimated.
**Verdict**: ⚠️ FLAG - Consider updating to 55-70 min

## Proposed Updates

```yaml
# Add to proposed_changes.md
route_updates:
  - segment: "Hotel → Tower of London"
    current: "45-55 min (19 miles)"
    proposed: "55-70 min (22 miles)"
    reason: "OpenRouteService calculates 58 min / 22.3 miles"
```
```

#### API Integration

```python
# OpenRouteService integration
ors_api = {
    "base_url": "https://api.openrouteservice.org/v2",
    "endpoints": {
        "directions": "/directions/driving-car",
        "matrix": "/matrix/driving-car"  # For multi-point optimization
    },
    "auth": "API key via Authorization header",
    "rate_limit": "2000 requests/day (free tier)",
    "response_fields": [
        "routes[0].summary.distance",  # meters
        "routes[0].summary.duration",  # seconds
        "routes[0].geometry"  # for map visualization
    ]
}
```

#### Configuration

```yaml
route_validator:
  thresholds:
    time_difference_minutes: 10
    time_difference_percent: 20
    distance_difference_miles: 2

  traffic_adjustments:
    weekday_rush: 1.4      # 40% longer
    weekend_central: 1.2   # 20% longer
    christmas_day: 0.7     # 30% shorter (empty roads)
    boxing_day: 1.1        # 10% longer

  validate_on:
    - location_coordinate_change
    - new_location_added
    - time_estimate_change
```

---

### Map Generator Agent

#### Purpose
Regenerate Leaflet.js map visualizations when itinerary changes.

#### Input
- `task_context.md` - Updated locations, routes, parking
- `daily-planner.html` - Existing map template

#### Processing

1. Parse all locations from task_context.md
2. Extract daily routes and parking zones
3. Generate Leaflet.js code for each day's map
4. Update `daily-planner.html` JavaScript section

#### Output

Updates to `daily-planner.html`:
- Location markers with updated coordinates
- Route polylines for each day
- Parking zone markers
- Popup content with location details

#### Trigger Conditions

```yaml
map_generator:
  triggers:
    - location_coordinates_changed
    - new_location_added
    - location_removed
    - day_assignment_changed
    - parking_zone_changed

  # Don't trigger on:
  ignore:
    - time_only_changes
    - note_updates
    - cost_changes
```

#### Implementation Notes

The Map Generator differs from other agents:
- It produces a **file update** rather than a report
- Updates go to `proposed_changes.md` with diff preview
- User must approve before `daily-planner.html` is modified

```markdown
# In proposed_changes.md

## Map Update Required

The following locations have changed:

### Changes Detected
1. Hotel location: Colindale → Staybridge Suites Heathrow
2. Dec 27 route: M1 → M25

### Proposed Update
```diff
- colindale: [51.5955, -0.2499],
+ staybridgeHeathrow: [51.4819, -0.4474],

- // Via M1 motorway (17 miles, ~25-30 min)
+ // Via M25 motorway (20 miles, ~45-60 min)
```

**Action**: Approve to update daily-planner.html
```

---

## Constraints Schema

### File: `constraints.yaml`

```yaml
# Trip Planner Constraints Schema
# Version: 1.0

meta:
  trip_name: "London Christmas 2025"
  start_date: "2025-12-24"
  end_date: "2025-12-30"
  timezone: "Europe/London"
  base_location:
    name: "Staybridge Suites Heathrow"
    coordinates: [51.4819, -0.4474]
    address: "276A Bath Rd, Sipson, West Drayton UB7 0DQ"

group:
  total_size: 7
  composition:
    adults: 5
    youth:
      count: 1
      age: 14
    infants:
      count: 1
      age: 1

  # Members with special constraints
  special_needs:
    - member: "infant"
      constraints:
        - cannot_attend: ["musicals", "age_restricted_venues"]
        - cannot_participate: ["skiing", "physical_activities"]
        - requires: ["one_parent_supervision"]

driver:
  name: "Windo"
  daily_limit_hours: 8
  overtime_threshold_hours: 8
  day_off: "2025-12-30"
  home_base: "Sheffield"

# Temporal Constraints
temporal:
  opening_hours:
    borough_market:
      days: ["Wed", "Thu", "Fri", "Sat"]
      opens: "10:00"
      closes: "17:00"
      notes: "Closed Sun-Tue"

    tower_of_london:
      default:
        opens: "09:00"
        closes: "17:30"
      last_admission: "16:30"

    harrods:
      weekday:
        opens: "10:00"
        closes: "21:00"
      saturday:
        opens: "10:00"
        closes: "21:00"
      sunday:
        opens: "11:30"
        closes: "18:00"

    portobello_road:
      saturday:
        opens: "09:00"
        closes: "17:00"
        notes: "Full antiques market"
      weekday:
        opens: "09:00"
        closes: "18:00"
        notes: "Shops only, limited stalls"
      sunday: "CLOSED"

  closures:
    christmas_day:
      date: "2025-12-25"
      closed:
        - "Tower of London"
        - "Borough Market"
        - "Westminster Abbey"
        - "National Gallery"
        - "British Museum"
        - "most_retail"
      open:
        - "Chinatown restaurants"
      transport: "No public transport"

    boxing_day:
      date: "2025-12-26"
      closed:
        - "National Gallery"
        - "Tower of London"
      open:
        - "Borough Market"
        - "Westminster Abbey"
        - "most attractions"

  events:
    changing_of_guard:
      dates:
        "2025-12-29": false  # Cancelled
        "2025-12-30": true   # Confirmed
      time: "11:00"
      arrive_early_minutes: 45

  seasonal:
    sunset_time: "15:55"
    school_holidays: true
    expected_crowds: "high"

# Spatial Constraints
spatial:
  clustering:
    max_walking_radius_km: 1.5
    preferred_walking_radius_km: 1.0

    defined_clusters:
      east_london:
        locations: ["Tower of London", "Tower Bridge"]
        parking: "Minories"
        constraint: "Must visit together (300m apart)"

      east_london_market:
        locations: ["Borough Market"]
        parking: "Snowsfields"
        constraint: "Separate from Tower due to Sunday closure"

      west_london:
        locations: ["Notting Hill", "Portobello Road", "Hyde Park", "Winter Wonderland", "Harrods"]
        parking: ["Q-Park Queensway", "Q-Park Park Lane"]
        max_moves: 2

      central_south:
        locations: ["Westminster Abbey", "London Eye", "South Bank"]
        parking: "Q-Park Westminster"

      west_end:
        locations: ["Covent Garden", "Soho", "West End", "Chinatown", "Trafalgar Square"]
        parking: "NCP Wardour Street"
        walkable: true

  parking:
    max_moves_per_day: 2
    preferred_moves_per_day: 1

# Booking Constraints
booking:
  required:
    - name: "West End Musical"
      date: "2025-12-26"
      time: "19:30"
      tickets: 5  # Not 7, infant can't attend
      priority: "CRITICAL"
      deadline: "ASAP"
      url: "https://officiallondontheatre.com/"

    - name: "Winter Wonderland"
      date: "2025-12-28"
      time: "14:00"
      tickets: 7
      priority: "CRITICAL"
      url: "https://hydeparkwinterwonderland.com/"

    - name: "Snow Centre Lessons"
      date: "2025-12-27"
      time: "11:00"
      tickets: 5  # Not 7, infant can't ski
      priority: "HIGH"
      url: "https://www.thesnowcentre.com/"

    - name: "Tower of London"
      date: "2025-12-29"
      time: "09:30"
      tickets: 7
      priority: "HIGH"
      url: "https://www.hrp.org.uk/tower-of-london/"

    - name: "London Eye"
      date: "2025-12-29"
      time: "16:30"
      tickets: 7
      priority: "HIGH"
      notes: "Book sunset slot"
      url: "https://www.londoneye.com/"

    - name: "Westminster Abbey"
      date: "2025-12-26"
      time: "13:00"
      tickets: 7
      priority: "MEDIUM"
      url: "https://www.westminster-abbey.org/"

  recommended:
    - name: "Lunch restaurant near Hyde Park"
      date: "2025-12-28"
      party_size: 7
      url: "OpenTable"

# Driving Constraints
driving:
  congestion_charge:
    daily_rate_gbp: 15
    operating_hours:
      weekday: "07:00-18:00"
      weekend: "12:00-18:00"
    christmas_suspension:
      start: "2025-12-25"
      end: "2026-01-01"
    applies_on: ["2025-12-24"]

  ulez:
    vehicle_compliant: true
    daily_rate_gbp: 12.50  # If non-compliant
    applies: false

# Weather Contingency Rules
weather:
  api: "weatherapi.com"
  check_frequency: "daily"

  thresholds:
    rain_probability_percent: 40
    temperature_celsius_min: 4
    wind_speed_mph_max: 20

  outdoor_activities:
    - "Portobello Road"
    - "Hyde Park"
    - "South Bank walk"
    - "Tower Bridge photos"
    - "Covent Garden"
    - "Winter Lights walk"

  indoor_alternatives:
    - "Harrods"
    - "British Museum"
    - "National Gallery"
    - "Shopping centres"
    - "Museums"

# Validation Thresholds
validation:
  route:
    time_difference_minutes: 10
    time_difference_percent: 20
    distance_difference_miles: 2

  timing:
    minimum_buffer_minutes: 15
    warn_if_buffer_below_minutes: 10

  clustering:
    tolerance_km: 0.5
```

---

## Hook Configuration

### File: `.claude/hooks.json`

```json
{
  "hooks": {
    "post_file_edit": [
      {
        "pattern": "task_context.md",
        "command": "claude-agent constraint-checker",
        "description": "Validate constraints when itinerary changes"
      },
      {
        "pattern": "constraints.yaml",
        "command": "claude-agent constraint-checker",
        "description": "Re-validate when constraints are modified"
      },
      {
        "pattern": "task_context.md",
        "match_content": "(coordinates|lat|lng|location)",
        "command": "claude-agent route-validator",
        "description": "Validate routes when locations change"
      }
    ],
    "scheduled": [
      {
        "cron": "0 8 * * *",
        "command": "claude-agent weather-contingency",
        "description": "Daily weather check at 8am"
      }
    ],
    "post_agent_complete": [
      {
        "agent": "constraint-checker",
        "condition": "changes_proposed",
        "command": "claude-agent map-generator --dry-run",
        "description": "Queue map update if changes proposed"
      }
    ]
  }
}
```

### Alternative: Claude Code Settings Hook

```json
// In ~/.claude/settings.json or project .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": {
          "tool_name": "Edit",
          "file_pattern": "**/task_context.md"
        },
        "command": ["bash", "-c", "echo 'Run constraint checker' && claude -p 'Run constraint checker agent on task_context.md'"]
      }
    ]
  }
}
```

---

## API Integration

### Environment Variables

```bash
# File: .env (gitignored)

# WeatherAPI.com
WEATHER_API_KEY=your_api_key_here
WEATHER_API_BASE_URL=https://api.weatherapi.com/v1

# OpenRouteService
ORS_API_KEY=your_api_key_here
ORS_API_BASE_URL=https://api.openrouteservice.org/v2

# GitHub (for creating issues)
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=whutabarat-sheffield/mutermuterukplanner
```

### API Signup Instructions

#### WeatherAPI.com
1. Go to https://www.weatherapi.com/signup.aspx
2. Sign up for free account
3. Copy API key from dashboard
4. Add to `.env` as `WEATHER_API_KEY`
5. Free tier: 1M calls/month

#### OpenRouteService
1. Go to https://openrouteservice.org/dev/#/signup
2. Create account and request API key
3. Copy API key from dashboard
4. Add to `.env` as `ORS_API_KEY`
5. Free tier: 2000 requests/day

---

## File Structure

```
mutermuterukplanner/
├── .claude/
│   ├── settings.json          # Claude Code settings with hooks
│   └── commands/
│       ├── constraint-checker.md   # Slash command definition
│       ├── weather-check.md
│       ├── route-validate.md
│       └── regenerate-maps.md
│
├── .env                        # API keys (gitignored)
├── .env.example                # Template for .env
│
├── constraints.yaml            # Constraint definitions
├── task_context.md             # Main itinerary document
├── daily-planner.html          # Interactive maps
│
├── proposed_changes.md         # Agent proposals (overwritten each run)
│
├── reports/                    # Generated reports
│   ├── constraint-report-2025-12-19-1430.md
│   ├── route-validation-2025-12-19-1430.md
│   └── weather-alert-2025-12-19-0800.md
│
├── docs/
│   ├── AGENT_DESIGN.md         # This document
│   └── CLAUDE.md               # Project guidance for Claude
│
└── agents/                     # Agent implementations (if needed)
    ├── constraint_checker.py
    ├── weather_contingency.py
    ├── route_validator.py
    └── map_generator.py
```

---

## Workflow

### Normal Operation Flow

```
1. User edits task_context.md
        │
        ▼
2. Hook triggers Constraint Checker
        │
        ├── Violations found?
        │   ├── YES → Create GitHub issues + report
        │   └── NO → Log success
        │
        ▼
3. Hook triggers Route Validator (if locations changed)
        │
        ├── Discrepancies found?
        │   ├── YES → Write to proposed_changes.md
        │   └── NO → Log success
        │
        ▼
4. User reviews proposed_changes.md
        │
        ├── Approve → User applies changes to task_context.md
        │              Hook triggers Map Generator
        │              Map Generator updates daily-planner.html
        │
        └── Reject → User ignores or modifies proposal
```

### Weather Check Flow

```
1. Scheduled trigger (daily at 8am)
   OR manual: /weather-check
        │
        ▼
2. Weather Contingency Agent runs
        │
        ├── Fetch 7-day forecast from WeatherAPI.com
        │
        ├── Compare with thresholds
        │   ├── Rain > 40%?
        │   ├── Temp < 4°C?
        │   └── Wind > 20 mph?
        │
        ├── Bad weather on trip days?
        │   ├── YES → Identify affected outdoor activities
        │   │         Find indoor alternatives
        │   │         Write swap proposal to proposed_changes.md
        │   │
        │   └── NO → Log "Weather OK" to report
        │
        ▼
3. User reviews proposed_changes.md
```

### Approval Workflow

All agents write to `proposed_changes.md`:

```markdown
# Proposed Changes
Last Updated: 2025-12-19 14:30

## Pending Proposals

### 1. Route Time Update (Route Validator)
**Status**: PENDING REVIEW
**Generated**: 2025-12-19 14:30

[Details...]

**To approve**: Update task_context.md with the corrected times.

---

### 2. Weather Contingency (Weather Agent)
**Status**: PENDING REVIEW
**Generated**: 2025-12-19 08:00

[Details...]

**To approve**: Swap the activities as described in task_context.md.

---

## Previously Approved
- [2025-12-18] Hotel location update ✓

## Previously Rejected
- [2025-12-17] Suggestion to skip Borough Market (user preference to keep)
```

---

## Implementation Plan

### Phase 1: Foundation (Priority)
1. Create `constraints.yaml` schema
2. Create `.env.example` template
3. Set up `reports/` directory
4. Create `proposed_changes.md` template

### Phase 2: Constraint Checker Agent
1. Implement constraint parser for `constraints.yaml`
2. Implement itinerary parser for `task_context.md`
3. Implement validation logic for each constraint type
4. Implement report generator
5. Implement GitHub issue creation
6. Create `/constraint-check` slash command
7. Configure hook trigger

### Phase 3: Weather Contingency Agent
1. Sign up for WeatherAPI.com (user action)
2. Implement API client
3. Implement threshold checker
4. Implement swap proposal logic
5. Create `/weather-check` slash command
6. Configure scheduled trigger

### Phase 4: Route Validator Agent
1. Sign up for OpenRouteService (user action)
2. Implement API client
3. Implement route extraction from itinerary
4. Implement comparison logic
5. Create `/validate-routes` slash command
6. Configure hook trigger

### Phase 5: Map Generator Agent
1. Implement itinerary parser for map data
2. Implement Leaflet.js code generator
3. Implement diff preview for proposed_changes.md
4. Create `/regenerate-maps` slash command
5. Configure post-approval trigger

---

## Open Questions

1. **Agent persistence**: Should agents maintain state between runs (e.g., track previously flagged issues)?

2. **Conflict resolution**: If multiple agents propose conflicting changes, how to prioritize?

3. **Rollback**: Should we maintain history of approved changes for rollback capability?

4. **Testing**: How to test agents without hitting API rate limits? Mock responses?

5. **Multi-trip support**: How to handle multiple trips in same repo? Separate directories?

---

## Appendix: Example Agent Prompts

### Constraint Checker Slash Command

```markdown
<!-- .claude/commands/constraint-check.md -->

Run the Constraint Checker agent:

1. Read constraints.yaml to load all constraint definitions
2. Read task_context.md to load current itinerary
3. For each constraint type (temporal, spatial, group, booking):
   - Validate all items against constraints
   - Record violations and warnings
4. Generate report in reports/constraint-report-YYYY-MM-DD-HHMM.md
5. For CRITICAL violations, create GitHub issues
6. Summarize findings to user
```

### Weather Check Slash Command

```markdown
<!-- .claude/commands/weather-check.md -->

Run the Weather Contingency agent:

1. Load trip dates from constraints.yaml
2. Fetch weather forecast from WeatherAPI.com for London
3. Check each trip day against thresholds:
   - Rain > 40%
   - Temperature < 4°C
   - Wind > 20 mph
4. Identify outdoor activities on bad weather days
5. Propose swaps with indoor alternatives
6. Write proposals to proposed_changes.md
```

---

**End of Design Document**

*Review requested. Please provide feedback on:*
1. Overall architecture
2. Constraints schema completeness
3. Agent specifications
4. Hook configuration approach
5. Any missing requirements
