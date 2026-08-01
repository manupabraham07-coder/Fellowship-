import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Flame, Plus, X, Users, ChevronDown, ChevronUp, BarChart3, Baby, UserRound,
  Sparkles, Trash2, Pencil, Check, NotebookPen, ArrowRight, Home, CalendarDays,
  ClipboardCheck, UserCheck, UserX, Minus,
} from "lucide-react";

// ---------------- constants ----------------
const AGE_GROUPS = [
  { id: "infant", label: "ശിശു", sub: "0–5", icon: Baby },
  { id: "teen", label: "കൗമാരം", sub: "6–14", icon: Sparkles },
  { id: "youth", label: "യുവജനം", sub: "15–25", icon: UserRound },
  { id: "adult", label: "മുതിർന്നവർ", sub: "25+", icon: Users },
];

const DEFAULT_ACTIVITIES = [
  "ദിവസേന പ്രാർത്ഥന",
  "ബൈബിൾ വായന",
  "കുടുംബ ആരാധന",
  "ഞായർ ആരാധനയിൽ പങ്കാളിത്തം",
  "വചന മനഃപാഠം / പഠനം",
];

const DEFAULT_EVENT_TYPES = ["ഞായർ ആരാധന"];

const uid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) => {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("ml-IN", { day: "numeric", month: "short", year: "numeric" });
};

const seedFamilies = [
  {
    id: uid(),
    name: "തോമസ് കുടുംബം",
    members: [
      { id: uid(), name: "ഏലിയാമ്മ", ageGroup: "adult" },
      { id: uid(), name: "തോമസ്", ageGroup: "adult" },
      { id: uid(), name: "അനു", ageGroup: "youth" },
      { id: uid(), name: "ജെറി", ageGroup: "teen" },
    ],
  },
  {
    id: uid(),
    name: "വർഗീസ് കുടുംബം",
    members: [
      { id: uid(), name: "സൂസൻ", ageGroup: "adult" },
      { id: uid(), name: "വർഗീസ്", ageGroup: "adult" },
      { id: uid(), name: "ബേബി", ageGroup: "infant" },
    ],
  },
];

function pctColor(pct) {
  if (pct >= 75) return "#8FA876";
  if (pct >= 40) return "#D9A94E";
  return "#C1653D";
}

// ---------------- logo ----------------
function Logo({ size = 40, pct = 60 }) {
  const flameH = 9 + (pct / 100) * 13;
  const glow = 0.2 + (pct / 100) * 0.7;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <defs>
        <radialGradient id={`lg-${size}`} cx="50%" cy="34%" r="62%">
          <stop offset="0%" stopColor="#F3C969" stopOpacity={glow} />
          <stop offset="100%" stopColor="#F3C969" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#1B2330" stroke="rgba(217,169,78,0.35)" />
      <circle cx="32" cy="27" r="22" fill={`url(#lg-${size})`} />
      {/* ring of small dots = fellowship / gathered families */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const r = 24;
        const cx = 32 + Math.cos(angle) * r;
        const cy = 32 + Math.sin(angle) * r;
        return <circle key={i} cx={cx} cy={cy} r="2.1" fill="#B8935A" opacity="0.55" />;
      })}
      {/* lamp */}
      <ellipse cx="32" cy="46" rx="12" ry="2.6" fill="#8A6A2E" opacity="0.5" />
      <path d="M22 43 Q32 49 42 43 L39 38 Q32 41 25 38 Z" fill="#B8935A" />
      <ellipse cx="32" cy="38" rx="10.5" ry="3" fill="#D9A94E" />
      <ellipse cx="32" cy="37.3" rx="7.4" ry="1.8" fill="#2A1E0E" />
      <path
        d={`M32 ${34 - flameH} C 27.5 ${34 - flameH * 0.4}, 27.5 29, 32 34 C 36.5 29, 36.5 ${34 - flameH * 0.4}, 32 ${34 - flameH} Z`}
        fill="#F3C969"
      />
      <path
        d={`M32 ${34 - flameH * 0.55} C 29.8 ${34 - flameH * 0.2}, 29.8 31, 32 34 C 34.2 31, 34.2 ${34 - flameH * 0.2}, 32 ${34 - flameH * 0.55} Z`}
        fill="#FCE7B0"
      />
    </svg>
  );
}

// ---------------- small reusable: click-to-edit text ----------------
function EditableText({ value, onSave, className, style, inputStyle, placeholder, tag = "span" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [editing]);

  const commit = () => {
    const v = draft.trim();
    if (v && v !== value) onSave(v);
    else setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={className}
        style={{ ...style, ...inputStyle, background: "#242D3D", outline: "none", border: "1px solid rgba(217,169,78,0.4)", borderRadius: 6, padding: "1px 6px" }}
      />
    );
  }

  const Tag = tag;
  return (
    <Tag
      className={className}
      style={{ ...style, cursor: "pointer", borderBottom: "1px dashed rgba(217,169,78,0.35)" }}
      onClick={() => setEditing(true)}
      title="തിരുത്താൻ ക്ലിക്ക് ചെയ്യുക"
    >
      {value || placeholder}
    </Tag>
  );
}

// ---------------- app ----------------
const STORAGE_KEY = "fellowship-state";

export default function Fellowship() {
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [page, setPage] = useState("home"); // home | track | report
  const [appName, setAppName] = useState("Fellowship");
  const [families, setFamilies] = useState(seedFamilies);
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES.map((name) => ({ id: uid(), name })));
  const [logs, setLogs] = useState({}); // memberId -> activityId -> bool
  const [notes, setNotes] = useState({}); // memberId -> [{id, date, text}]
  const [eventTypes, setEventTypes] = useState(DEFAULT_EVENT_TYPES.map((name) => ({ id: uid(), name })));
  const [attendance, setAttendance] = useState({}); // eventTypeId -> date -> memberId -> boolean
  const [expanded, setExpanded] = useState(() => new Set(seedFamilies.map((f) => f.id)));

  // ---- load persisted data once on mount ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value && !cancelled) {
          const data = JSON.parse(res.value);
          if (data.appName) setAppName(data.appName);
          if (Array.isArray(data.families)) {
            setFamilies(data.families);
            setExpanded(new Set(data.families.map((f) => f.id)));
          }
          if (Array.isArray(data.activities)) setActivities(data.activities);
          if (data.logs) setLogs(data.logs);
          if (data.notes) setNotes(data.notes);
          if (Array.isArray(data.eventTypes)) setEventTypes(data.eventTypes);
          if (data.attendance) setAttendance(data.attendance);
        }
      } catch (e) {
        // no saved data yet — fall back to the starter families/activities above
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- persist to this device whenever data changes ----
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(
          STORAGE_KEY,
          JSON.stringify({ appName, families, activities, logs, notes, eventTypes, attendance }),
          false
        );
        setSaveError(false);
      } catch (e) {
        setSaveError(true);
      }
    })();
  }, [loaded, appName, families, activities, logs, notes, eventTypes, attendance]);

  const resetAllData = async () => {
    if (!window.confirm("എല്ലാ ഡാറ്റയും മായ്ക്കണോ? ഇത് തിരികെ ലഭിക്കില്ല.")) return;
    try {
      await window.storage.delete(STORAGE_KEY, false);
    } catch (e) {
      /* ignore */
    }
    setAppName("Fellowship");
    setFamilies(seedFamilies);
    setActivities(DEFAULT_ACTIVITIES.map((name) => ({ id: uid(), name })));
    setLogs({});
    setNotes({});
    setEventTypes(DEFAULT_EVENT_TYPES.map((name) => ({ id: uid(), name })));
    setAttendance({});
    setExpanded(new Set(seedFamilies.map((f) => f.id)));
  };
  const [newActivity, setNewActivity] = useState("");
  const [addingMemberFor, setAddingMemberFor] = useState(null);
  const [memberDraft, setMemberDraft] = useState({ name: "", ageGroup: "adult" });
  const [newFamilyName, setNewFamilyName] = useState("");
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [noteEditorFor, setNoteEditorFor] = useState(null); // memberId
  const [noteDraft, setNoteDraft] = useState({ date: todayStr(), text: "" });
  const [openNotesFor, setOpenNotesFor] = useState(null); // memberId whose note history is shown

  const toggleLog = (memberId, activityId) => {
    setLogs((prev) => {
      const memberLogs = { ...(prev[memberId] || {}) };
      memberLogs[activityId] = !memberLogs[activityId];
      return { ...prev, [memberId]: memberLogs };
    });
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const memberPct = (memberId) => {
    const m = logs[memberId] || {};
    const total = activities.length || 1;
    const done = activities.filter((a) => m[a.id]).length;
    return Math.round((done / total) * 100);
  };

  const familyStats = (family) => {
    if (family.members.length === 0) return { pct: 0, done: 0, total: 0 };
    const total = family.members.length * activities.length;
    let done = 0;
    family.members.forEach((mem) => {
      const m = logs[mem.id] || {};
      done += activities.filter((a) => m[a.id]).length;
    });
    return { pct: total ? Math.round((done / total) * 100) : 0, done, total };
  };

  const communityStats = useMemo(() => {
    let totalMembers = 0;
    let sumPct = 0;
    families.forEach((f) => {
      const s = familyStats(f);
      if (f.members.length) {
        totalMembers += f.members.length;
        sumPct += s.pct * f.members.length;
      }
    });
    return {
      familyCount: families.length,
      memberCount: totalMembers,
      avgPct: totalMembers ? Math.round(sumPct / totalMembers) : 0,
    };
  }, [families, logs, activities]);

  // ---- mutations ----
  const addActivity = () => {
    const name = newActivity.trim();
    if (!name) return;
    setActivities((prev) => [...prev, { id: uid(), name }]);
    setNewActivity("");
  };
  const renameActivity = (id, name) => setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a)));
  const removeActivity = (id) => setActivities((prev) => prev.filter((a) => a.id !== id));

  const addFamily = () => {
    const name = newFamilyName.trim();
    if (!name) return;
    const fam = { id: uid(), name, members: [] };
    setFamilies((prev) => [...prev, fam]);
    setExpanded((prev) => new Set(prev).add(fam.id));
    setNewFamilyName("");
    setShowAddFamily(false);
  };
  const renameFamily = (id, name) => setFamilies((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  const removeFamily = (id) => setFamilies((prev) => prev.filter((f) => f.id !== id));

  const addMember = (familyId) => {
    const name = memberDraft.name.trim();
    if (!name) return;
    setFamilies((prev) =>
      prev.map((f) =>
        f.id === familyId
          ? { ...f, members: [...f.members, { id: uid(), name, ageGroup: memberDraft.ageGroup }] }
          : f
      )
    );
    setMemberDraft({ name: "", ageGroup: "adult" });
    setAddingMemberFor(null);
  };
  const renameMember = (familyId, memberId, name) =>
    setFamilies((prev) =>
      prev.map((f) =>
        f.id === familyId ? { ...f, members: f.members.map((m) => (m.id === memberId ? { ...m, name } : m)) } : f
      )
    );
  const setMemberAgeGroup = (familyId, memberId, ageGroup) =>
    setFamilies((prev) =>
      prev.map((f) =>
        f.id === familyId ? { ...f, members: f.members.map((m) => (m.id === memberId ? { ...m, ageGroup } : m)) } : f
      )
    );
  const removeMember = (familyId, memberId) =>
    setFamilies((prev) => prev.map((f) => (f.id === familyId ? { ...f, members: f.members.filter((m) => m.id !== memberId) } : f)));

  // ---- notes ----
  const saveNote = (memberId) => {
    const text = noteDraft.text.trim();
    if (!text) return;
    setNotes((prev) => {
      const list = prev[memberId] ? [...prev[memberId]] : [];
      const existingIdx = list.findIndex((n) => n.date === noteDraft.date);
      if (existingIdx >= 0) list[existingIdx] = { ...list[existingIdx], text };
      else list.unshift({ id: uid(), date: noteDraft.date, text });
      list.sort((a, b) => (a.date < b.date ? 1 : -1));
      return { ...prev, [memberId]: list };
    });
    setNoteDraft({ date: todayStr(), text: "" });
    setNoteEditorFor(null);
    setOpenNotesFor(memberId);
  };
  const deleteNote = (memberId, noteId) =>
    setNotes((prev) => ({ ...prev, [memberId]: (prev[memberId] || []).filter((n) => n.id !== noteId) }));
  const editNoteText = (memberId, noteId, text) =>
    setNotes((prev) => ({
      ...prev,
      [memberId]: (prev[memberId] || []).map((n) => (n.id === noteId ? { ...n, text } : n)),
    }));

  // ---- attendance ----
  const [attDate, setAttDate] = useState(todayStr());
  const [attEventId, setAttEventId] = useState(null);
  const [newEventType, setNewEventType] = useState("");

  useEffect(() => {
    if (!attEventId && eventTypes.length > 0) setAttEventId(eventTypes[0].id);
  }, [eventTypes, attEventId]);

  const addEventType = () => {
    const name = newEventType.trim();
    if (!name) return;
    const et = { id: uid(), name };
    setEventTypes((prev) => [...prev, et]);
    setAttEventId(et.id);
    setNewEventType("");
  };
  const renameEventType = (id, name) => setEventTypes((prev) => prev.map((e) => (e.id === id ? { ...e, name } : e)));
  const removeEventType = (id) => {
    setEventTypes((prev) => prev.filter((e) => e.id !== id));
    setAttendance((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const markAttendance = (eventTypeId, date, memberId, present) => {
    setAttendance((prev) => {
      const forEvent = { ...(prev[eventTypeId] || {}) };
      const forDate = { ...(forEvent[date] || {}) };
      forDate[memberId] = present;
      forEvent[date] = forDate;
      return { ...prev, [eventTypeId]: forEvent };
    });
  };

  const attendanceDatesFor = (eventTypeId) => Object.keys(attendance[eventTypeId] || {}).sort((a, b) => (a < b ? 1 : -1));

  const memberAttendanceStats = (eventTypeId, memberId) => {
    const dates = attendanceDatesFor(eventTypeId);
    let marked = 0;
    let present = 0;
    dates.forEach((d) => {
      const v = attendance[eventTypeId]?.[d]?.[memberId];
      if (v !== undefined) {
        marked += 1;
        if (v) present += 1;
      }
    });
    return { present, marked, pct: marked ? Math.round((present / marked) * 100) : 0 };
  };

  const shellStyle = { background: "#151B26", fontFamily: "'Noto Sans Malayalam', sans-serif" };
  const fontImports = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Malayalam:wght@500;700&family=Noto+Sans+Malayalam:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap');
      .display-font { font-family: 'Noto Serif Malayalam', serif; }
      .num-font { font-family: 'Space Grotesk', sans-serif; }
      .grain::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.035;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        z-index: 50;
      }
      .card-edge { border: 1px solid rgba(217,169,78,0.14); }
      ::selection { background: #D9A94E; color: #151B26; }
      @keyframes riseIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
      .rise { animation: riseIn 0.6s ease both; }
    `}</style>
  );

  if (!loaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={shellStyle}>
        {fontImports}
        <div className="text-center">
          <Logo size={56} pct={40} />
          <p className="text-xs mt-4" style={{ color: "#9AA5B1" }}>ഡാറ്റ ലോഡ് ചെയ്യുന്നു...</p>
        </div>
      </div>
    );
  }

  // ---------------- FRONT PAGE ----------------
  if (page === "home") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-6" style={shellStyle}>
        {fontImports}
        <div className="grain" />
        <div className="max-w-md w-full text-center rise">
          <div className="flex justify-center mb-6">
            <Logo size={92} pct={communityStats.avgPct} />
          </div>
          <h1 className="display-font text-4xl mb-2" style={{ color: "#EDE7D9" }}>
            <EditableText value={appName} onSave={setAppName} tag="span" />
          </h1>
          <p className="text-sm mb-10" style={{ color: "#9AA5B1" }}>
            കുടുംബങ്ങളുടെ ആത്മീയ പ്രവർത്തന ട്രാക്കർ
          </p>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              ["കുടുംബങ്ങൾ", communityStats.familyCount],
              ["അംഗങ്ങൾ", communityStats.memberCount],
              ["ശരാശരി", `${communityStats.avgPct}%`],
            ].map(([label, val]) => (
              <div key={label} className="rounded-xl px-3 py-4 card-edge" style={{ background: "#1B2330" }}>
                <div className="num-font text-xl font-semibold" style={{ color: "#F3C969" }}>{val}</div>
                <div className="text-[11px] mt-1" style={{ color: "#9AA5B1" }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setPage("track")}
              className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              style={{ background: "#D9A94E", color: "#151B26" }}
            >
              രേഖപ്പെടുത്താൻ തുടങ്ങുക <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setPage("attendance")}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 card-edge"
              style={{ color: "#EDE7D9", background: "#1B2330" }}
            >
              <ClipboardCheck size={15} /> ഹാജർ എടുക്കുക
            </button>
            <button
              onClick={() => setPage("report")}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 card-edge"
              style={{ color: "#EDE7D9", background: "#1B2330" }}
            >
              <BarChart3 size={15} /> റിപ്പോർട്ട് കാണുക
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN APP ----------------
  return (
    <div className="min-h-screen w-full" style={shellStyle}>
      {fontImports}
      <div className="grain" />

      <header className="px-5 pt-6 pb-6 sm:px-10 sm:pt-8 sm:pb-8 border-b" style={{ borderColor: "rgba(217,169,78,0.14)" }}>
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
          <button className="flex items-center gap-3 text-left" onClick={() => setPage("home")}>
            <Logo size={40} pct={communityStats.avgPct} />
            <div>
              <h1 className="display-font text-xl sm:text-2xl" style={{ color: "#EDE7D9" }}>
                {appName}
              </h1>
              <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "#9AA5B1" }}>
                <Home size={11} /> ഹോം പേജിലേക്ക്
              </p>
            </div>
          </button>
          <div className="flex gap-2 num-font text-sm flex-wrap justify-end">
            <button
              onClick={() => setPage("track")}
              className="px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: page === "track" ? "#D9A94E" : "transparent",
                color: page === "track" ? "#151B26" : "#9AA5B1",
                border: "1px solid rgba(217,169,78,0.3)",
              }}
            >
              രേഖപ്പെടുത്തുക
            </button>
            <button
              onClick={() => setPage("attendance")}
              className="px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              style={{
                background: page === "attendance" ? "#D9A94E" : "transparent",
                color: page === "attendance" ? "#151B26" : "#9AA5B1",
                border: "1px solid rgba(217,169,78,0.3)",
              }}
            >
              <ClipboardCheck size={14} /> ഹാജർ
            </button>
            <button
              onClick={() => setPage("report")}
              className="px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              style={{
                background: page === "report" ? "#D9A94E" : "transparent",
                color: page === "report" ? "#151B26" : "#9AA5B1",
                border: "1px solid rgba(217,169,78,0.3)",
              }}
            >
              <BarChart3 size={14} /> റിപ്പോർട്ട്
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-6 grid grid-cols-3 gap-3 sm:gap-6">
          {[
            ["കുടുംബങ്ങൾ", communityStats.familyCount],
            ["അംഗങ്ങൾ", communityStats.memberCount],
            ["ശരാശരി പുരോഗതി", `${communityStats.avgPct}%`],
          ].map(([label, val]) => (
            <div key={label} className="rounded-xl px-3 py-3 sm:px-5 sm:py-4 card-edge" style={{ background: "#1B2330" }}>
              <div className="num-font text-xl sm:text-2xl font-semibold" style={{ color: "#F3C969" }}>{val}</div>
              <div className="text-xs mt-1" style={{ color: "#9AA5B1" }}>{label}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-10 py-8">
        {page === "track" ? (
          <>
            {/* activities manager */}
            <section className="mb-8 rounded-2xl p-5 card-edge" style={{ background: "#1B2330" }}>
              <h2 className="display-font text-lg mb-3" style={{ color: "#EDE7D9" }}>
                നിരീക്ഷിക്കേണ്ട പ്രവർത്തനങ്ങൾ
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {activities.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                    style={{ background: "#242D3D", color: "#EDE7D9" }}
                  >
                    <EditableText value={a.name} onSave={(v) => renameActivity(a.id, v)} className="text-xs" />
                    <button onClick={() => removeActivity(a.id)} aria-label="നീക്കം ചെയ്യുക">
                      <X size={12} style={{ color: "#9AA5B1" }} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addActivity()}
                  placeholder="പുതിയ പ്രവർത്തനം ചേർക്കുക"
                  className="flex-1 text-sm rounded-lg px-3 py-2 outline-none"
                  style={{ background: "#242D3D", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
                />
                <button onClick={addActivity} className="px-3 rounded-lg flex items-center gap-1 text-sm" style={{ background: "#D9A94E", color: "#151B26" }}>
                  <Plus size={15} /> ചേർക്കുക
                </button>
              </div>
            </section>

            {/* families */}
            <div className="space-y-4">
              {families.map((family) => {
                const stats = familyStats(family);
                const isOpen = expanded.has(family.id);
                return (
                  <div key={family.id} className="rounded-2xl card-edge overflow-hidden" style={{ background: "#1B2330" }}>
                    <div className="w-full flex items-center justify-between px-5 py-4">
                      <button className="flex items-center gap-3 flex-1 text-left" onClick={() => toggleExpand(family.id)}>
                        <Logo size={36} pct={stats.pct} />
                        <div>
                          <div className="display-font text-base" style={{ color: "#EDE7D9" }}>
                            <EditableText value={family.name} onSave={(v) => renameFamily(family.id, v)} />
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: "#9AA5B1" }}>{family.members.length} അംഗങ്ങൾ</div>
                        </div>
                      </button>
                      <div className="flex items-center gap-3">
                        <span className="num-font text-sm font-semibold" style={{ color: pctColor(stats.pct) }}>{stats.pct}%</span>
                        <button onClick={() => toggleExpand(family.id)}>
                          {isOpen ? <ChevronUp size={18} style={{ color: "#9AA5B1" }} /> : <ChevronDown size={18} style={{ color: "#9AA5B1" }} />}
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-5 pb-5">
                        <div className="h-px mb-4" style={{ background: "rgba(217,169,78,0.14)" }} />
                        {family.members.length === 0 && (
                          <p className="text-sm mb-3" style={{ color: "#9AA5B1" }}>ഈ കുടുംബത്തിൽ ഇതുവരെ അംഗങ്ങളെ ചേർത്തിട്ടില്ല.</p>
                        )}
                        <div className="space-y-3">
                          {family.members.map((mem) => {
                            const ag = AGE_GROUPS.find((g) => g.id === mem.ageGroup);
                            const Icon = ag?.icon || Users;
                            const mPct = memberPct(mem.id);
                            const memberNotes = notes[mem.id] || [];
                            const notesOpen = openNotesFor === mem.id;
                            return (
                              <div key={mem.id} className="rounded-xl p-3.5" style={{ background: "#151B26" }}>
                                <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    <Icon size={15} style={{ color: "#D9A94E" }} />
                                    <span className="text-sm font-medium" style={{ color: "#EDE7D9" }}>
                                      <EditableText value={mem.name} onSave={(v) => renameMember(family.id, mem.id, v)} />
                                    </span>
                                    <select
                                      value={mem.ageGroup}
                                      onChange={(e) => setMemberAgeGroup(family.id, mem.id, e.target.value)}
                                      className="text-[11px] px-2 py-0.5 rounded-full outline-none"
                                      style={{ background: "#242D3D", color: "#9AA5B1", border: "none" }}
                                    >
                                      {AGE_GROUPS.map((g) => (
                                        <option key={g.id} value={g.id}>{g.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="num-font text-xs" style={{ color: pctColor(mPct) }}>{mPct}%</span>
                                    <button onClick={() => removeMember(family.id, mem.id)}>
                                      <Trash2 size={13} style={{ color: "#6B7280" }} />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-2.5">
                                  {activities.map((a) => {
                                    const checked = !!(logs[mem.id] && logs[mem.id][a.id]);
                                    return (
                                      <button
                                        key={a.id}
                                        onClick={() => toggleLog(mem.id, a.id)}
                                        className="text-xs px-2.5 py-1.5 rounded-lg transition-colors text-left"
                                        style={{
                                          background: checked ? "rgba(217,169,78,0.18)" : "#1B2330",
                                          color: checked ? "#F3C969" : "#9AA5B1",
                                          border: `1px solid ${checked ? "rgba(217,169,78,0.4)" : "rgba(255,255,255,0.06)"}`,
                                        }}
                                      >
                                        {a.name}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* daily notes */}
                                <div className="pt-2.5" style={{ borderTop: "1px dashed rgba(255,255,255,0.07)" }}>
                                  <div className="flex items-center justify-between">
                                    <button
                                      className="text-xs flex items-center gap-1.5"
                                      style={{ color: "#9AA5B1" }}
                                      onClick={() => setOpenNotesFor(notesOpen ? null : mem.id)}
                                    >
                                      <NotebookPen size={12} />
                                      പരാമർശങ്ങൾ (Remarks) {memberNotes.length > 0 && `(${memberNotes.length})`}
                                      {notesOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                    </button>
                                    <button
                                      className="text-xs flex items-center gap-1"
                                      style={{ color: "#D9A94E" }}
                                      onClick={() => {
                                        setNoteEditorFor(mem.id);
                                        setNoteDraft({ date: todayStr(), text: "" });
                                        setOpenNotesFor(mem.id);
                                      }}
                                    >
                                      <Plus size={12} /> പരാമർശം ചേർക്കുക
                                    </button>
                                  </div>

                                  {notesOpen && (
                                    <div className="mt-2.5 space-y-2">
                                      {noteEditorFor === mem.id && (
                                        <div className="rounded-lg p-2.5" style={{ background: "#1B2330" }}>
                                          <div className="flex items-center gap-2 mb-2">
                                            <CalendarDays size={12} style={{ color: "#9AA5B1" }} />
                                            <input
                                              type="date"
                                              value={noteDraft.date}
                                              onChange={(e) => setNoteDraft((d) => ({ ...d, date: e.target.value }))}
                                              className="text-xs rounded px-2 py-1 outline-none num-font"
                                              style={{ background: "#242D3D", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
                                            />
                                          </div>
                                          <textarea
                                            autoFocus
                                            value={noteDraft.text}
                                            onChange={(e) => setNoteDraft((d) => ({ ...d, text: e.target.value }))}
                                            placeholder={`${mem.name} പറഞ്ഞതും ചെയ്തതും — വിശദമായി ഇവിടെ കുറിക്കുക...`}
                                            rows={3}
                                            className="w-full text-sm rounded-lg px-3 py-2 outline-none resize-none"
                                            style={{ background: "#242D3D", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
                                          />
                                          <div className="flex gap-2 mt-2">
                                            <button
                                              onClick={() => saveNote(mem.id)}
                                              className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                                              style={{ background: "#D9A94E", color: "#151B26" }}
                                            >
                                              <Check size={12} /> സേവ് ചെയ്യുക
                                            </button>
                                            <button
                                              onClick={() => setNoteEditorFor(null)}
                                              className="text-xs px-2 py-1.5"
                                              style={{ color: "#9AA5B1" }}
                                            >
                                              റദ്ദാക്കുക
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      {memberNotes.length === 0 && noteEditorFor !== mem.id && (
                                        <p className="text-xs" style={{ color: "#6B7280" }}>ഇതുവരെ കുറിപ്പുകളൊന്നും ചേർത്തിട്ടില്ല.</p>
                                      )}

                                      {memberNotes.map((n) => (
                                        <div key={n.id} className="rounded-lg p-2.5" style={{ background: "#1B2330" }}>
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] num-font" style={{ color: "#D9A94E" }}>{fmtDate(n.date)}</span>
                                            <button onClick={() => deleteNote(mem.id, n.id)}>
                                              <Trash2 size={11} style={{ color: "#6B7280" }} />
                                            </button>
                                          </div>
                                          <textarea
                                            value={n.text}
                                            onChange={(e) => editNoteText(mem.id, n.id, e.target.value)}
                                            rows={2}
                                            className="w-full text-sm outline-none resize-none bg-transparent"
                                            style={{ color: "#EDE7D9" }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {addingMemberFor === family.id ? (
                          <div className="mt-3 flex flex-wrap gap-2 items-center">
                            <input
                              autoFocus
                              value={memberDraft.name}
                              onChange={(e) => setMemberDraft((d) => ({ ...d, name: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && addMember(family.id)}
                              placeholder="പേര്"
                              className="text-sm rounded-lg px-3 py-2 outline-none flex-1 min-w-[120px]"
                              style={{ background: "#242D3D", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
                            />
                            <select
                              value={memberDraft.ageGroup}
                              onChange={(e) => setMemberDraft((d) => ({ ...d, ageGroup: e.target.value }))}
                              className="text-sm rounded-lg px-2 py-2 outline-none"
                              style={{ background: "#242D3D", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
                            >
                              {AGE_GROUPS.map((g) => (
                                <option key={g.id} value={g.id}>{g.label}</option>
                              ))}
                            </select>
                            <button onClick={() => addMember(family.id)} className="px-3 py-2 rounded-lg text-sm" style={{ background: "#D9A94E", color: "#151B26" }}>
                              ചേർക്കുക
                            </button>
                            <button onClick={() => setAddingMemberFor(null)} className="px-2 py-2 text-sm" style={{ color: "#9AA5B1" }}>
                              റദ്ദാക്കുക
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setAddingMemberFor(family.id)} className="mt-3 text-sm flex items-center gap-1.5" style={{ color: "#D9A94E" }}>
                            <Plus size={14} /> അംഗത്തെ ചേർക്കുക
                          </button>
                        )}

                        <button onClick={() => removeFamily(family.id)} className="mt-4 text-xs flex items-center gap-1" style={{ color: "#6B7280" }}>
                          <Trash2 size={12} /> കുടുംബം നീക്കം ചെയ്യുക
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              {showAddFamily ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFamily()}
                    placeholder="കുടുംബത്തിന്റെ പേര്"
                    className="flex-1 text-sm rounded-lg px-3 py-2 outline-none"
                    style={{ background: "#1B2330", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
                  />
                  <button onClick={addFamily} className="px-3 rounded-lg text-sm" style={{ background: "#D9A94E", color: "#151B26" }}>
                    ചേർക്കുക
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddFamily(true)}
                  className="w-full rounded-2xl py-3 text-sm flex items-center justify-center gap-2 card-edge"
                  style={{ color: "#D9A94E", background: "#1B2330" }}
                >
                  <Plus size={16} /> പുതിയ കുടുംബം ചേർക്കുക
                </button>
              )}
            </div>
          </>
        ) : page === "attendance" ? (
          <AttendancePage
            families={families}
            eventTypes={eventTypes}
            attDate={attDate}
            setAttDate={setAttDate}
            attEventId={attEventId}
            setAttEventId={setAttEventId}
            newEventType={newEventType}
            setNewEventType={setNewEventType}
            addEventType={addEventType}
            renameEventType={renameEventType}
            removeEventType={removeEventType}
            attendance={attendance}
            markAttendance={markAttendance}
            memberAttendanceStats={memberAttendanceStats}
            expanded={expanded}
            toggleExpand={toggleExpand}
          />
        ) : (
          <ReportView
            families={families}
            activities={activities}
            logs={logs}
            notes={notes}
            memberPct={memberPct}
            familyStats={familyStats}
            eventTypes={eventTypes}
            attendance={attendance}
            memberAttendanceStats={memberAttendanceStats}
            attendanceDatesFor={attendanceDatesFor}
          />
        )}
      </main>

      <footer className="text-center text-xs pb-8" style={{ color: "#5A6270" }}>
        <p>ഡാറ്റ ഈ മൊബൈലിൽ തന്നെ സൂക്ഷിക്കപ്പെടുന്നു.{saveError && " (സേവ് ചെയ്യുന്നതിൽ പിശക് — വീണ്ടും ശ്രമിക്കുക)"}</p>
        <button onClick={resetAllData} className="mt-2 underline underline-offset-2" style={{ color: "#6B7280" }}>
          എല്ലാ ഡാറ്റയും മായ്ക്കുക
        </button>
      </footer>
    </div>
  );
}

function AttendancePage({
  families,
  eventTypes,
  attDate,
  setAttDate,
  attEventId,
  setAttEventId,
  newEventType,
  setNewEventType,
  addEventType,
  renameEventType,
  removeEventType,
  attendance,
  markAttendance,
  memberAttendanceStats,
  expanded,
  toggleExpand,
}) {
  const dayAtt = attendance[attEventId]?.[attDate] || {};
  let presentCount = 0;
  let totalMembers = 0;
  families.forEach((f) =>
    f.members.forEach((m) => {
      totalMembers += 1;
      if (dayAtt[m.id]) presentCount += 1;
    })
  );

  return (
    <>
      <section className="mb-6 rounded-2xl p-5 card-edge" style={{ background: "#1B2330" }}>
        <h2 className="display-font text-lg mb-3" style={{ color: "#EDE7D9" }}>
          ഹാജർ എടുക്കേണ്ട ദിവസങ്ങൾ
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {eventTypes.map((e) => (
            <span
              key={e.id}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ background: "#242D3D", color: "#EDE7D9" }}
            >
              <EditableText value={e.name} onSave={(v) => renameEventType(e.id, v)} className="text-xs" />
              <button onClick={() => removeEventType(e.id)} aria-label="നീക്കം ചെയ്യുക">
                <X size={12} style={{ color: "#9AA5B1" }} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newEventType}
            onChange={(e) => setNewEventType(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEventType()}
            placeholder="പുതിയ ദിവസം / പരിപാടി (ഉദാ: കൺവെൻഷൻ)"
            className="flex-1 text-sm rounded-lg px-3 py-2 outline-none"
            style={{ background: "#242D3D", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
          />
          <button onClick={addEventType} className="px-3 rounded-lg flex items-center gap-1 text-sm" style={{ background: "#D9A94E", color: "#151B26" }}>
            <Plus size={15} /> ചേർക്കുക
          </button>
        </div>
      </section>

      <section className="mb-6 rounded-2xl p-5 card-edge" style={{ background: "#1B2330" }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} style={{ color: "#9AA5B1" }} />
            <input
              type="date"
              value={attDate}
              onChange={(e) => setAttDate(e.target.value)}
              className="text-sm rounded-lg px-2 py-1.5 outline-none num-font"
              style={{ background: "#242D3D", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
            />
          </div>
          <select
            value={attEventId || ""}
            onChange={(e) => setAttEventId(e.target.value)}
            className="text-sm rounded-lg px-2 py-1.5 outline-none"
            style={{ background: "#242D3D", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
          >
            {eventTypes.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <span className="text-xs num-font ml-auto" style={{ color: "#9AA5B1" }}>
            {presentCount}/{totalMembers} ഹാജർ
          </span>
        </div>
      </section>

      {!attEventId ? (
        <p className="text-sm" style={{ color: "#9AA5B1" }}>ആദ്യം മുകളിൽ ഒരു ദിവസം / പരിപാടി ചേർക്കുക.</p>
      ) : (
        <div className="space-y-4">
          {families.map((family) => {
            const isOpen = expanded.has(family.id);
            const famPresent = family.members.filter((m) => dayAtt[m.id]).length;
            return (
              <div key={family.id} className="rounded-2xl card-edge overflow-hidden" style={{ background: "#1B2330" }}>
                <button onClick={() => toggleExpand(family.id)} className="w-full flex items-center justify-between px-5 py-4">
                  <div className="text-left">
                    <div className="display-font text-base" style={{ color: "#EDE7D9" }}>{family.name}</div>
                    <div className="text-xs mt-0.5 num-font" style={{ color: "#9AA5B1" }}>{famPresent}/{family.members.length} ഹാജർ</div>
                  </div>
                  {isOpen ? <ChevronUp size={18} style={{ color: "#9AA5B1" }} /> : <ChevronDown size={18} style={{ color: "#9AA5B1" }} />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="h-px mb-3" style={{ background: "rgba(217,169,78,0.14)" }} />
                    <div className="space-y-2">
                      {family.members.map((mem) => {
                        const val = dayAtt[mem.id];
                        const stats = memberAttendanceStats(attEventId, mem.id);
                        return (
                          <div key={mem.id} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#151B26" }}>
                            <div>
                              <span className="text-sm" style={{ color: "#EDE7D9" }}>{mem.name}</span>
                              {stats.marked > 0 && (
                                <span className="text-[11px] num-font ml-2" style={{ color: "#9AA5B1" }}>({stats.pct}% മൊത്തം ഹാജർ)</span>
                              )}
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => markAttendance(attEventId, attDate, mem.id, true)}
                                className="px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1"
                                style={{
                                  background: val === true ? "rgba(143,168,118,0.25)" : "#1B2330",
                                  color: val === true ? "#8FA876" : "#9AA5B1",
                                  border: `1px solid ${val === true ? "#8FA876" : "rgba(255,255,255,0.08)"}`,
                                }}
                              >
                                <UserCheck size={13} /> ഉണ്ട്
                              </button>
                              <button
                                onClick={() => markAttendance(attEventId, attDate, mem.id, false)}
                                className="px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1"
                                style={{
                                  background: val === false ? "rgba(193,101,61,0.2)" : "#1B2330",
                                  color: val === false ? "#C1653D" : "#9AA5B1",
                                  border: `1px solid ${val === false ? "#C1653D" : "rgba(255,255,255,0.08)"}`,
                                }}
                              >
                                <UserX size={13} /> ഇല്ല
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function ReportView({ families, activities, logs, notes, memberPct, familyStats, eventTypes, attendance, memberAttendanceStats, attendanceDatesFor }) {
  const [openFamily, setOpenFamily] = useState(null);
  const [mode, setMode] = useState("family"); // family | age | attendance

  const modeToggle = (
    <div className="flex gap-2 mb-5 num-font text-sm flex-wrap">
      <button
        onClick={() => setMode("family")}
        className="px-3 py-1.5 rounded-full"
        style={{
          background: mode === "family" ? "#D9A94E" : "transparent",
          color: mode === "family" ? "#151B26" : "#9AA5B1",
          border: "1px solid rgba(217,169,78,0.3)",
        }}
      >
        കുടുംബം അടിസ്ഥാനത്തിൽ
      </button>
      <button
        onClick={() => setMode("age")}
        className="px-3 py-1.5 rounded-full"
        style={{
          background: mode === "age" ? "#D9A94E" : "transparent",
          color: mode === "age" ? "#151B26" : "#9AA5B1",
          border: "1px solid rgba(217,169,78,0.3)",
        }}
      >
        പ്രായം അടിസ്ഥാനത്തിൽ
      </button>
      <button
        onClick={() => setMode("attendance")}
        className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
        style={{
          background: mode === "attendance" ? "#D9A94E" : "transparent",
          color: mode === "attendance" ? "#151B26" : "#9AA5B1",
          border: "1px solid rgba(217,169,78,0.3)",
        }}
      >
        <ClipboardCheck size={13} /> ഹാജർ
      </button>
    </div>
  );

  if (mode === "age") {
    return (
      <div>
        <h2 className="display-font text-xl mb-2" style={{ color: "#EDE7D9" }}>
          പ്രായ വിഭാഗം അടിസ്ഥാനത്തിലുള്ള റിപ്പോർട്ട്
        </h2>
        {modeToggle}
        <AgeGroupReport families={families} activities={activities} logs={logs} notes={notes} memberPct={memberPct} />
      </div>
    );
  }

  if (mode === "attendance") {
    return (
      <div>
        <h2 className="display-font text-xl mb-2" style={{ color: "#EDE7D9" }}>
          ഹാജർ റിപ്പോർട്ട്
        </h2>
        {modeToggle}
        <AttendanceReport
          families={families}
          eventTypes={eventTypes}
          attendance={attendance}
          memberAttendanceStats={memberAttendanceStats}
          attendanceDatesFor={attendanceDatesFor}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="display-font text-xl mb-2" style={{ color: "#EDE7D9" }}>
        കുടുംബാടിസ്ഥാനത്തിലുള്ള റിപ്പോർട്ട്
      </h2>
      {modeToggle}
      {families.map((family) => {
        const stats = familyStats(family);
        const byGroup = AGE_GROUPS.map((g) => ({ ...g, members: family.members.filter((m) => m.ageGroup === g.id) })).filter((g) => g.members.length > 0);
        const isOpen = openFamily === family.id;

        return (
          <div key={family.id} className="rounded-2xl card-edge overflow-hidden" style={{ background: "#1B2330" }}>
            <button onClick={() => setOpenFamily(isOpen ? null : family.id)} className="w-full flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Logo size={40} pct={stats.pct} />
                <div className="text-left">
                  <div className="display-font text-base" style={{ color: "#EDE7D9" }}>{family.name}</div>
                  <div className="text-xs mt-0.5 num-font" style={{ color: "#9AA5B1" }}>{stats.done}/{stats.total} പ്രവർത്തനങ്ങൾ പൂർത്തിയായി</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-28 h-2 rounded-full overflow-hidden hidden sm:block" style={{ background: "#242D3D" }}>
                  <div className="h-full rounded-full" style={{ width: `${stats.pct}%`, background: pctColor(stats.pct) }} />
                </div>
                <span className="num-font text-sm font-semibold w-12 text-right" style={{ color: pctColor(stats.pct) }}>{stats.pct}%</span>
                {isOpen ? <ChevronUp size={18} style={{ color: "#9AA5B1" }} /> : <ChevronDown size={18} style={{ color: "#9AA5B1" }} />}
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5">
                <div className="h-px mb-4" style={{ background: "rgba(217,169,78,0.14)" }} />
                {byGroup.length === 0 && <p className="text-sm" style={{ color: "#9AA5B1" }}>അംഗങ്ങളില്ല.</p>}
                {byGroup.map((g) => (
                  <div key={g.id} className="mb-5 last:mb-0">
                    <div className="text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "#D9A94E" }}>
                      <g.icon size={13} /> {g.label}
                    </div>
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ color: "#9AA5B1" }}>
                            <th className="text-left font-normal pb-2">പേര്</th>
                            {activities.map((a) => (
                              <th key={a.id} className="text-center font-normal pb-2 px-1.5 text-[11px]">{a.name}</th>
                            ))}
                            <th className="text-right font-normal pb-2 num-font">%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {g.members.map((mem) => {
                            const mPct = memberPct(mem.id);
                            return (
                              <tr key={mem.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                <td className="py-2" style={{ color: "#EDE7D9" }}>{mem.name}</td>
                                {activities.map((a) => {
                                  const done = !!(logs[mem.id] && logs[mem.id][a.id]);
                                  return (
                                    <td key={a.id} className="text-center">
                                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: done ? "#F3C969" : "rgba(255,255,255,0.1)" }} />
                                    </td>
                                  );
                                })}
                                <td className="text-right num-font" style={{ color: pctColor(mPct) }}>{mPct}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* notes summary per member in this age group */}
                    {g.members.map((mem) => {
                      const memberNotes = notes[mem.id] || [];
                      if (memberNotes.length === 0) return null;
                      return (
                        <div key={mem.id} className="mb-2 rounded-lg p-2.5" style={{ background: "#151B26" }}>
                          <div className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: "#EDE7D9" }}>
                            <NotebookPen size={11} style={{ color: "#D9A94E" }} /> {mem.name} — പരാമർശങ്ങൾ
                          </div>
                          <div className="space-y-1.5">
                            {memberNotes.slice(0, 4).map((n) => (
                              <div key={n.id} className="text-xs" style={{ color: "#9AA5B1" }}>
                                <span className="num-font" style={{ color: "#D9A94E" }}>{fmtDate(n.date)}:</span> {n.text}
                              </div>
                            ))}
                            {memberNotes.length > 4 && (
                              <div className="text-[11px]" style={{ color: "#6B7280" }}>+{memberNotes.length - 4} കൂടുതൽ</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AttendanceReport({ families, eventTypes, attendance, memberAttendanceStats, attendanceDatesFor }) {
  const [eventId, setEventId] = useState(eventTypes[0]?.id || null);

  useEffect(() => {
    if (!eventId && eventTypes.length > 0) setEventId(eventTypes[0].id);
  }, [eventTypes, eventId]);

  if (eventTypes.length === 0) {
    return <p className="text-sm" style={{ color: "#9AA5B1" }}>ഇതുവരെ ഹാജർ ദിവസങ്ങളൊന്നും ചേർത്തിട്ടില്ല.</p>;
  }

  const dates = attendanceDatesFor(eventId).slice(0, 8);
  const activeEvent = eventTypes.find((e) => e.id === eventId);

  return (
    <div>
      <select
        value={eventId || ""}
        onChange={(e) => setEventId(e.target.value)}
        className="text-sm rounded-lg px-3 py-2 outline-none mb-4 num-font"
        style={{ background: "#1B2330", color: "#EDE7D9", border: "1px solid rgba(217,169,78,0.2)" }}
      >
        {eventTypes.map((e) => (
          <option key={e.id} value={e.id}>{e.name}</option>
        ))}
      </select>

      <div className="space-y-4">
        {families.map((family) => {
          if (family.members.length === 0) return null;
          return (
            <div key={family.id} className="rounded-2xl card-edge overflow-hidden p-5" style={{ background: "#1B2330" }}>
              <div className="display-font text-base mb-3" style={{ color: "#EDE7D9" }}>{family.name}</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "#9AA5B1" }}>
                      <th className="text-left font-normal pb-2">പേര്</th>
                      {dates.map((d) => (
                        <th key={d} className="text-center font-normal pb-2 px-1.5 text-[10px] num-font">{fmtDate(d).split(" ").slice(0, 2).join(" ")}</th>
                      ))}
                      <th className="text-right font-normal pb-2 num-font">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {family.members.map((mem) => {
                      const stats = memberAttendanceStats(eventId, mem.id);
                      return (
                        <tr key={mem.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <td className="py-2" style={{ color: "#EDE7D9" }}>{mem.name}</td>
                          {dates.map((d) => {
                            const v = attendance[eventId]?.[d]?.[mem.id];
                            return (
                              <td key={d} className="text-center">
                                <span
                                  className="inline-block w-2.5 h-2.5 rounded-full"
                                  style={{ background: v === true ? "#8FA876" : v === false ? "#C1653D" : "rgba(255,255,255,0.1)" }}
                                />
                              </td>
                            );
                          })}
                          <td className="text-right num-font" style={{ color: pctColor(stats.pct) }}>{stats.marked ? `${stats.pct}%` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      {dates.length === 0 && (
        <p className="text-sm mt-3" style={{ color: "#9AA5B1" }}>
          {activeEvent?.name} എന്നതിന് ഇതുവരെ ഹാജർ രേഖപ്പെടുത്തിയിട്ടില്ല — "ഹാജർ" പേജിൽ പോയി തുടങ്ങാം.
        </p>
      )}
    </div>
  );
}

function AgeGroupReport({ families, activities, logs, notes, memberPct }) {
  const [openGroup, setOpenGroup] = useState(AGE_GROUPS[0].id);

  return (
    <div className="space-y-4">
      {AGE_GROUPS.map((g) => {
        const rows = [];
        families.forEach((f) => {
          f.members.forEach((m) => {
            if (m.ageGroup === g.id) rows.push({ ...m, familyName: f.name });
          });
        });
        const avgPct = rows.length
          ? Math.round(rows.reduce((sum, m) => sum + memberPct(m.id), 0) / rows.length)
          : 0;
        const isOpen = openGroup === g.id;
        const Icon = g.icon;

        return (
          <div key={g.id} className="rounded-2xl card-edge overflow-hidden" style={{ background: "#1B2330" }}>
            <button
              onClick={() => setOpenGroup(isOpen ? null : g.id)}
              className="w-full flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "#242D3D" }}
                >
                  <Icon size={17} style={{ color: "#D9A94E" }} />
                </div>
                <div className="text-left">
                  <div className="display-font text-base" style={{ color: "#EDE7D9" }}>
                    {g.label} <span className="text-xs" style={{ color: "#9AA5B1" }}>({g.sub})</span>
                  </div>
                  <div className="text-xs mt-0.5 num-font" style={{ color: "#9AA5B1" }}>{rows.length} പേർ</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="num-font text-sm font-semibold" style={{ color: pctColor(avgPct) }}>{avgPct}%</span>
                {isOpen ? <ChevronUp size={18} style={{ color: "#9AA5B1" }} /> : <ChevronDown size={18} style={{ color: "#9AA5B1" }} />}
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5">
                <div className="h-px mb-4" style={{ background: "rgba(217,169,78,0.14)" }} />
                {rows.length === 0 ? (
                  <p className="text-sm" style={{ color: "#9AA5B1" }}>ഈ വിഭാഗത്തിൽ ഇതുവരെ ആരുമില്ല.</p>
                ) : (
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ color: "#9AA5B1" }}>
                          <th className="text-left font-normal pb-2">പേര്</th>
                          <th className="text-left font-normal pb-2">കുടുംബം</th>
                          {activities.map((a) => (
                            <th key={a.id} className="text-center font-normal pb-2 px-1.5 text-[11px]">{a.name}</th>
                          ))}
                          <th className="text-right font-normal pb-2 num-font">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((mem) => {
                          const mPct = memberPct(mem.id);
                          return (
                            <tr key={mem.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                              <td className="py-2" style={{ color: "#EDE7D9" }}>{mem.name}</td>
                              <td className="py-2" style={{ color: "#9AA5B1" }}>{mem.familyName}</td>
                              {activities.map((a) => {
                                const done = !!(logs[mem.id] && logs[mem.id][a.id]);
                                return (
                                  <td key={a.id} className="text-center">
                                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: done ? "#F3C969" : "rgba(255,255,255,0.1)" }} />
                                  </td>
                                );
                              })}
                              <td className="text-right num-font" style={{ color: pctColor(mPct) }}>{mPct}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {rows.map((mem) => {
                  const memberNotes = notes[mem.id] || [];
                  if (memberNotes.length === 0) return null;
                  return (
                    <div key={mem.id} className="mb-2 rounded-lg p-2.5" style={{ background: "#151B26" }}>
                      <div className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: "#EDE7D9" }}>
                        <NotebookPen size={11} style={{ color: "#D9A94E" }} /> {mem.name} ({mem.familyName}) — പരാമർശങ്ങൾ
                      </div>
                      <div className="space-y-1.5">
                        {memberNotes.slice(0, 4).map((n) => (
                          <div key={n.id} className="text-xs" style={{ color: "#9AA5B1" }}>
                            <span className="num-font" style={{ color: "#D9A94E" }}>{fmtDate(n.date)}:</span> {n.text}
                          </div>
                        ))}
                        {memberNotes.length > 4 && (
                          <div className="text-[11px]" style={{ color: "#6B7280" }}>+{memberNotes.length - 4} കൂടുതൽ</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
