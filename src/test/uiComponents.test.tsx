import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';
import { IcSelectorModal } from '../components/IcSelectorModal';
import { InputSection } from '../components/InputSection';

describe('UI Components', () => {
  it('renders Header with branding, zoom, undo/redo, and practical buttons', () => {
    const onOpenExp = vi.fn();
    const onOpenDiag = vi.fn();
    const onClear = vi.fn();
    const onReset = vi.fn();

    render(
      <Header
        onOpenExperiments={onOpenExp}
        onOpenDiagnostics={onOpenDiag}
        onOpenPinouts={vi.fn()}
        diagStatus="ok"
        wireColor="auto"
        onWireColorChange={vi.fn()}
        zoom={1.0}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onZoomReset={vi.fn()}
        onUndo={vi.fn()}
        onRedo={vi.fn()}
        canUndo={true}
        canRedo={false}
        onClearWires={onClear}
        onResetBoard={onReset}
      />
    );

    expect(screen.getByText('DLCO Pin-to-Pin Virtual Trainer Kit')).toBeInTheDocument();
    expect(screen.getByText('HARDWARE LAB INSTRUMENT')).toBeInTheDocument();

    const expBtn = screen.getByText(/Lab Practicals & Viva/i);
    fireEvent.click(expBtn);
    expect(onOpenExp).toHaveBeenCalled();

    const clearBtn = screen.getByText('Clear Wires');
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalled();
  });

  it('renders IcSelectorModal with all 9 IC cards', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();

    render(
      <IcSelectorModal
        isOpen={true}
        socketId="U1"
        onClose={onClose}
        onSelectIc={onSelect}
      />
    );

    expect(screen.getByText(/Insert IC into Socket U1/i)).toBeInTheDocument();

    // Verify all 9 ICs are displayed in the modal
    const expectedIcs = ['7400', '7404', '7408', '7432', '7486', '74151', '74153', '7476', '7490'];
    expectedIcs.forEach(ic => {
      expect(screen.getByText(ic)).toBeInTheDocument();
    });

    // Click 74153 card to insert
    const ic74153 = screen.getByText('74153');
    fireEvent.click(ic74153);
    expect(onSelect).toHaveBeenCalledWith('U1', '74153');
    expect(onClose).toHaveBeenCalled();
  });

  it('renders InputSection and toggles switches', () => {
    const onToggle = vi.fn();
    const switches: Record<number, number> = {};
    for (let i = 1; i <= 16; i++) switches[i] = 0;

    render(
      <InputSection
        switches={switches}
        onToggleSwitch={onToggle}
        selectedTerminal={null}
        onTerminalClick={vi.fn()}
        connectedTerminals={new Set()}
      />
    );

    expect(screen.getByText('INPUT LOGIC SWITCHES')).toBeInTheDocument();
    expect(screen.getByText('S1')).toBeInTheDocument();
    expect(screen.getByText('S16')).toBeInTheDocument();

    const sw1 = document.getElementById('sw_toggle_1');
    expect(sw1).toBeInTheDocument();
    if (sw1) {
      fireEvent.click(sw1);
      expect(onToggle).toHaveBeenCalledWith(1);
    }
  });
});
