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
- **ACOS Delta**: green when negative (lower 7d ACOS = improving), red when positive (higher 7d ACOS = worsening)
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

## Output — Phase 3 (Apply Rules to Bulk Operations File)

### Overview
The operator sets rules per campaign in Phases 1-2. Phase 3 applies those rules to the Amazon Bulk Operations XLSX file, modifying target-level bids and campaign-level settings, then exports the modified file for re-upload to Amazon.

### Input
Amazon Bulk Operations XLSX — downloaded from Amazon Ad Manager's Bulk Operations page. Only the **Sponsored Products Campaigns** tab is used.

### Bulk Sheet Columns (Sponsored Products Campaigns tab)
| Column | Used for |
|--------|---------|
| Product | Always "Sponsored Products" |
| Entity | Row type: Campaign, Ad Group, Keyword, Product Targeting, Campaign Negative Keyword |
| Operation | Set to "Update" for modified rows |
| Campaign ID | Match campaigns |
| Campaign Name | Match campaigns to rule selections |
| State | Set to "paused" for Pause Campaign rule |
| Daily Budget | Set new value for Change Budget rule |
| Bid | Modified for target-level bid rules |
| Clicks | Used to evaluate Bleeders and Low Clicks rules |
| Orders | Used to identify targets with 0 sales |
| ACOS | Used to evaluate ACOS threshold rules |

### Rule Application Logic

| Rule | Applies to | Logic |
|------|-----------|-------|
| **Lower Bleeders** | Keyword & Product Targeting rows with 0 Orders | 6-7 clicks → bid × 0.95, 8-14 clicks → bid × 0.90, 14+ clicks → State = "paused" |
| **Lower ACOS >** | Keyword & Product Targeting rows with Orders > 0 and ACOS > threshold | bid × (1 - (targetACOS - threshold) / 100) |
| **Inc Low Clicks** | Keyword & Product Targeting rows with ≤1 click | bid × (1 + percentage / 100) |
| **Inc Good ACOS** | Keyword & Product Targeting rows with Orders > 0 and ACOS < goodAcosThreshold | bid × (1 + percentage / 100) |
| **Change Budget** | Campaign row | Daily Budget = new value |
| **Pause Campaign** | Campaign row | State = "paused" |

For every modified row, set `Operation` = "Update".

### UI Flow
1. After setting rules in the grid (Phase 2), a **sticky bottom bar** appears with an "Apply" button
2. User clicks "Apply" → prompted to upload the Bulk Operations XLSX file
3. Rules are applied to the XLSX in a Web Worker (matching campaigns by Campaign Name)
4. A "Download" button appears to download the modified XLSX
5. User uploads the modified file to Amazon Ad Manager

### Technical Notes
- XLSX processing uses a library like SheetJS (xlsx) for reading/writing Excel files
- Processing runs in a Web Worker to avoid UI blocking
- Only rows belonging to campaigns with active rules are modified
- Unmodified rows and other tabs are preserved as-is

## User Flow
1. Navigate to Bidding Optimization page
2. Upload SP Campaign Report CSV (drag-and-drop or file picker)
3. CSV parsed and aggregated in Web Worker
4. Aggregated data displayed in Glide Data Grid
5. (Phase 2) Set rules per campaign in the grid
6. (Phase 3) Click "Apply" in sticky bottom bar → upload Bulk Operations XLSX → download modified file → upload to Amazon

## Tech Stack
- **CSV Parsing**: PapaParse (in Web Worker)
- **XLSX Processing**: SheetJS / xlsx (in Web Worker)
- **Data Grid**: Glide Data Grid
- **Testing**: Vitest (TDD)
- **Routing**: wouter
