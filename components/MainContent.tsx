import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import type { GameState, Exercise, PainLog, Achievement } from '../types';
import { WORKOUTS } from '../constants';

type MainContentProps = {
    gameState: GameState;
    onWorkoutCompletion: (dayId: string) => void;
    onSavePainDiary: (log: PainLog) => void;
    getXPForLevel: (level: number) => number;
};

const ProgressTab: React.FC<{ gameState: GameState; getXPForLevel: (level: number) => number; }> = ({ gameState, getXPForLevel }) => {
    const xpNeeded = getXPForLevel(gameState.level);
    const progressPercent = Math.round((gameState.xp / xpNeeded) * 100);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-600">Tu Progreso</h3>
            <div className="bg-white p-4 rounded-lg shadow-inner border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-slate-700">Nivel {gameState.level}</p>
                    <p className="text-sm font-semibold">{Math.round(gameState.xp)} / {Math.round(xpNeeded)} XP</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                    <div className="progress-bar-inner bg-emerald-500 h-4 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="text-center mt-4">
                    <span className="text-3xl font-bold text-orange-500">{gameState.dailyStreak}</span> <i className="fas fa-fire text-orange-500 text-2xl"></i> <span className="font-semibold">Días de Racha</span>
                </div>
            </div>
            <h3 className="text-xl font-semibold text-emerald-600 mt-6">Logros</h3>
            <div className="space-y-2">
                {Object.values(gameState.achievements).map((ach: Achievement) => (
                    <div key={ach.name} className={`achievement ${ach.unlocked ? 'unlocked' : 'locked'} flex items-center gap-4 p-3 bg-slate-100 rounded-lg`}>
                        <i className={`fas ${ach.icon} text-3xl w-8 text-center ${ach.unlocked ? 'text-yellow-400' : 'text-slate-400'}`}></i>
                        <div>
                            <p className="font-bold text-slate-700">{ach.name}</p>
                            <p className="text-sm text-slate-500">{ach.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PainDiaryTab: React.FC<{ painDiary: GameState['painDiary']; onSavePainDiary: (log: PainLog) => void; }> = ({ painDiary, onSavePainDiary }) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = painDiary[today];

    const [pain, setPain] = useState(todayEntry?.pain || 3);
    const [stress, setStress] = useState(todayEntry?.stress || 4);
    const [sleep, setSleep] = useState(todayEntry?.sleep || 3);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const handleSave = () => {
        onSavePainDiary({ pain, stress, sleep });
    };

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const sortedDates = Object.keys(painDiary).sort();
        const labels = sortedDates.map(date => {
            const d = new Date(date);
            d.setUTCHours(12);
            return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        });
        const painData = sortedDates.map(date => painDiary[date].pain);

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nivel de Dolor Medio (0-10)',
                    data: painData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#10b981',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, max: 10, title: { display: true, text: 'Nivel de Dolor' } } },
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context: any) => `Dolor: ${context.raw}` } } }
            }
        });
        
        return () => {
            chartInstance.current?.destroy();
        }
    }, [painDiary]);


    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-emerald-600">Registro Diario de Sensaciones</h3>
                <p className="text-sm text-slate-500">Registra tus datos una vez al día para ver tu evolución.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                        <label htmlFor="pain-level" className="block text-sm font-medium text-slate-700">Dolor medio del día (0-10)</label>
                        <input type="range" id="pain-level" min="0" max="10" value={pain} onChange={e => setPain(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" disabled={!!todayEntry} />
                        <div className="text-center font-bold text-emerald-600">{pain}</div>
                    </div>
                    <div>
                        <label htmlFor="stress-level" className="block text-sm font-medium text-slate-700">Nivel de estrés (0-10)</label>
                        <input type="range" id="stress-level" min="0" max="10" value={stress} onChange={e => setStress(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" disabled={!!todayEntry} />
                        <div className="text-center font-bold text-emerald-600">{stress}</div>
                    </div>
                    <div>
                        <label htmlFor="sleep-quality" className="block text-sm font-medium text-slate-700">Calidad del sueño</label>
                        <select id="sleep-quality" value={sleep} onChange={e => setSleep(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md" disabled={!!todayEntry}>
                            <option value="3">Buena</option>
                            <option value="2">Regular</option>
                            <option value="1">Mala</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleSave} disabled={!!todayEntry} className={`w-full text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md ${!!todayEntry ? 'bg-green-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                    {!!todayEntry ? <><i className="fas fa-check mr-2"></i>Registro de Hoy Guardado</> : <><i className="fas fa-save mr-2"></i>Guardar Registro de Hoy</>}
                </button>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-emerald-600">Evolución del Dolor</h3>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

const WorkoutCard: React.FC<{ exercise: Exercise; dayId: string; isChecked: boolean; isDayCompleted: boolean; onToggle: (isChecked: boolean) => void; }> = ({ exercise, dayId, isChecked, isDayCompleted, onToggle }) => {
    const exerciseId = `${dayId}-${exercise.name.replace(/\s+/g, '-')}`;
    return (
        <div className="workout-card bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
                <input type="checkbox" id={exerciseId} checked={isChecked} onChange={(e) => onToggle(e.target.checked)} className="h-6 w-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mr-4" disabled={isDayCompleted} />
                <label htmlFor={exerciseId} className="cursor-pointer">
                    <p className="font-semibold text-slate-700">{exercise.name}</p>
                    <p className="text-sm text-slate-500">{exercise.sets} | <span className="font-medium text-emerald-600">{exercise.rpe}</span></p>
                </label>
            </div>
            {exercise.video !== '#' && <a href={exercise.video} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600 text-2xl"><i className="fab fa-youtube"></i></a>}
        </div>
    );
};

const WorkoutTab: React.FC<{ dayId: string; title: string; onWorkoutCompletion: (dayId: string) => void; completedWorkouts: GameState['completedWorkouts'] }> = ({ dayId, title, onWorkoutCompletion, completedWorkouts }) => {
    const todayStr = new Date().toDateString();
    const isDayCompleted = completedWorkouts[dayId] === todayStr;

    const getInitialCheckboxState = useCallback(() => {
        if (isDayCompleted) {
            return WORKOUTS[dayId].reduce((acc, ex) => ({ ...acc, [ex.name]: true }), {});
        }
        const savedState = localStorage.getItem(`checkboxes_${dayId}_${todayStr}`);
        return savedState ? JSON.parse(savedState) : {};
    }, [dayId, todayStr, isDayCompleted]);

    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(getInitialCheckboxState);

    const handleToggle = (exerciseName: string, isChecked: boolean) => {
        const newState = { ...checkedState, [exerciseName]: isChecked };
        setCheckedState(newState);
        localStorage.setItem(`checkboxes_${dayId}_${todayStr}`, JSON.stringify(newState));
    };

    useEffect(() => {
        const allChecked = WORKOUTS[dayId].every(ex => checkedState[ex.name]);
        if (allChecked && !isDayCompleted) {
            onWorkoutCompletion(dayId);
        }
    }, [checkedState, dayId, onWorkoutCompletion, isDayCompleted]);
    
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-600">{title}</h3>
            {WORKOUTS[dayId].map(ex => (
                <WorkoutCard 
                    key={ex.name} 
                    exercise={ex} 
                    dayId={dayId} 
                    isChecked={!!checkedState[ex.name]}
                    isDayCompleted={isDayCompleted}
                    onToggle={(isChecked) => handleToggle(ex.name, isChecked)} 
                />
            ))}
        </div>
    );
};


const MainContent: React.FC<MainContentProps> = ({ gameState, onWorkoutCompletion, onSavePainDiary, getXPForLevel }) => {
    const [activeTab, setActiveTab] = useState('daily');
    const tabs = [
        { id: 'progress', label: 'Progreso', icon: 'fa-trophy' },
        { id: 'diary', label: 'Diario', icon: 'fa-book-medical' },
        { id: 'daily', label: 'Activación', icon: 'fa-sun' },
        { id: 'warmup', label: 'Calentamiento', icon: 'fa-fire' },
        { id: 'day1', label: 'Día 1' },
        { id: 'day2', label: 'Día 2' },
        { id: 'day3', label: 'Día 3' },
    ];

    const workoutTitles: { [key: string]: string } = {
        daily: 'Higiene Postural y Activación (RPE 5)',
        warmup: 'Calentamiento Específico (Antes de cada sesión de Fuerza)',
        day1: 'Día 1: Full Body',
        day2: 'Día 2: Full Body',
        day3: 'Día 3: Full Body',
    };

    return (
        <main className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap text-slate-500 hover:text-emerald-600 ${activeTab === tab.id ? 'tab-active' : ''}`}>
                                {tab.icon && <i className={`fas ${tab.icon} mr-2`}></i>}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div>
                    {activeTab === 'progress' && <ProgressTab gameState={gameState} getXPForLevel={getXPForLevel}/>}
                    {activeTab === 'diary' && <PainDiaryTab painDiary={gameState.painDiary} onSavePainDiary={onSavePainDiary}/>}
                    {['daily', 'warmup', 'day1', 'day2', 'day3'].includes(activeTab) && (
                        <WorkoutTab 
                            dayId={activeTab} 
                            title={workoutTitles[activeTab]} 
                            onWorkoutCompletion={onWorkoutCompletion}
                            completedWorkouts={gameState.completedWorkouts}
                        />
                    )}
                </div>
            </div>
        </main>
    );
};

export default MainContent;