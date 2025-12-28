'use client';

import { useState, useEffect } from 'react';
import { Target, Pencil, Check, X, PlusCircle } from 'lucide-react';
import { SavingForm } from './SavingForm';

interface SavingsGoalWidgetProps {
    currentSavings: number;
}

export function SavingsGoalWidget({ currentSavings }: SavingsGoalWidgetProps) {
    const [goal, setGoal] = useState<number>(0);
    const [isEditing, setIsEditing] = useState(false);
    const [tempGoal, setTempGoal] = useState('');
    const [showSavingForm, setShowSavingForm] = useState(false);

    useEffect(() => {
        const savedGoal = localStorage.getItem('savings_goal');
        if (savedGoal) {
            setGoal(parseFloat(savedGoal));
        } else {
            // Default goal: 100000 or some non-zero to encourage saving
            setGoal(100000);
        }
    }, []);

    const handleSave = () => {
        const val = parseFloat(tempGoal);
        if (!isNaN(val) && val > 0) {
            setGoal(val);
            localStorage.setItem('savings_goal', val.toString());
        }
        setIsEditing(false);
    };

    const percentage = goal > 0 ? Math.min(100, Math.max(0, (currentSavings / goal) * 100)) : 0;
    const isGoalReached = currentSavings >= goal;

    return (
        <section className="section-card" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.05) 100%)',
            position: 'relative'
        }}>
            <button
                onClick={() => {
                    setTempGoal(goal.toString());
                    setIsEditing(true);
                }}
                className="edit-goal-btn"
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Editar Meta"
            >
                <Pencil size={16} />
            </button>

            <div style={{ padding: '2rem', borderRadius: '50%', background: isGoalReached ? 'rgba(16, 185, 129, 0.1)' : 'var(--success-bg)', color: isGoalReached ? '#10b981' : 'var(--success)', marginBottom: '1.5rem', transition: '0.3s' }}>
                <Target size={48} />
            </div>

            {isEditing ? (
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="number"
                        value={tempGoal}
                        onChange={(e) => setTempGoal(e.target.value)}
                        autoFocus
                        style={{
                            background: 'var(--bg-main)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-main)',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            width: '120px',
                            textAlign: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 700
                        }}
                    />
                    <button onClick={handleSave} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} /></button>
                    <button onClick={() => setIsEditing(false)} style={{ background: 'var(--bg-card-hover)', color: 'var(--text-dim)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                </div>
            ) : (
                <>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Meta de Ahorro</h2>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Meta: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${goal.toLocaleString()}</span>
                    </p>
                </>
            )}

            <div style={{ width: '100%', position: 'relative', height: '12px', background: 'var(--bg-card-hover)', borderRadius: '99px', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: isGoalReached ? '#10b981' : 'linear-gradient(to right, var(--primary), var(--secondary))',
                    borderRadius: '99px',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: isGoalReached ? '#10b981' : 'var(--text-main)' }}>
                    ${currentSavings.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                    {isGoalReached ? '¡Meta Alcanzada!' : 'Ahorrado este mes'}
                </span>
            </div>

            {/* Save Button */}
            <button
                onClick={() => setShowSavingForm(true)}
                style={{
                    marginTop: '1.5rem',
                    background: 'var(--bg-card-hover)',
                    border: '1px solid var(--border)',
                    color: 'var(--primary)',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: '0.2s'
                }}
            >
                <PlusCircle size={16} />
                Guardar Ahorro
            </button>

            {showSavingForm && (
                <SavingForm
                    initialAmount={currentSavings > 0 ? currentSavings : 0}
                    onClose={() => setShowSavingForm(false)}
                />
            )}
        </section>
    );
}
