import type { WorkoutPlan, Achievements, GameState } from './types';

export const WORKOUTS: WorkoutPlan = {
  daily: [ { name: 'Respiración Supina 90/90', sets: '2 series x 8 respiraciones', rpe: 'RPE 5', video: 'https://www.youtube.com/watch?v=m2OFz37Jp2Q' }, { name: 'Gato-Camello', sets: '1 serie x 12 reps', rpe: 'RPE 5', video: 'https://www.youtube.com/watch?v=K9bK0BwKFjs' }, { name: 'Bird-Dog', sets: '2 series x 8 reps/lado', rpe: 'RPE 5', video: 'https://www.youtube.com/watch?v=d_2a5uGo9aE' }, { name: 'Puente de Glúteos', sets: '2 series x 15 reps', rpe: 'RPE 5', video: 'https://www.youtube.com/watch?v=wPMcfesA0cM' }, { name: 'Monster Walks (banda en rodillas)', sets: '2 series x 15 pasos/lado', rpe: 'RPE 5', video: 'https://www.youtube.com/watch?v=b6-iuaW5-eM' }, { name: 'Masaje de Cicatriz', sets: '2-3 minutos', rpe: 'N/A', video: 'https://www.youtube.com/watch?v=5-P_y-3s5Jg' } ],
  warmup: [ { name: 'Balanceo en Zancada (Psoas)', sets: '1 serie x 12 balanceos/lado', rpe: 'Movilidad', video: 'https://www.youtube.com/watch?v=L8_fcfx4_5A' }, { name: 'Elevaciones Activas de Pierna', sets: '1 serie x 12 reps/lado', rpe: 'Activación', video: 'https://www.youtube.com/watch?v=Y_Vp-87QMXE' } ],
  day1: [ { name: 'Sentadilla Goblet', sets: '3 x 8-10', rpe: 'RPE 6-7', video: 'https://www.youtube.com/watch?v=kUR_A1mKp-g' }, { name: 'Curl de Isquiotibiales Sentado', sets: '3 x 8-10', rpe: 'RPE 6-8', video: 'https://www.youtube.com/watch?v=s_1_v_b_a-M' }, { name: 'Remo Sentado en Máquina', sets: '3 x 10-12', rpe: 'RPE 7-8', video: 'https://www.youtube.com/watch?v=GZbfZ033f74' }, { name: 'Press Pectoral en Máquina', sets: '3 x 10-12', rpe: 'RPE 7-8', video: 'https://www.youtube.com/watch?v=Tp9__pShe_c' }, { name: 'Curl Femoral Tumbado', sets: '3 x 12-15', rpe: 'RPE 7-8', video: 'https://www.youtube.com/watch?v=yjmAAe-1D-E' }, { name: 'Plancha Frontal', sets: '3 x 30-45 seg', rpe: 'Tensión constante', video: 'https://www.youtube.com/watch?v=ASdvN_X_k4A' }, { name: 'Press Pallof', sets: '3 x 10-12 por lado', rpe: 'RPE 7', video: 'https://www.youtube.com/watch?v=g--s-z-3H6Y' }, { name: 'Cardio: Caminata en Cinta', sets: '15-20 min', rpe: 'RPE 5-6 (8-12% incl.)', video: 'https://www.youtube.com/watch?v=VDAk9a7vR-Y' } ],
  day2: [ { name: 'Prensa de Piernas', sets: '3 x 10-12', rpe: 'RPE 6-7', video: 'https://www.youtube.com/watch?v=s8-89-pChyM' }, { name: 'Extensiones de Cuádriceps Unilateral', sets: '2-3 x 8/lado', rpe: 'RPE 6-8', video: 'https://www.youtube.com/watch?v=Fk7i2g7d_5w' }, { name: 'Patada de Glúteo en Máquina', sets: '3 x 8-10/lado', rpe: 'RPE 6-8', video: 'https://www.youtube.com/watch?v=9_F3V3s-g9I' }, { name: 'Jalón al Pecho', sets: '3 x 10-12', rpe: 'RPE 7-8', video: 'https://www.youtube.com/watch?v=0oeIB6wi_J0' }, { name: 'Press de Hombros Sentado', sets: '3 x 10-12', rpe: 'RPE 7-8', video: 'https://www.youtube.com/watch?v=qEwKCR5-j_Q' }, { name: 'Face Pull con Cuerda', sets: '3 x 15-20', rpe: 'RPE 7', video: 'https://www.youtube.com/watch?v=eIq5CB9wyo4' }, { name: 'Paseo del Granjero', sets: '3 x 30-40 m', rpe: 'Desafiante', video: 'https://www.youtube.com/watch?v=gPSoiR0-OoI' }, { name: 'Cardio: Remo Ergómetro', sets: '10-15 min', rpe: 'RPE 6', video: 'https://www.youtube.com/watch?v=H0r_ZPXJLtg' } ],
  day3: [ { name: 'Peso Muerto Rumano', sets: '3 x 10-12', rpe: 'RPE 6-7', video: 'https://www.youtube.com/watch?v=2r5a-63B-e8' }, { name: 'Remo a una Mano', sets: '3 x 10-12', rpe: 'RPE 7-8', video: 'https://www.youtube.com/watch?v=PgpQ4-jHiq4' }, { name: 'Hip Thrust', sets: '3 x 12-15', rpe: 'RPE 7-8', video: 'https://www.youtube.com/watch?v=xDmFkJxPzeM' }, { name: 'Rotación Externa (Hombro)', sets: '3 x 15', rpe: 'RPE 6', video: 'https://www.youtube.com/watch?v=3-20n_P_aGw' }, { name: 'Jefferson Curl', sets: '2 x 8', rpe: 'RPE 3-4 (Movilidad)', video: 'https://www.youtube.com/watch?v=Ra-h8S4-QZI' }, { name: 'Press Pallof', sets: '3 x 10-12 por lado', rpe: 'RPE 7', video: 'https://www.youtube.com/watch?v=g--s-z-3H6Y' }, { name: 'Cardio Opcional', sets: '15 min', rpe: 'RPE 5-6', video: '#' } ]
};

export const INITIAL_ACHIEVEMENTS: Achievements = {
  'first_daily': { name: 'Un Buen Comienzo', desc: 'Completa tu primera rutina diaria.', unlocked: false, icon: 'fa-play-circle' },
  'first_strength': { name: '¡A Mover Hierro!', desc: 'Completa tu primer día de fuerza.', unlocked: false, icon: 'fa-dumbbell' },
  'streak_3': { name: 'Creando el Hábito', desc: 'Mantén una racha de 3 días seguidos.', unlocked: false, icon: 'fa-calendar-day' },
  'streak_7': { name: 'Imparable', desc: 'Mantén una racha de 7 días seguidos.', unlocked: false, icon: 'fa-calendar-week' },
  'level_5': { name: 'Veterano de la Recuperación', desc: 'Alcanza el nivel 5.', unlocked: false, icon: 'fa-star' }
};

export const INITIAL_GAME_STATE: GameState = {
  xp: 0,
  level: 1,
  dailyStreak: 0,
  lastDailyCompletion: null,
  completedWorkouts: {},
  achievements: INITIAL_ACHIEVEMENTS,
  chatHistory: [],
  painDiary: {}
};