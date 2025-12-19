# Constraint Validation Report

**Generated**: 2025-12-19 15:00
**Agent**: Constraint Checker v1.0
**Files Analyzed**: `task_context.md`, `constraints.yaml`

---

## Summary

| Category | Total | Passed | Warnings | Violations |
|----------|-------|--------|----------|------------|
| Temporal | 12 | 12 | 0 | 0 |
| Spatial | 6 | 6 | 0 | 0 |
| Group | 4 | 4 | 0 | 0 |
| Booking | 6 | 0 | 6 | 0 |
| Driving | 4 | 4 | 0 | 0 |
| **TOTAL** | **32** | **26** | **6** | **0** |

**Overall Status**: PASS with warnings

---

## Violations (CRITICAL)

*No critical violations found.*

---

## Warnings

### 1. [BOOKING] West End Musical - Not Yet Booked
- **Priority**: CRITICAL
- **Date**: December 26, 2025 at 19:30
- **Tickets**: 5 (infant cannot attend)
- **Status**: Booking required but not confirmed
- **Action**: Book ASAP at https://officiallondontheatre.com/
- **Note**: Boxing Day shows sell out quickly

### 2. [BOOKING] Winter Wonderland Entry - Not Yet Booked
- **Priority**: CRITICAL
- **Date**: December 28, 2025 at 14:00
- **Tickets**: 7
- **Status**: Booking required but not confirmed
- **Action**: Book now at https://hydeparkwinterwonderland.com/
- **Note**: School holidays = high demand

### 3. [BOOKING] Snow Centre Ski Lessons - Not Yet Booked
- **Priority**: HIGH
- **Date**: December 27, 2025 at 11:00
- **Tickets**: 5 (infant cannot ski)
- **Status**: Booking required but not confirmed
- **Action**: Book at https://www.thesnowcentre.com/
- **Note**: 2hr beginner lesson, school holidays busy

### 4. [BOOKING] Tower of London - Not Yet Booked
- **Priority**: HIGH
- **Date**: December 29, 2025 at 09:30
- **Tickets**: 7
- **Status**: Booking required but not confirmed
- **Action**: Book at https://www.hrp.org.uk/tower-of-london/
- **Cost**: £192 total

### 5. [BOOKING] London Eye - Not Yet Booked
- **Priority**: HIGH
- **Date**: December 29, 2025 at 16:30 (sunset slot)
- **Tickets**: 7
- **Status**: Booking required but not confirmed
- **Action**: Book at https://www.londoneye.com/
- **Cost**: £210 total

### 6. [BOOKING] Westminster Abbey - Not Yet Booked
- **Priority**: MEDIUM
- **Date**: December 26, 2025 at 13:00
- **Tickets**: 7
- **Status**: Booking required but not confirmed
- **Action**: Book at https://www.westminster-abbey.org/
- **Cost**: £169 total

---

## Passed Checks

### Temporal Constraints

| Check | Status | Details |
|-------|--------|---------|
| Borough Market not on Sunday | PASS | Scheduled Dec 26 (Thursday) |
| Portobello Road on Saturday | PASS | Scheduled Dec 28 (Saturday) - full market |
| Tower of London not on Dec 25-26 | PASS | Scheduled Dec 29 (Sunday) |
| Changing of Guard on Dec 30 | PASS | Correctly scheduled on confirmed date |
| National Gallery not on Dec 25-26 | PASS | Scheduled Dec 30 (Monday) |
| British Museum not on Dec 25 | PASS | Scheduled Dec 30 (Monday) |
| Westminster Abbey not on Dec 25 | PASS | Scheduled Dec 26 (Boxing Day - open) |
| Christmas Day activities appropriate | PASS | Only South Bank walk + Chinatown (open) |
| London Eye sunset timing | PASS | 16:30 slot aligns with ~15:55 sunset |
| Winter Wonderland hours | PASS | 14:00-17:00 within 10:00-22:00 operating hours |
| Harrods on Saturday | PASS | Dec 28 Saturday = full hours (10:00-21:00) |
| Borough Market opening time | PASS | Arrival 10:15, opens 10:00 (15 min buffer) |

### Spatial Constraints

| Check | Status | Details |
|-------|--------|---------|
| Tower of London + Tower Bridge clustered | PASS | Both on Dec 29, 300m apart |
| West London clustering | PASS | Dec 28: Portobello → Hyde Park → Harrods (2 parking moves) |
| Parking moves per day ≤ 2 | PASS | All days have ≤ 2 parking moves |
| Walking radius compliance | PASS | All zones within 1.5km radius |
| Borough Market separate from Tower | PASS | Dec 26 vs Dec 29 (avoids Sunday closure conflict) |
| Dec 30 tube-accessible only | PASS | Buckingham, National Gallery, British Museum all tube-accessible |

### Group Constraints

| Check | Status | Details |
|-------|--------|---------|
| Infant not at musical | PASS | 5 tickets only, supervision arranged (driver + 1 parent) |
| Infant not skiing | PASS | 5 participants only, supervision arranged (driver + 1 parent at café) |
| Parent supervision documented | PASS | Infant care plan in task_context.md for Dec 26 + Dec 27 |
| Ticket counts correct | PASS | 5 for restricted activities, 7 for others |

### Driving Constraints

| Check | Status | Details |
|-------|--------|---------|
| Congestion charge days | PASS | Only Dec 24 incurs charge (Dec 25-29 suspended) |
| ULEZ compliance | PASS | Vehicle confirmed ULEZ compliant |
| Driver day off | PASS | Dec 30 has no driving (guests use tube) |
| Daily hours within limit | PASS | Dec 28 + Dec 29 have 3hr OT each (documented and accepted) |

---

## Booking Priority List

| Priority | Item | Date | Tickets | Cost | URL |
|----------|------|------|---------|------|-----|
| CRITICAL | West End Musical | Dec 26 19:30 | 5 | £250 | [Book](https://officiallondontheatre.com/) |
| CRITICAL | Winter Wonderland | Dec 28 14:00 | 7 | £145 | [Book](https://hydeparkwinterwonderland.com/) |
| HIGH | Snow Centre Lessons | Dec 27 11:00 | 5 | £295 | [Book](https://www.thesnowcentre.com/) |
| HIGH | Tower of London | Dec 29 09:30 | 7 | £192 | [Book](https://www.hrp.org.uk/tower-of-london/) |
| HIGH | London Eye | Dec 29 16:30 | 7 | £210 | [Book](https://www.londoneye.com/) |
| MEDIUM | Westminster Abbey | Dec 26 13:00 | 7 | £169 | [Book](https://www.westminster-abbey.org/) |

**Total Booking Cost**: £1,261

---

## Recommendations

1. **Immediate Action**: Book West End Musical and Winter Wonderland TODAY - these are CRITICAL priority
2. **This Week**: Book Snow Centre, Tower of London, and London Eye
3. **Before Trip**: Book Westminster Abbey and lunch restaurant

---

## Next Validation

- Run `/check-constraints` after any changes to `task_context.md`
- Run `/check-weather` to check forecast before trip
- Run `/validate-routes` to verify drive time estimates

---

*Report generated by Constraint Checker Agent*
