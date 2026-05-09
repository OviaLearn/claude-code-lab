import React, { useState, useEffect, useMemo } from 'react';
import { XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Flame, TrendingUp, Calendar, Dumbbell, Check, Plus, Minus, RotateCcw, Activity } from 'lucide-react';

// ============ PROGRAMME DATA ============
const PROGRAMME_START = new Date('2026-05-11T00:00:00');
const TOTAL_WEEKS = 12;

const DAYS = [
  { key: 'mon', label: 'Mon', name: 'Monday' },
  { key: 'tue', label: 'Tue', name: 'Tuesday' },
  { key: 'wed', label: 'Wed', name: 'Wednesday' },
  { key: 'thu', label: 'Thu', name: 'Thursday' },
  { key: 'fri', label: 'Fri', name: 'Friday' },
  { key: 'sat', label: 'Sat', name: 'Saturday' },
  { key: 'sun', label: 'Sun', name: 'Sunday' },
];

const SESSIONS = {
  mon: {
    title: 'Easy Run + Upper',
    tag: 'Mixed · Run + Lift',
    intro: '20–30 min easy run, then upper-body lift OR boxing (alternate weekly)',
    blocks: [
      { name: 'Easy Run', type: 'cardio', target: '20–30 min · conversational pace' },
      {
        name: 'Upper Body Workout',
        type: 'strength',
        target: '3 sets each',
        exercises: [
          { name: 'Dumbbell Bench Press / Push-ups', sets: 3, repTarget: '8–12' },
          { name: 'Bent-over Rows', sets: 3, repTarget: '8–12' },
          { name: 'Shoulder Press', sets: 3, repTarget: '8–12' },
          { name: 'Lat Pulldown / Assisted Pull-ups', sets: 3, repTarget: '8–12' },
          { name: 'Bicep Curls + Tricep Dips', sets: 3, repTarget: '10–12' },
          { name: 'Plank', sets: 3, repTarget: '30–60s' },
          { name: 'Leg Raises', sets: 3, repTarget: '10–15' },
        ],
      },
    ],
  },
  tue: {
    title: 'Boxing',
    tag: 'Conditioning',
    intro: 'Skill, pad work, conditioning rounds (60–75 min)',
    blocks: [{ name: 'Boxing Session', type: 'cardio', target: '60–75 min' }],
  },
  wed: {
    title: 'S&C + Light Walk',
    tag: 'Mixed',
    intro: 'Mixed-modal circuit + 15–20 min walk',
    blocks: [
      { name: 'S&C Circuit', type: 'cardio', target: '5 rounds · 45s on / 15s off' },
      { name: 'Light Walk', type: 'cardio', target: '15–20 min' },
    ],
  },
  thu: {
    title: 'Lower Body',
    tag: 'Strength · Heavy',
    intro: 'Squat, hinge, single-leg, posterior chain',
    blocks: [
      {
        name: 'Lower Body Workout',
        type: 'strength',
        target: '3 sets each',
        exercises: [
          { name: 'Squats', sets: 3, repTarget: '8–10' },
          { name: 'Romanian Deadlifts', sets: 3, repTarget: '8–10' },
          { name: 'Lunges / Split Squats', sets: 3, repTarget: '8–10 ea' },
          { name: 'Hip Thrusts', sets: 3, repTarget: '10–12' },
          { name: 'Leg Curls', sets: 3, repTarget: '10–12' },
          { name: 'Calf Raises', sets: 3, repTarget: '12–15' },
        ],
      },
    ],
  },
  fri: {
    title: 'Boxing + Optional KB',
    tag: 'Conditioning',
    intro: 'Boxing session, optional 15–20 min kettlebell finisher',
    blocks: [
      { name: 'Boxing Session', type: 'cardio', target: '60 min' },
      {
        name: 'KB Finisher (optional)',
        type: 'strength',
        target: '3 rounds',
        exercises: [
          { name: 'KB Swings', sets: 3, repTarget: '15' },
          { name: 'Goblet Squats', sets: 3, repTarget: '10' },
          { name: 'Push Press', sets: 3, repTarget: '8 ea' },
          { name: 'Russian Twists', sets: 3, repTarget: '20' },
        ],
      },
    ],
  },
  sat: {
    title: 'Kettlebell Workout',
    tag: 'Conditioning',
    intro: '30 min — alternate A (cardio) and B (strength) weekly',
    blocks: [
      {
        name: 'KB Workout A — Conditioning',
        type: 'strength',
        target: '4–5 rounds',
        exercises: [
          { name: 'Swings', sets: 5, repTarget: '15' },
          { name: 'Goblet Squats', sets: 5, repTarget: '10–12' },
          { name: 'Push Press', sets: 5, repTarget: '8 ea' },
          { name: 'Rows', sets: 5, repTarget: '10 ea' },
          { name: 'Reverse Lunges', sets: 5, repTarget: '8 ea' },
          { name: 'Russian Twists', sets: 5, repTarget: '20' },
        ],
      },
      {
        name: 'KB Workout B — Strength',
        type: 'strength',
        target: 'Straight sets',
        exercises: [
          { name: 'Deadlifts', sets: 3, repTarget: '10' },
          { name: 'Floor Press', sets: 3, repTarget: '8–10 ea' },
          { name: 'Single-leg RDL', sets: 3, repTarget: '8 ea' },
          { name: 'Cleans', sets: 3, repTarget: '6–8 ea' },
          { name: 'Overhead Carry', sets: 3, repTarget: '30–40s ea' },
        ],
      },
    ],
  },
  sun: {
    title: 'Long Easy Run',
    tag: 'Aerobic',
    intro: 'Conversational pace · build duration progressively',
    blocks: [{ name: 'Long Run', type: 'cardio', target: 'Wks 1–4: 30–45m · 5–8: 45–60m · 9–12: 60–75m' }],
  },
};

// ============ DATE HELPERS ============
function getDateForWeekDay(weekIdx, dayIdx) {
  const d = new Date(PROGRAMME_START);
  d.setDate(d.getDate() + weekIdx * 7 + dayIdx);
  return d;
}

function formatDateShort(d) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getCurrentWeekAndDay() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(PROGRAMME_START);
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { weekIdx: 0, dayIdx: 0, status: 'before' };
  if (diff >= TOTAL_WEEKS * 7) return { weekIdx: TOTAL_WEEKS - 1, dayIdx: 6, status: 'after' };
  return { weekIdx: Math.floor(diff / 7), dayIdx: diff % 7, status: 'active' };
}

function sessionKey(weekIdx, dayKey) {
  return `s:w${weekIdx}:${dayKey}`;
}

// ============ STORAGE (localStorage) ============
function loadSession(weekIdx, dayKey) {
  try {
    const raw = localStorage.getItem(sessionKey(weekIdx, dayKey));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(weekIdx, dayKey, data) {
  try {
    localStorage.setItem(sessionKey(weekIdx, dayKey), JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

function loadAllSessions() {
  const out = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('s:')) {
      try {
        out[key] = JSON.parse(localStorage.getItem(key));
      } catch {}
    }
  }
  return out;
}

// ============ COMPONENTS ============

function Stat({ label, value, unit, icon: Icon }) {
  return (
    <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3 relative overflow-hidden">
      <div className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon size={11} className="text-amber-500/70" />}
        <div className="text-[9px] tracking-[0.2em] uppercase text-stone-500 font-mono">{label}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <div className="text-3xl font-bold text-amber-400" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.02em' }}>
          {value}
        </div>
        {unit && <div className="text-xs text-stone-500">{unit}</div>}
      </div>
    </div>
  );
}

function StrengthBlock({ block, sessionData, onUpdate }) {
  const blockKey = block.name;
  const blockData = sessionData.blocks?.[blockKey] || { exercises: {} };

  const updateSet = (exName, setIdx, field, value) => {
    const newBlocks = { ...sessionData.blocks };
    newBlocks[blockKey] = newBlocks[blockKey] || { exercises: {} };
    newBlocks[blockKey].exercises = newBlocks[blockKey].exercises || {};
    newBlocks[blockKey].exercises[exName] = newBlocks[blockKey].exercises[exName] || [];
    newBlocks[blockKey].exercises[exName][setIdx] = {
      ...(newBlocks[blockKey].exercises[exName][setIdx] || {}),
      [field]: value,
    };
    onUpdate({ ...sessionData, blocks: newBlocks });
  };

  return (
    <div className="bg-stone-900/40 border border-stone-800 rounded-xl overflow-hidden mb-3">
      <div className="px-4 py-3 bg-gradient-to-b from-stone-900 to-stone-900/40 border-b border-stone-800">
        <div className="text-[10px] tracking-[0.18em] uppercase text-amber-500 font-mono mb-0.5">{block.target}</div>
        <div className="text-lg text-stone-100" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.03em' }}>
          {block.name}
        </div>
      </div>
      <div>
        {block.exercises.map((ex) => {
          const exData = blockData.exercises?.[ex.name] || [];
          return (
            <div key={ex.name} className="px-4 py-3 border-t border-stone-800 first:border-t-0">
              <div className="flex items-baseline justify-between mb-2.5">
                <div className="text-sm font-medium text-stone-100">{ex.name}</div>
                <div className="text-[10px] text-stone-500 font-mono">target: {ex.repTarget}</div>
              </div>
              <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
                <div className="text-[10px] uppercase tracking-wider text-stone-600 font-mono">Set</div>
                <div className="text-[10px] uppercase tracking-wider text-stone-600 font-mono px-1">Weight</div>
                <div className="text-[10px] uppercase tracking-wider text-stone-600 font-mono px-1">Reps</div>
                <div className="w-7"></div>
                {Array.from({ length: ex.sets }).map((_, sIdx) => {
                  const set = exData[sIdx] || {};
                  const done = set.done;
                  return (
                    <React.Fragment key={sIdx}>
                      <div className="text-xs font-mono text-stone-500 w-5">{sIdx + 1}</div>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="kg"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(ex.name, sIdx, 'weight', e.target.value)}
                        className="bg-stone-950 border border-stone-800 rounded-md px-2 py-1.5 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-600 w-full"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="reps"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(ex.name, sIdx, 'reps', e.target.value)}
                        className="bg-stone-950 border border-stone-800 rounded-md px-2 py-1.5 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-600 w-full"
                      />
                      <button
                        onClick={() => updateSet(ex.name, sIdx, 'done', !done)}
                        className={`w-7 h-7 rounded-md border flex items-center justify-center transition-all ${
                          done ? 'bg-amber-500 border-amber-500 text-stone-950' : 'bg-stone-950 border-stone-700 text-stone-600'
                        }`}
                      >
                        {done ? <Check size={14} strokeWidth={3} /> : <span className="text-[10px]">·</span>}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CardioBlock({ block, sessionData, onUpdate }) {
  const blockKey = block.name;
  const blockData = sessionData.blocks?.[blockKey] || {};

  const update = (field, value) => {
    const newBlocks = { ...sessionData.blocks };
    newBlocks[blockKey] = { ...(newBlocks[blockKey] || {}), [field]: value };
    onUpdate({ ...sessionData, blocks: newBlocks });
  };

  return (
    <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-amber-500 font-mono mb-0.5">{block.target}</div>
          <div className="text-lg text-stone-100" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.03em' }}>
            {block.name}
          </div>
        </div>
        <button
          onClick={() => update('done', !blockData.done)}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
            blockData.done ? 'bg-amber-500 border-amber-500 text-stone-950' : 'bg-stone-950 border-stone-700 text-stone-500'
          }`}
        >
          {blockData.done ? <Check size={18} strokeWidth={3} /> : <span className="text-base">·</span>}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-stone-600 font-mono mb-1">Duration</div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="min"
            value={blockData.duration || ''}
            onChange={(e) => update('duration', e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-md px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-600 w-full"
          />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-stone-600 font-mono mb-1">RPE / Notes</div>
          <input
            type="text"
            placeholder="e.g. RPE 6, easy"
            value={blockData.notes || ''}
            onChange={(e) => update('notes', e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-md px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-600 w-full"
          />
        </div>
      </div>
    </div>
  );
}

function SessionView({ weekIdx, dayKey, isToday, isFuture }) {
  const session = SESSIONS[dayKey];
  const date = getDateForWeekDay(weekIdx, DAYS.findIndex((d) => d.key === dayKey));
  const [sessionData, setSessionData] = useState({ blocks: {} });
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  useEffect(() => {
    setLoaded(false);
    const data = loadSession(weekIdx, dayKey);
    setSessionData(data || { blocks: {} });
    setLoaded(true);
  }, [weekIdx, dayKey]);

  useEffect(() => {
    if (!loaded) return;
    setSaveStatus('saving');
    const t = setTimeout(() => {
      const ok = saveSession(weekIdx, dayKey, sessionData);
      setSaveStatus(ok ? 'saved' : 'idle');
      setTimeout(() => setSaveStatus('idle'), 1200);
    }, 600);
    return () => clearTimeout(t);
  }, [sessionData, loaded, weekIdx, dayKey]);

  return (
    <div>
      <div className="px-4 pt-5 pb-4 border-b border-stone-800/60">
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-amber-500/80">
            Week {weekIdx + 1} · {DAYS.find((d) => d.key === dayKey).name}
          </div>
          <div className="flex items-center gap-2">
            {isToday && (
              <span className="text-[9px] tracking-[0.15em] uppercase font-mono px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded">
                Today
              </span>
            )}
            <div className="text-[10px] text-stone-500 font-mono">{formatDateShort(date)}</div>
          </div>
        </div>
        <div className="text-3xl text-stone-100 mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.02em' }}>
          {session.title}
        </div>
        <div className="text-xs text-stone-500">{session.intro}</div>
        {saveStatus !== 'idle' && (
          <div className="mt-2 text-[9px] uppercase tracking-wider font-mono text-stone-600">
            {saveStatus === 'saving' ? '· saving…' : '✓ saved'}
          </div>
        )}
      </div>

      {isFuture && (
        <div className="mx-4 mt-4 px-4 py-3 bg-stone-900/40 border border-dashed border-stone-700 rounded-lg">
          <div className="text-[10px] uppercase tracking-wider text-stone-500 font-mono mb-1">Upcoming</div>
          <div className="text-xs text-stone-400">
            This session is in the future. You can preview it but it'll be ready to log on {formatDateShort(date)}.
          </div>
        </div>
      )}

      <div className="p-4">
        {session.blocks.map((block) =>
          block.type === 'strength' ? (
            <StrengthBlock key={block.name} block={block} sessionData={sessionData} onUpdate={setSessionData} />
          ) : (
            <CardioBlock key={block.name} block={block} sessionData={sessionData} onUpdate={setSessionData} />
          )
        )}
      </div>
    </div>
  );
}

function ProgressView({ allSessions }) {
  const stats = useMemo(() => {
    let totalSessions = 0;
    let completedSessions = 0;
    let totalVolume = 0;
    const weeklyData = [];

    for (let w = 0; w < TOTAL_WEEKS; w++) {
      let weekDone = 0;
      for (const day of DAYS) {
        totalSessions++;
        const data = allSessions[sessionKey(w, day.key)];
        if (data?.blocks) {
          const hasCompletion = Object.values(data.blocks).some((b) => {
            if (b.done) return true;
            if (b.exercises) return Object.values(b.exercises).some((sets) => sets.some((s) => s?.done));
            return false;
          });
          if (hasCompletion) { completedSessions++; weekDone++; }
          Object.values(data.blocks).forEach((b) => {
            if (b.exercises) {
              Object.values(b.exercises).forEach((sets) => {
                sets.forEach((s) => {
                  if (s?.done) totalVolume += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
                });
              });
            }
          });
        }
      }
      weeklyData.push({
        week: `W${w + 1}`,
        completed: weekDone,
        date: formatDateShort(getDateForWeekDay(w, 0)),
      });
    }

    const { weekIdx: tw, dayIdx: td, status } = getCurrentWeekAndDay();
    let streak = 0;
    if (status !== 'before') {
      let curW = tw, curD = td;
      while (curW >= 0 && curD >= 0) {
        const data = allSessions[sessionKey(curW, DAYS[curD].key)];
        const done = data?.blocks
          ? Object.values(data.blocks).some((b) => b.done || (b.exercises && Object.values(b.exercises).some((sets) => sets.some((s) => s?.done))))
          : false;
        if (done) { streak++; }
        else if (!(curW === tw && curD === td)) break;
        curD--;
        if (curD < 0) { curW--; curD = 6; }
      }
    }

    return { totalSessions, completedSessions, completionPct: Math.round((completedSessions / totalSessions) * 100), totalVolume: Math.round(totalVolume), weeklyData, streak };
  }, [allSessions]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Stat label="Streak" value={stats.streak} unit="days" icon={Flame} />
        <Stat label="Completion" value={stats.completionPct} unit="%" icon={TrendingUp} />
        <Stat label="Sessions" value={stats.completedSessions} unit={`/ ${stats.totalSessions}`} icon={Calendar} />
        <Stat label="Volume" value={stats.totalVolume.toLocaleString()} unit="kg" icon={Dumbbell} />
      </div>

      <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs tracking-[0.18em] uppercase font-mono text-stone-400">Weekly Completion</div>
          <Activity size={14} className="text-amber-500/70" />
        </div>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <BarChart data={stats.weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#44403c' }} tickLine={false} />
              <YAxis domain={[0, 7]} tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1c1917', border: '1px solid #44403c', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#d6d3d1' }} cursor={{ fill: 'rgba(212,154,58,0.08)' }} />
              <Bar dataKey="completed" fill="#d49a3a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-4">
        <div className="text-xs tracking-[0.18em] uppercase font-mono text-stone-400 mb-3">12-Week Grid</div>
        <div className="space-y-1">
          {Array.from({ length: TOTAL_WEEKS }).map((_, w) => (
            <div key={w} className="flex items-center gap-2">
              <div className="text-[10px] font-mono text-stone-500 w-7">W{w + 1}</div>
              <div className="flex gap-1 flex-1">
                {DAYS.map((d, dIdx) => {
                  const data = allSessions[sessionKey(w, d.key)];
                  const done = data?.blocks ? Object.values(data.blocks).some((b) => b.done || (b.exercises && Object.values(b.exercises).some((sets) => sets.some((s) => s?.done)))) : false;
                  const date = getDateForWeekDay(w, dIdx);
                  const today = new Date(); today.setHours(0, 0, 0, 0);
                  const isToday = date.getTime() === today.getTime();
                  const isPast = date < today;
                  return (
                    <div key={d.key} className={`flex-1 h-7 rounded border ${done ? 'bg-amber-500/80 border-amber-500' : isToday ? 'bg-amber-500/10 border-amber-500/40' : isPast ? 'bg-stone-900 border-stone-800' : 'bg-stone-950 border-stone-800/60 border-dashed'}`} title={`${d.label} · ${formatDateShort(date)}`} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3 text-[9px] font-mono text-stone-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80"></span>Done</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border border-amber-500/40 bg-amber-500/10"></span>Today</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-stone-900 border border-stone-800"></span>Missed</span>
        </div>
      </div>
    </div>
  );
}

// ============ APP ============
export default function App() {
  const today = useMemo(() => getCurrentWeekAndDay(), []);
  const [view, setView] = useState('session');
  const [weekIdx, setWeekIdx] = useState(today.weekIdx);
  const [dayKey, setDayKey] = useState(DAYS[today.dayIdx].key);
  const [allSessions, setAllSessions] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { setAllSessions(loadAllSessions()); }, [refreshKey]);
  useEffect(() => { if (view === 'progress') setRefreshKey((k) => k + 1); }, [view]);

  const date = getDateForWeekDay(weekIdx, DAYS.findIndex((d) => d.key === dayKey));
  const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
  const isToday = date.getTime() === todayDate.getTime();
  const isFuture = date > todayDate;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <header className="px-4 pt-6 pb-3 border-b border-stone-800/60 bg-gradient-to-b from-stone-900 to-stone-950">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] tracking-[0.25em] uppercase font-mono text-amber-500">12-Week Tracker</div>
          <div className="text-[9px] font-mono text-stone-600">11 May → 02 Aug</div>
        </div>
        <div className="text-2xl text-stone-100" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.03em' }}>
          Hands · Iron · Mileage
        </div>
      </header>

      <div className="flex border-b border-stone-800 bg-stone-950 sticky top-0 z-30">
        <button onClick={() => setView('session')} className={`flex-1 py-3 text-[11px] tracking-[0.18em] uppercase font-mono border-b-2 transition-colors ${view === 'session' ? 'text-amber-400 border-amber-500' : 'text-stone-500 border-transparent'}`}>Session</button>
        <button onClick={() => setView('progress')} className={`flex-1 py-3 text-[11px] tracking-[0.18em] uppercase font-mono border-b-2 transition-colors ${view === 'progress' ? 'text-amber-400 border-amber-500' : 'text-stone-500 border-transparent'}`}>Progress</button>
      </div>

      {view === 'session' && (
        <>
          <div className="px-3 py-2.5 border-b border-stone-800/60 flex items-center gap-2 bg-stone-950 sticky top-[45px] z-20">
            <button onClick={() => setWeekIdx(Math.max(0, weekIdx - 1))} disabled={weekIdx === 0} className="w-8 h-8 rounded-md bg-stone-900 border border-stone-800 text-stone-400 disabled:opacity-30 flex items-center justify-center"><Minus size={14} /></button>
            <div className="flex-1 text-center">
              <div className="text-[9px] tracking-[0.2em] uppercase font-mono text-stone-500">Week</div>
              <div className="text-base text-stone-100 font-medium">{weekIdx + 1} <span className="text-stone-600 font-normal">of {TOTAL_WEEKS}</span></div>
            </div>
            <button onClick={() => setWeekIdx(Math.min(TOTAL_WEEKS - 1, weekIdx + 1))} disabled={weekIdx === TOTAL_WEEKS - 1} className="w-8 h-8 rounded-md bg-stone-900 border border-stone-800 text-stone-400 disabled:opacity-30 flex items-center justify-center"><Plus size={14} /></button>
            {(weekIdx !== today.weekIdx || dayKey !== DAYS[today.dayIdx].key) && today.status === 'active' && (
              <button onClick={() => { setWeekIdx(today.weekIdx); setDayKey(DAYS[today.dayIdx].key); }} className="px-2.5 h-8 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                <RotateCcw size={11} /> Today
              </button>
            )}
          </div>

          <div className="flex overflow-x-auto border-b border-stone-800/60 bg-stone-950 sticky top-[97px] z-20" style={{ scrollbarWidth: 'none' }}>
            {DAYS.map((d, dIdx) => {
              const tabDate = getDateForWeekDay(weekIdx, dIdx);
              const isTodayTab = tabDate.getTime() === todayDate.getTime();
              const data = allSessions[sessionKey(weekIdx, d.key)];
              const hasData = data?.blocks ? Object.values(data.blocks).some((b) => b.done || (b.exercises && Object.values(b.exercises).some((sets) => sets.some((s) => s?.done)))) : false;
              return (
                <button key={d.key} onClick={() => setDayKey(d.key)} className={`flex-shrink-0 px-3 py-2.5 border-b-2 transition-colors min-w-[58px] ${dayKey === d.key ? 'border-amber-500' : 'border-transparent'}`}>
                  <div className={`text-[9px] tracking-[0.15em] uppercase font-mono mb-0.5 ${dayKey === d.key ? 'text-amber-500' : 'text-stone-600'}`}>{d.label}</div>
                  <div className={`text-base flex items-center justify-center gap-1 ${dayKey === d.key ? 'text-stone-100' : 'text-stone-500'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {tabDate.getDate()}
                    {hasData && <span className="w-1 h-1 rounded-full bg-amber-500"></span>}
                    {isTodayTab && !hasData && <span className="w-1 h-1 rounded-full bg-amber-500/40"></span>}
                  </div>
                </button>
              );
            })}
          </div>

          <SessionView weekIdx={weekIdx} dayKey={dayKey} isToday={isToday} isFuture={isFuture} />
        </>
      )}

      {view === 'progress' && <ProgressView allSessions={allSessions} />}
    </div>
  );
}
