import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, ChatMessage, PainLog, ToastInfo } from './types';
import { INITIAL_GAME_STATE, INITIAL_ACHIEVEMENTS } from './constants';
import { streamGeminiResponse, streamAnalyzeSensation } from './services/geminiService';
import MainContent from './components/MainContent';
import ChatAside from './components/ChatAside';

const Header: React.FC = () => (
    <header className="text-center mb-10">
        <div className="flex justify-center items-center gap-4 mb-4">
            <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="currentColor" fillOpacity="0.2"/>
                <path d="M15.8925 8.35255C15.5525 7.98255 15.0125 7.91255 14.5825 8.16255L11.4325 10.0525L10.0625 9.16255C9.59255 8.86255 8.99255 8.98255 8.65255 9.41255L7.22255 11.2425C6.88255 11.6725 6.98255 12.2825 7.45255 12.5825L10.5325 14.7225C10.8325 14.9325 11.2425 14.9325 11.5425 14.7225L16.0325 11.4825C16.5025 11.1825 16.6325 10.5725 16.2825 10.1425L15.8925 9.64255V8.35255Z" fill="currentColor"/>
                <path d="M12 15L11 17H13L12 15Z" fill="currentColor"/>
            </svg>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Coach de Recuperación</h1>
        </div>
        <p className="text-lg text-slate-600">Sube de nivel tu recuperación. ¡Cada repetición cuenta!</p>
    </header>
);

const Toast: React.FC<ToastInfo & { onDismiss: () => void }> = ({ message, title, icon, iconColor, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 6000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="toast-notification fixed bottom-5 right-5 bg-slate-800 text-white p-4 rounded-lg shadow-xl transform translate-y-24 opacity-0 transition-all duration-500 z-50 flex items-center gap-4 max-w-sm show">
            <i className={`fas ${icon} text-3xl ${iconColor}`}></i>
            <div>
                <p className="font-bold">{title}</p>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};

const InfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-3xl" aria-label="Cerrar modal">
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-emerald-600 mb-4">Tu Coach de Recuperación Personalizado</h2>
                <div className="text-slate-700 space-y-3 max-h-[70vh] overflow-y-auto pr-3">
                    <h3 className="font-semibold text-lg text-slate-800">Filosofía y Principios Clave</h3>
                    <p>Esta primera fase de tu recuperación se rige por principios innegociables diseñados para construir una base sólida y a prueba de lesiones. El objetivo no es la fatiga, sino la calidad y el control.</p>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                        <h4 className="font-bold text-slate-800">Escala de Dolor (0-10): Tu límite es 3</h4>
                        <p className="text-sm">Cualquier molestia por encima de 3 durante un ejercicio es una señal para parar, reducir el peso o ajustar la técnica. El trabajo de movilidad y activación debe realizarse con 0 dolor.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                        <h4 className="font-bold text-slate-800">Esfuerzo Percibido (RPE)</h4>
                        <p className="text-sm">Es tu guía de intensidad. En esta fase, la mayoría de tus ejercicios de fuerza se mantendrán en un RPE 6-8, lo que significa que siempre terminas la serie sintiendo que podrías haber hecho 2-4 repeticiones más (RIR 2-4).</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                        <h4 className="font-bold text-slate-800">Método de Progresión</h4>
                        <p className="text-sm">La mejora es gradual. Primero, aumenta las repeticiones dentro del rango establecido. Solo cuando completes todas las series en el rango alto con buena técnica, podrás aumentar ligeramente el peso.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                        <h4 className="font-bold text-slate-800">La Secuencia de Activación</h4>
                        <p className="text-sm">{'Antes de cada repetición de fuerza, recuerda la secuencia: Exhala (para activar tu core profundo) → Contrae (mantén la tensión) → Muévete (inicia el levantamiento).'}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border">
                        <h4 className="font-bold text-slate-800">{'Consistencia > Intensidad'}</h4>
                        <p className="text-sm">Es más valioso cumplir con tu plan de forma constante, incluso en días de baja energía, que hacer una sesión esporádica hasta el agotamiento.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


function App() {
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
    const [isTyping, setIsTyping] = useState(false);
    const [toasts, setToasts] = useState<ToastInfo[]>([]);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const showToast = useCallback((message: string, title: string, icon: string, iconColor: string) => {
        setToasts(currentToasts => [...currentToasts, { id: Date.now(), message, title, icon, iconColor }]);
    }, []);

    const dismissToast = (id: number) => {
        setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
    };

    const getXPForLevel = (level: number) => 100 * Math.pow(1.5, level - 1);

    const checkAchievements = useCallback((currentState: GameState) => {
        const newState: GameState = JSON.parse(JSON.stringify(currentState));
        let achievementUnlocked = false;

        const completedDailies = Object.values(newState.completedWorkouts).filter(date => new Date(date).toDateString() !== new Date(0).toDateString()).length;
        const completedStrengths = Object.keys(newState.completedWorkouts).filter(k => k.startsWith('day')).length;

        if (completedDailies > 0 && !newState.achievements.first_daily.unlocked) {
            newState.achievements.first_daily.unlocked = true;
            showToast('Logro Desbloqueado: Un Buen Comienzo', '¡Logro!', 'fa-award', 'text-yellow-400');
            achievementUnlocked = true;
        }
        if (completedStrengths > 0 && !newState.achievements.first_strength.unlocked) {
            newState.achievements.first_strength.unlocked = true;
            showToast('Logro Desbloqueado: ¡A Mover Hierro!', '¡Logro!', 'fa-award', 'text-yellow-400');
            achievementUnlocked = true;
        }
        if (newState.dailyStreak >= 3 && !newState.achievements.streak_3.unlocked) {
            newState.achievements.streak_3.unlocked = true;
            showToast('Logro Desbloqueado: Creando el Hábito', '¡Logro!', 'fa-award', 'text-yellow-400');
            achievementUnlocked = true;
        }
        if (newState.dailyStreak >= 7 && !newState.achievements.streak_7.unlocked) {
            newState.achievements.streak_7.unlocked = true;
            showToast('Logro Desbloqueado: Imparable', '¡Logro!', 'fa-award', 'text-yellow-400');
            achievementUnlocked = true;
        }
        if (newState.level >= 5 && !newState.achievements.level_5.unlocked) {
            newState.achievements.level_5.unlocked = true;
            showToast('Logro Desbloqueado: Veterano de la Recuperación', '¡Logro!', 'fa-award', 'text-yellow-400');
            achievementUnlocked = true;
        }

        return achievementUnlocked ? newState.achievements : currentState.achievements;

    }, [showToast]);

    const addXP = useCallback((amount: number) => {
        setGameState(prevState => {
            const newState = { ...prevState, xp: prevState.xp + amount };
            showToast(`¡Has ganado ${amount} XP!`, 'XP Ganados', 'fa-plus-circle', 'text-emerald-400');

            while (newState.xp >= getXPForLevel(newState.level)) {
                newState.xp -= getXPForLevel(newState.level);
                newState.level++;
                showToast(`¡Felicidades! Has subido al Nivel ${newState.level}`, '¡Subida de Nivel!', 'fa-arrow-up', 'text-yellow-400');
            }
            
            const updatedAchievements = checkAchievements(newState);
            newState.achievements = updatedAchievements;

            return newState;
        });
    }, [showToast, checkAchievements]);

    const handleWorkoutCompletion = useCallback((dayId: string) => {
        setGameState(prevState => {
            const today = new Date().toDateString();
            if (prevState.completedWorkouts[dayId] === today) return prevState;

            const newState = { ...prevState, completedWorkouts: { ...prevState.completedWorkouts, [dayId]: today } };

            if (dayId === 'daily') {
                const lastDate = prevState.lastDailyCompletion ? new Date(prevState.lastDailyCompletion) : null;
                const yesterday = new Date();
                yesterday.setDate(new Date().getDate() - 1);

                if (!lastDate || lastDate.toDateString() === yesterday.toDateString()) {
                    newState.dailyStreak++;
                } else if (lastDate?.toDateString() !== new Date().toDateString()) {
                    newState.dailyStreak = 1;
                }
                newState.lastDailyCompletion = new Date().toISOString();
                showToast(`¡Rutina diaria completada! Racha actual: ${newState.dailyStreak} días.`, '¡Racha!', 'fa-fire', 'text-orange-400');
                addXP(25);
            } else if (dayId !== 'warmup') {
                showToast(`¡Entrenamiento del ${dayId.replace('day', 'Día ')} completado!`, '¡Entreno Completo!', 'fa-trophy', 'text-yellow-400');
                addXP(75);
            }
            return newState;
        });
    }, [addXP, showToast]);

    const handleSavePainDiary = useCallback((log: PainLog) => {
        setGameState(prevState => {
            const today = new Date().toISOString().split('T')[0];
            const newDiary = { ...prevState.painDiary, [today]: log };
            showToast('¡Tu diario ha sido actualizado!', 'Diario Guardado', 'fa-book-medical', 'text-emerald-400');
            return { ...prevState, painDiary: newDiary };
        });
    }, [showToast]);

    const handleSendMessage = async (message: string, isSensationAnalysis: boolean) => {
        const userMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
        const currentHistory = [...gameState.chatHistory, userMessage];
        setGameState(prevState => ({ ...prevState, chatHistory: currentHistory }));
        setIsTyping(true);
    
        const stream = isSensationAnalysis
            ? streamAnalyzeSensation(message.replace('He sentido: ', ''))
            : streamGeminiResponse(gameState.chatHistory, message);
    
        let firstChunk = true;
        let fullResponseText = "";
    
        for await (const chunk of stream) {
            fullResponseText += chunk;
            if (firstChunk) {
                setIsTyping(false);
                const botMessage: ChatMessage = { role: 'model', parts: [{ text: fullResponseText }] };
                setGameState(prevState => ({ ...prevState, chatHistory: [...prevState.chatHistory, botMessage] }));
                firstChunk = false;
            } else {
                setGameState(prevState => {
                    const newHistory = [...prevState.chatHistory];
                    if (newHistory.length > 0 && newHistory[newHistory.length - 1].role === 'model') {
                        const lastMessage = newHistory[newHistory.length - 1];
                        newHistory[newHistory.length - 1] = {
                            ...lastMessage,
                            parts: [{ text: fullResponseText }],
                        };
                    }
                    return { ...prevState, chatHistory: newHistory };
                });
            }
        }
    
        if (firstChunk) { 
            setIsTyping(false);
        }
    };

    // Load and save state
    useEffect(() => {
        try {
            const savedState = localStorage.getItem('recoveryGameState');
            if (savedState) {
                const parsedState: GameState = JSON.parse(savedState);
                
                // Merge saved achievements with initial to handle new additions
                const mergedAchievements = { ...INITIAL_ACHIEVEMENTS, ...parsedState.achievements };
                Object.keys(INITIAL_ACHIEVEMENTS).forEach(key => {
                    if (parsedState.achievements[key]) {
                        mergedAchievements[key].unlocked = parsedState.achievements[key].unlocked;
                    }
                });

                // Update streak
                if (parsedState.lastDailyCompletion) {
                    const lastDate = new Date(parsedState.lastDailyCompletion);
                    const today = new Date();
                    const yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);
                    if (lastDate.toDateString() !== yesterday.toDateString() && lastDate.toDateString() !== today.toDateString()) {
                        parsedState.dailyStreak = 0;
                    }
                }

                setGameState({ ...INITIAL_GAME_STATE, ...parsedState, achievements: mergedAchievements });

            } else {
                // First time load
                setTimeout(() => {
                    const welcomeMessage: ChatMessage = { role: 'model', parts: [{ text: "¡Bienvenido a la versión 4.0! He renovado el diseño y corregido errores. ¡A seguir sumando XP!" }] };
                    setGameState(prev => ({...prev, chatHistory: [welcomeMessage]}))
                }, 1000);
            }
        } catch (error) {
            console.error("Failed to load game state, resetting:", error);
            localStorage.removeItem('recoveryGameState');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('recoveryGameState', JSON.stringify(gameState));
    }, [gameState]);


    // Proactive coach
    useEffect(() => {
        const proactiveCoach = () => {
            const hasBeenNotifiedToday = (type: string) => {
                const lastNotification = localStorage.getItem(`notification_${type}`);
                if (!lastNotification) return false;
                const today = new Date().toDateString();
                return lastNotification === today;
            };
            const setNotifiedToday = (type: string) => {
                localStorage.setItem(`notification_${type}`, new Date().toDateString());
            };

            const now = new Date();
            const day = now.getDay();
            const hour = now.getHours();
            if (hour >= 9 && hour < 12 && !hasBeenNotifiedToday('morning')) { showToast("¡Buenos días! Un nuevo día para sumar XP. Recuerda hacer tu rutina de activación.", "¡A empezar!", "fa-sun", "text-yellow-400"); setNotifiedToday('morning'); }
            const isTrainingDay = day === 1 || day === 3 || day === 5; // Mon, Wed, Fri
            if (isTrainingDay && hour >= 12 && hour < 18 && !hasBeenNotifiedToday('training')) { showToast(`¡Misión del día! Hoy toca entrenamiento de fuerza. ¡A por esos 75 XP!`, "¡Día de Entreno!", "fa-dumbbell", "text-slate-300"); setNotifiedToday('training'); }
            if (hour >= 20 && hour < 22 && !hasBeenNotifiedToday('evening')) { showToast("No te olvides de tu rutina diaria para mantener la racha. ¡Son 25 XP fáciles!", "¿Última misión?", "fa-moon", "text-blue-300"); setNotifiedToday('evening'); }
            if (day === 0 && hour >= 18 && hour < 21 && !hasBeenNotifiedToday('weekly')) { showToast("¡Fin de la semana! Revisa tus logros en la pestaña de Progreso. ¡Prepárate para la siguiente!", "Balance Semanal", "fa-clipboard-check", "text-emerald-400"); setNotifiedToday('weekly'); }
        };

        proactiveCoach();
        const intervalId = setInterval(proactiveCoach, 5 * 60 * 1000); // Check every 5 minutes
        return () => clearInterval(intervalId);
    }, [showToast]);


    return (
        <div className="container mx-auto p-4 md:p-8">
             <button
                onClick={() => setIsInfoModalOpen(true)}
                className="fixed top-6 right-6 text-slate-400 hover:text-emerald-500 text-3xl z-40 transition-colors"
                aria-label="Mostrar información clave"
            >
                <i className="fas fa-info-circle"></i>
            </button>
            <Header />
            <div className="flex flex-col lg:flex-row gap-8">
                <MainContent 
                    gameState={gameState} 
                    onWorkoutCompletion={handleWorkoutCompletion}
                    onSavePainDiary={handleSavePainDiary}
                    getXPForLevel={getXPForLevel}
                />
                <ChatAside 
                    chatHistory={gameState.chatHistory}
                    isTyping={isTyping}
                    onSendMessage={handleSendMessage}
                />
            </div>
             <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onDismiss={() => dismissToast(toast.id)} />
                ))}
            </div>
            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
        </div>
    );
}

export default App;