import { describe, it, expect } from 'vitest';
import { GridCellKind } from '@glideapps/glide-data-grid';
import { textCell, numberCell, percentCell, editableTextCell, checkboxCell, getDataCellContent } from './cells';
import type { AggregatedCampaign } from '../../types';

describe('textCell', () => {
  it('creates a read-only text cell', () => {
    const cell = textCell('hello');
    expect(cell.kind).toBe(GridCellKind.Text);
    expect(cell.allowOverlay).toBe(false);
    if (cell.kind === GridCellKind.Text) {
      expect(cell.data).toBe('hello');
      expect(cell.displayData).toBe('hello');
    }
  });
});

describe('numberCell', () => {
  it('formats with currency prefix', () => {
    const cell = numberCell(1234.5, '$');
    if (cell.kind === GridCellKind.Number) {
      expect(cell.displayData).toBe('$1,234.5');
    }
  });

  it('formats without prefix', () => {
    const cell = numberCell(500);
    if (cell.kind === GridCellKind.Number) {
      expect(cell.displayData).toBe('500');
    }
  });
});

describe('percentCell', () => {
  it('formats with percent sign', () => {
    const cell = percentCell(12.345);
    if (cell.kind === GridCellKind.Number) {
      expect(cell.displayData).toBe('12.35%');
    }
  });

  it('shows 0% for zero', () => {
    const cell = percentCell(0);
    if (cell.kind === GridCellKind.Number) {
      expect(cell.displayData).toBe('0%');
    }
  });
});

describe('editableTextCell', () => {
  it('is editable with overlay', () => {
    const cell = editableTextCell('test');
    expect(cell.allowOverlay).toBe(true);
    if (cell.kind === GridCellKind.Text) {
      expect(cell.data).toBe('test');
      expect(cell.displayData).toBe('test');
    }
  });

  it('adds suffix to display', () => {
    const cell = editableTextCell('10', '%');
    if (cell.kind === GridCellKind.Text) {
      expect(cell.data).toBe('10');
      expect(cell.displayData).toBe('10%');
    }
  });

  it('adds prefix to display', () => {
    const cell = editableTextCell('100', '', '$');
    if (cell.kind === GridCellKind.Text) {
      expect(cell.data).toBe('100');
      expect(cell.displayData).toBe('$100');
    }
  });

  it('shows empty display for empty value', () => {
    const cell = editableTextCell('', '%');
    if (cell.kind === GridCellKind.Text) {
      expect(cell.displayData).toBe('');
    }
  });
});

describe('checkboxCell', () => {
  it('creates boolean cell', () => {
    const cell = checkboxCell(true);
    expect(cell.kind).toBe(GridCellKind.Boolean);
    if (cell.kind === GridCellKind.Boolean) {
      expect(cell.data).toBe(true);
    }
  });
});

describe('getDataCellContent', () => {
  const campaign = {
    campaignName: 'Test Camp',
    status: 'ENABLED',
    portfolio: 'Port A',
    budget: 100,
    impressions30d: 5000,
    spend30d: 250,
    acosDelta: -15.5,
    budgetCheck: true,
  } as AggregatedCampaign;

  it('renders text fields', () => {
    const cell = getDataCellContent(campaign, 0);
    if (cell.kind === GridCellKind.Text) {
      expect(cell.data).toBe('Test Camp');
    }
  });

  it('renders currency fields with $ prefix', () => {
    const cell = getDataCellContent(campaign, 2);
    if (cell.kind === GridCellKind.Number) {
      expect(cell.displayData).toBe('$100');
    }
  });

  it('renders budgetCheck as warning icon', () => {
    const cell = getDataCellContent(campaign, 18);
    if (cell.kind === GridCellKind.Text) {
      expect(cell.data).toBe('\u26A0');
    }
  });
});
