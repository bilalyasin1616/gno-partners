# Bidding Optimization Tool — PRD

## Overview
A client-side tool for Amazon sellers to upload their Sponsored Products Campaign Report (30 days, daily granularity), aggregate the data into actionable metrics, and apply optimization rules per campaign.

## Problem
Manually reviewing daily campaign data in raw CSV format is tedious and error-prone. Sellers need aggregated views (30-day vs 7-day trends, recent spend patterns) and a structured way to decide which optimization rules to apply to each campaign.

## Architecture
- **Client-side only** — no backend required
- CSV parsing and aggregation run in a **Web Worker** to avoid blocking the UI
- Data displayed in **Glide Data Grid** (canvas-rendered, virtual scrolling, selection, copy)
- Single-session: no persistence, no database

## Input
Amazon Sponsored Products Campaign Report CSV with daily granularity (30 days).

### CSV Columns Used
| Column | Type | Usage |
|--------|------|-------|
| Date | string | Time-period grouping |
| Portfolio name | string | Display |
| Campaign Name | string | Primary grouping key |
| Status | string | Display (ENABLED/PAUSED) |
| Budget Amount | currency | Display + Budget Check |
| Impressions | number | Aggregate |
| Clicks | number | Aggregate |
| Spend | currency | Aggregate + yesterday/DBY |
| 7 Day Total Orders (#) | number | Aggregate as "Orders" |
| 7 Day Total Sales | currency | Aggregate as "Sales" |

## Output — Phase 1 (Data Display)

### Aggregated Campaign Table
All campaigns displayed (ENABLED and PAUSED). Metrics grouped with 30d and 7d side-by-side for easy comparison.

| Column | Calculation |
|--------|------------|
| Campaign Name | Grouping key from CSV |
| Status | ENABLED or PAUSED |
| Portfolio | From CSV |
| Budget | Budget Amount from CSV |
| Impressions (30d) | Sum all rows |
| Impressions (7d) | Sum last 7 date rows |
| Clicks (30d) | Sum all rows |
| Clicks (7d) | Sum last 7 date rows |
| Spend (30d) | Sum all rows |
| Spend (7d) | Sum last 7 date rows |
| Orders (30d) | Sum all rows |
| Orders (7d) | Sum last 7 date rows |
| Sales (30d) | Sum all rows |
| Sales (7d) | Sum last 7 date rows |
| ACOS (30d) | (30d Spend / 30d Sales) x 100 |
| ACOS (7d) | (7d Spend / 7d Sales) x 100 |
| ACOS Delta | ((7d ACOS - 30d ACOS) / 30d ACOS) x 100 |
| Spent Yesterday | Spend from the last date in CSV |
| Spent Day Before Yesterday | Spend from the 2nd-to-last date |
| Budget Check | Warning when yesterday spend >= 90% of budget |

### Default Sort Order
1. Group by **Portfolio** (alphabetical)
2. Within each portfolio, sort campaigns by **30d Sales** descending (highest sales first)

### Visual Indicators
- **ACOS Delta**: green when positive (ACOS improving), red when negative (worsening)
- **Budget Check**: warning icon when yesterday spend approaches budget
- **Status**: visual distinction between ENABLED and PAUSED campaigns

## Output — Phase 2 (Rules UI)

Per-campaign rule columns added to the grid:

| Rule | Input Type | Description |
|------|-----------|-------------|
| Lower bids for Bleeders w/ no Sales | Checkbox | Reduce bids for targets with clicks but no sales. Reduction % based on click count (TBD). |
| Lower bids for targets w/ ACOS higher than | % threshold input | User enters ACOS % — targets above this get bid reductions. |
| Increase bids to Targets w/ Low Clicks | Dropdown + custom | Presets: 3%, 5%, 6%, 10% or custom %. Increase bids for targets with 1 click or less in 30 days. |
| Increase bids for Targets with good ACOS | Dropdown + custom | Presets: 3%, 5%, 6%, 10% or custom %. Increase bids for targets with ACOS below threshold. |
| Good ACOS criteria | % threshold input | Defines "good ACOS" = ACOS lower than this value. |
| Change Campaign Budget | $ amount input | Set new budget for the campaign. |
| Pause Campaign | Checkbox | Mark campaign for pausing. |
| Notes | Text input | Free-form notes per campaign. |

## Output — Phase 3 (Bulk Export)
Export rule selections to a bulk operations file for execution.

## User Flow
1. Navigate to Bidding Optimization page
2. Upload SP Campaign Report CSV (drag-and-drop or file picker)
3. CSV parsed and aggregated in Web Worker
4. Aggregated data displayed in Glide Data Grid
5. (Phase 2) Apply rules per campaign
6. (Phase 3) Export decisions to bulk operations file

## Tech Stack
- **CSV Parsing**: PapaParse (in Web Worker)
- **Data Grid**: Glide Data Grid
- **Testing**: Vitest (TDD)
- **Routing**: react-router-dom
