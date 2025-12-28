'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthSelectorProps {
    name: string;
    defaultValue?: string; // Format: YYYY-MM
    required?: boolean;
}

export function MonthSelector({ name, defaultValue, required }: MonthSelectorProps) {
    // Parse initial value or use current date, forcing 2026 as minimum
    const today = new Date();
    const initialDate = defaultValue ? new Date(defaultValue + '-01T00:00:00') : today;
    const initialYear = initialDate.getFullYear();

    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth()); // 0-11
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const months = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const handleMonthSelect = (index: number) => {
        setSelectedMonth(index);
        setIsOpen(false);
    };

    const handleYearChange = (delta: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedYear(prev => prev + delta);
    };

    // Format value for the hidden input (YYYY-MM)
    const hiddenValue = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;

    // Display text
    const displayText = `${months[selectedMonth]} ${selectedYear}`;

    return (
        <div className="month-selector-container" ref={dropdownRef} style={{ position: 'relative' }}>
            {/* Hidden Input for Form Submission */}
            <input type="hidden" name={name} value={hiddenValue} />

            {/* Display Wrapper */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="input-premium"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{displayText}</span>
                <Calendar size={18} color="var(--text-dim)" />
            </div>

            {/* Custom Dropdown */}
            {isOpen && (
                <div className="animate-ready" style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '100%',
                    background: '#1a1d26',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '0.75rem',
                    zIndex: 100,
                    boxShadow: '0 20px 50px -10px rgba(0,0,0,0.6)'
                }}>
                    {/* Year Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        <button
                            type="button"
                            onClick={(e) => handleYearChange(-1, e)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                borderRadius: '8px',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-main)',
                                cursor: 'pointer'
                            }}
                        >
                            <ChevronLeft size={14} />
                        </button>

                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{selectedYear}</span>

                        <button
                            type="button"
                            onClick={(e) => handleYearChange(1, e)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                borderRadius: '8px',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-main)',
                                cursor: 'pointer'
                            }}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Months Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem' }}>
                        {months.map((m, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleMonthSelect(i)}
                                style={{
                                    background: selectedMonth === i ? 'var(--primary)' : 'transparent',
                                    color: selectedMonth === i ? '#fff' : 'var(--text-dim)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.4rem 0.25rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: '0.2s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedMonth !== i) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    if (selectedMonth !== i) e.currentTarget.style.color = 'var(--text-main)';
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedMonth !== i) e.currentTarget.style.background = 'transparent';
                                    if (selectedMonth !== i) e.currentTarget.style.color = 'var(--text-dim)';
                                }}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
