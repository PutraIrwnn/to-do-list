import React, { useEffect, useState } from "react";

// Icons
const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);
const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
const IconPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);
const IconPause = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PutPlannerRevamped() {
  const emptyWeek = {
    meta: { weekLabel: "", top1: "", top2: "", top3: "" },
    days: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    deadlines: [],
    notes: "",
  };

  const [data, setData] = useState(emptyWeek);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("saved");

  // Load from localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate the async-object structure the user's code expects
        const result = await Promise.resolve({ value: localStorage.getItem("put_planner_v4") });
        if (result && result.value) {
          setData(JSON.parse(result.value));
        }
      } catch (error) {
        console.log("No existing data, starting fresh", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save to localStorage with debounce
  useEffect(() => {
    if (loading) return;

    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        localStorage.setItem("put_planner_v4", JSON.stringify(data));
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
        console.error("Save failed:", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data, loading]);

  const daysOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const addTask = (day, label = "") => {
    if (!label.trim()) return;
    const newTask = { id: Date.now(), label, done: false };
    setData((d) => ({
      ...d,
      days: { ...d.days, [day]: [...d.days[day], newTask] },
    }));
  };

  const toggleDone = (day, id) => {
    setData((d) => ({
      ...d,
      days: {
        ...d.days,
        [day]: d.days[day].map((t) =>
          t.id === id ? { ...t, done: !t.done } : t
        ),
      },
    }));
  };

  const updateTask = (day, id, patch) => {
    setData((d) => ({
      ...d,
      days: {
        ...d.days,
        [day]: d.days[day].map((t) => (t.id === id ? { ...t, ...patch } : t)),
      },
    }));
  };

  const removeTask = (day, id) => {
    setData((d) => ({
      ...d,
      days: { ...d.days, [day]: d.days[day].filter((t) => t.id !== id) },
    }));
  };

  const addDeadline = (title = "", date = "") => {
    if (!title.trim()) return;
    setData((d) => ({
      ...d,
      deadlines: [...d.deadlines, { id: Date.now(), title, date }],
    }));
  };

  const removeDeadline = (id) => {
    setData((d) => ({
      ...d,
      deadlines: d.deadlines.filter((x) => x.id !== id),
    }));
  };

  const clearWeek = async () => {
    if (!confirm("Clear this week? This cannot be undone.")) return;
    setData(emptyWeek);
    try {
      localStorage.removeItem("put_planner_v4");
    } catch (error) {
      console.error("Clear failed:", error);
    }
  };

  // Timer
  const [timerMode, setTimerMode] = useState({ work: 30 * 60, break: 5 * 60 });
  const [secondsLeft, setSecondsLeft] = useState(timerMode.work);
  const [running, setRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);

  useEffect(() => {
    let t;
    if (running) {
      t = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            const nextWork = !isWork;
            setIsWork(nextWork);
            return nextWork ? timerMode.work : timerMode.break;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [running, isWork, timerMode]);

  useEffect(() => {
    setSecondsLeft(isWork ? timerMode.work : timerMode.break);
  }, [timerMode, isWork]);

  const fmt = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Progress calculation
  const getDayProgress = (day) => {
    const tasks = data.days[day];
    if (tasks.length === 0) return 0;
    return Math.round(
      (tasks.filter((t) => t.done).length / tasks.length) * 100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative isolate overflow-hidden p-2 sm:p-4 md:p-6 font-sans">
      {/* Aurora background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900"></div>
      <div className="absolute top-40 -left-80 w-[40rem] h-[40rem] bg-rose-500/50 rounded-full blur-3xl opacity-60 animate-aurora-1"></div>
      <div className="absolute top-20 -right-60 w-[40rem] h-[40rem] bg-indigo-500/50 rounded-full blur-3xl opacity-70 animate-aurora-2"></div>

      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-5 border-b border-white/20">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Put's Weekly Planner
            </h1>
            <p className="text-xs text-gray-300 mt-0.5">
              {saveStatus === "saving" && "💾 Saving..."}
              {saveStatus === "saved" && "✓ All changes saved"}
              {saveStatus === "error" && "⚠️ Save failed"}
            </p>
          </div>
          <button
            onClick={clearWeek}
            className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-red-500 hover:bg-white/10 rounded-lg transition-all"
          >
            Clear Week
          </button>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Meta Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-indigo-100/50 border border-white/20 hover:shadow-xl hover:shadow-indigo-200/50 transition-all duration-300">
              <input
                className="w-full text-lg font-bold outline-none placeholder-slate-400 text-white bg-transparent border-b-2 border-transparent focus:border-indigo-500 transition-colors pb-2 mb-3"
                placeholder="Week 7"
                value={data.meta.weekLabel}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    meta: { ...d.meta, weekLabel: e.target.value },
                  }))
                }
              />
              <div className="space-y-2">
                <input
                  className="w-full p-2 text-sm rounded-lg bg-white/5 outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-white"
                  placeholder="🎯 Top Priority #1"
                  value={data.meta.top1}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      meta: { ...d.meta, top1: e.target.value },
                    }))
                  }
                />
                <input
                  className="w-full p-2 text-sm rounded-lg bg-white/5 outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-white"
                  placeholder="🎯 Top Priority #2"
                  value={data.meta.top2}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      meta: { ...d.meta, top2: e.target.value },
                    }))
                  }
                />
                <input
                  className="w-full p-2 text-sm rounded-lg bg-white/5 outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-white"
                  placeholder="🎯 Top Priority #3"
                  value={data.meta.top3}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      meta: { ...d.meta, top3: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Timer Card */}
            <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-2xl p-5 shadow-lg shadow-indigo-500/50 text-white">
              <h3 className="text-sm font-semibold mb-3 opacity-90">
                Pomodoro Timer
              </h3>
              <div className="text-center mb-4">
                <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight mb-1">
                  {fmt(secondsLeft)}
                </div>
                <div className="text-xs font-medium opacity-80">
                  {isWork ? "🔥 Focus Time" : "☕ Break Time"}
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => {
                    setTimerMode({ work: 30 * 60, break: 5 * 60 });
                    setIsWork(true);
                    setRunning(false);
                    setSecondsLeft(30 * 60);
                  }}
                  className="flex-1 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                >
                  30/5
                </button>
                <button
                  onClick={() => {
                    setTimerMode({ work: 40 * 60, break: 5 * 60 });
                    setIsWork(true);
                    setRunning(false);
                    setSecondsLeft(40 * 60);
                  }}
                  className="flex-1 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                >
                  40/5
                </button>
              </div>
              <button
                onClick={() => setRunning((r) => !r)}
                className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  running
                    ? "bg-red-500 hover:bg-red-600 shadow-lg"
                    : "bg-green-500 hover:bg-green-600 shadow-lg"
                }`}
              >
                {running ? <IconPause /> : <IconPlay />}
                {running ? "Pause" : "Start"}
              </button>
            </div>

            {/* Deadlines */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-slate-700/50 border border-white/20">
              <h3 className="font-bold text-base text-gray-200 mb-3">
                📅 Deadlines
              </h3>
              <div className="space-y-2 mb-3">
                {data.deadlines.map((dl) => (
                  <div
                    key={dl.id}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 group transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-100 truncate">
                        {dl.title}
                      </div>
                      <div className="text-xs text-gray-300">{dl.date}</div>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-white/10 p-1 rounded transition-all"
                      onClick={() => removeDeadline(dl.id)}
                    >
                      <IconTrash />
                    </button>
                  </div>
                ))}
              </div>
              <AddDeadline onAdd={addDeadline} />
            </div>

            {/* Notes */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-slate-700/50 border border-white/20">
              <h3 className="font-bold text-base text-gray-200 mb-3">
                📝 Notes
              </h3>
              <textarea
                className="w-full p-3 rounded-lg bg-white/5 text-sm outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none text-white placeholder-gray-400"
                rows={4}
                placeholder="Reflection, ideas, anything..."
                value={data.notes}
                onChange={(e) =>
                  setData((d) => ({ ...d, notes: e.target.value }))
                }
              />
            </div>
          </aside>

          {/* Main Days Grid */}
          <section className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {daysOrder.map((day) => {
                const progress = getDayProgress(day);
                return (
                  <div
                    key={day}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-700/50 border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 flex flex-col"
                  >
                    <div className="bg-gradient-to-r from-indigo-700 to-violet-800 p-3">
                      <h4 className="font-bold text-white capitalize text-base">
                        {day}
                      </h4>
                      {data.days[day].length > 0 && (
                        <div className="mt-2 bg-white/20 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2 flex-1">
                      {data.days[day].map((t) => (
                        <div
                          key={t.id}
                          className={`flex items-center gap-2 p-2 rounded-lg group transition-all duration-200 ${
                            t.done ? "bg-green-500/10" : "hover:bg-white/5"
                          }`}
                        >
                          <button
                            onClick={() => toggleDone(day, t.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              t.done
                                ? "bg-green-500 border-green-500"
                                : "border-gray-400 hover:border-indigo-400"
                            }`}
                          >
                            {t.done && <IconCheck />}
                          </button>
                          <input
                            className={`flex-1 bg-transparent outline-none text-sm font-medium min-w-0 ${
                              t.done
                                ? "text-gray-400 line-through"
                                : "text-gray-100"
                            }`}
                            value={t.label}
                            onChange={(e) =>
                              updateTask(day, t.id, { label: e.target.value })
                            }
                          />
                          <button
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-white/10 p-1 rounded transition-all"
                            onClick={() => removeTask(day, t.id)}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t border-white/10">
                      <QuickAddTask day={day} onAdd={addTask} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        <footer className="text-center py-6 text-xs text-gray-400">
          Built with ❤️ for Put • Stay focused, stay balanced ✨
        </footer>
      </div>
    </div>
  );
}

function QuickAddTask({ day, onAdd }) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(day, value.trim());
    setValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-white/5 outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-white placeholder-gray-400"
        placeholder="Add task..."
      />
      <button
        onClick={handleAdd}
        className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
      >
        <IconPlus />
      </button>
    </div>
  );
}

function AddDeadline({ onAdd }) {
  const [t, setT] = useState("");
  const [d, setD] = useState("");

  const handleAdd = () => {
    if (!t.trim()) return;
    onAdd(t.trim(), d);
    setT("");
    setD("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="space-y-2 pt-2 border-t border-white/10">
      <input
        value={t}
        onChange={(e) => setT(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full p-2 text-sm rounded-lg bg-white/5 outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-white placeholder-gray-400"
        placeholder="Deadline title"
      />
      <div className="flex gap-2">
        <input
          type="date"
          value={d}
          onChange={(e) => setD(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 text-sm rounded-lg bg-white/5 outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-white"
        />
        <button
          onClick={handleAdd}
          className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
        >
          <IconPlus />
        </button>
      </div>
    </div>
  );
}
