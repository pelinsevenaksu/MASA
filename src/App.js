import { useState } from "react";

const CATEGORIES = [
  {
    id: "erisim", icon: "🔑", title: "Erişim Hakkı", short: "ERİŞİM", color: "#1a3cff",
    hint: "3621 Sayılı Kıyı Kanunu: Kıyıya erişim herkesin hakkı.",
    questions: [
      "Kıyıya yürüyerek ulaşmak mümkün mü? (Bariyer, duvar, kapı yok mu?)",
      "Kıyı şeridinde ücretsiz oturma alanı var mı?",
      "Engelli erişimi var mı? (Rampa, düzgün zemin)",
      "Toplu taşımayla gelebiliyor musun, araç şart değil mi?",
      "Kıyı gece ya da kışın kapalı hale gelmiyor mu?",
    ],
  },
  {
    id: "hukuk", icon: "⚖️", title: "Hukuk & Mevzuat", short: "HUKUK", color: "#ff6b2b",
    hint: "Kıyı Kanunu ihlalleri suçtur. Belge topla, kayıt al.",
    questions: [
      "Kıyı şeridinde yapılaşma yok mu? (Kıyı Kanunu bunu yasaklar)",
      "Kıyıdaki işletmenin izin belgesi sunuluyor mu?",
      "Kıyıyı fiilen kapatan özel bir yapı yok mu?",
      "Kıyı düzenleme müdahaleleri plana uygun mu?",
      "Kıyı kenar çizgisi tabelası görünür yerde mi?",
    ],
  },
  {
    id: "ekoloji", icon: "🌿", title: "Ekolojik Durum", short: "EKOLOJİ", color: "#22c55e",
    hint: "Bozuk ekosistem herkes için kayıp. Doğal kıyı, ortak yaşam alanı.",
    questions: [
      "Kıyıda çöp, atık su, kirlilik yok mu?",
      "Doğal yüzey korunuyor mu? (Kum, çakıl — beton değil)",
      "Denize / göle doğrudan temas mümkün mü?",
      "Yakın çevrede aktif dolgu ya da inşaat yok mu?",
      "Su kalitesi yüzmek için uygun görünüyor mu?",
    ],
  },
  {
    id: "iklim", icon: "🌊", title: "İklim Direnci", short: "İKLİM", color: "#a855f7",
    hint: "Kıyı betonlaşması = iklim krizine açık kent.",
    questions: [
      "Sel, taşkın için uyarı işaretleri var mı?",
      "Doğal tampon alanlar yok edilmemiş mi? (Kumul, sulak alan)",
      "Kıyıda gölge & yeşil alan yeterli mi? (Aşırı ısınmaya karşı)",
      "Betonlaşma, su baskınında tahliye yolunu engelliyor mu?",
      "Kıyı, acil toplanma alanı olarak kullanılabilir mi?",
    ],
  },
  {
    id: "esitlik", icon: "👥", title: "Toplumsal Eşitlik", short: "EŞİTLİK", color: "#f59e0b",
    hint: "Kent hakkı = herkes için eşit erişim. Eşitsizlik görüyorsan belgele.",
    questions: [
      "Kıyı belirli bir gelir grubunun alanına dönmemiş mi?",
      "Mahalleli ve uzaktan gelenin erişimi eşit mi?",
      "Çocuklar, yaşlılar, engelliler kıyıyı güvenle kullanabiliyor mu?",
      "Balıkçılar, kıyı esnafı gibi geleneksel kullanıcılar yerinden edilmemiş mi?",
      "Kıyı yönetimine ilişkin belediye kararları herkese açık mı?",
    ],
  },
];

const SEED_REPORTS = [
  { id:1, x:54, y:44, name:"Kuşadası Merkez Sahili", score:8, reports:4, district:"Kuşadası" },
  { id:2, x:26, y:28, name:"Güzelçamlı Plajı", score:2, reports:7, district:"Güzelçamlı" },
  { id:3, x:70, y:58, name:"Kadınlar Denizi", score:5, reports:3, district:"Kuşadası" },
  { id:4, x:80, y:26, name:"Long Beach", score:1, reports:11, district:"Kuşadası" },
  { id:5, x:16, y:68, name:"Dilek Yarımadası Girişi", score:10, reports:2, district:"Söke" },
  { id:6, x:42, y:72, name:"Yat Limanı Önü", score:7, reports:5, district:"Kuşadası" },
  { id:7, x:60, y:18, name:"Davutlar Kıyısı", score:3, reports:6, district:"Kuşadası" },
];

const scoreColor  = s => s <= 3 ? "#22c55e" : s <= 6 ? "#f59e0b" : "#e63022";
const scoreBg     = s => s <= 3 ? "rgba(34,197,94,0.1)" : s <= 6 ? "rgba(245,158,11,0.1)" : "rgba(230,48,34,0.1)";
const scoreBorder = s => s <= 3 ? "rgba(34,197,94,0.25)" : s <= 6 ? "rgba(245,158,11,0.25)" : "rgba(230,48,34,0.25)";
const scoreLabel  = s => s <= 3 ? "İYİ DURUMDA" : s <= 6 ? "ENDİŞE VERİCİ" : "KRİTİK İHLAL";
const scoreEmoji  = s => s <= 3 ? "✓" : s <= 6 ? "!" : "✕";

export default function MASA() {
  const [screen, setScreen]           = useState("map");
  const [reports, setReports]         = useState(SEED_REPORTS);
  const [selectedPin, setSelectedPin] = useState(null);
  const [answers, setAnswers]         = useState({});
  const [activeCat, setActiveCat]     = useState(0);
  const [locName, setLocName]         = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [filterScore, setFilterScore] = useState("all");

  const totalQ   = CATEGORIES.reduce((s,c) => s + c.questions.length, 0);
  const answered = Object.keys(answers).length;

  const violations = () => {
    let v = 0;
    CATEGORIES.forEach(c => c.questions.forEach((_,i) => {
      const a = answers[`${c.id}_${i}`];
      if (a === "hayır" || a === "belirsiz") v++;
    }));
    return v;
  };

  const score = violations();
  const cat   = CATEGORIES[activeCat];

  const setAns = (cid, qi, val) =>
    setAnswers(p => ({ ...p, [`${cid}_${qi}`]: val }));

  const submit = () => {
    const s = violations();
    const nr = {
      id: Date.now(),
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      name: locName || "Adsız Kıyı Noktası",
      score: s, reports: 1, district: "Yeni"
    };
    setReports(p => [...p, nr]);
    setSuccessData({ score: s, name: nr.name });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setScreen("map");
      setAnswers({});
      setLocName("");
      setActiveCat(0);
    }, 3500);
  };

  const filteredReports = reports.filter(r => {
    if (filterScore === "good") return r.score <= 3;
    if (filterScore === "mid")  return r.score > 3 && r.score <= 6;
    if (filterScore === "bad")  return r.score > 6;
    return true;
  });

  return (
    <div style={{ width:"100%", height:"100vh", background:"#080808", display:"flex", flexDirection:"column", fontFamily:"'IBM Plex Sans',sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseRing{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7}50%{transform:translate(-50%,-50%) scale(1.5);opacity:.15}}
        @keyframes pinDrop{from{transform:translate(-50%,-50%) scale(0) rotate(-20deg)}to{transform:translate(-50%,-50%) scale(1) rotate(0deg)}}
        @keyframes successBoom{0%{transform:scale(.7);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        @keyframes scanLine{0%{top:0%}100%{top:100%}}
        .nav-btn:hover{background:rgba(255,255,255,0.05)!important;}
        .pin-dot:hover{filter:brightness(1.2);cursor:pointer;}
        .ans-btn:hover{opacity:.85;}
        .report-row:hover{background:rgba(255,255,255,0.03)!important;}
        .cat-tab:hover{opacity:.85;}
      `}</style>

      {/* TOP NAV */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:56, background:"rgba(8,8,8,0.98)", borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, letterSpacing:8, color:"#f2ede6", lineHeight:1 }}>
            MA<span style={{ color:"#e63022" }}>S</span>A
          </div>
          <div style={{ width:1, height:24, background:"rgba(255,255,255,0.1)" }}/>
          <div style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:3, color:"rgba(255,255,255,0.25)", textTransform:"uppercase" }}>
            KIYI İHLAL HARİTASI
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["🗺️","HARİTA","map"],["📋","RAPORLAR","reports"],["➕","DEĞERLENDİR","check"]].map(([icon,label,s]) => (
            <button key={s} className="nav-btn" onClick={() => { setSelectedPin(null); setScreen(s); }} style={{
              background: screen===s ? "rgba(230,48,34,0.12)" : "none",
              border: `1px solid ${screen===s ? "rgba(230,48,34,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: screen===s ? "#e63022" : "rgba(255,255,255,0.4)",
              fontFamily:"'Space Mono'", fontSize:9, letterSpacing:2, textTransform:"uppercase",
              padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .15s",
            }}>
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* MAP SCREEN */}
      {screen === "map" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          <div style={{ flex:1, position:"relative", overflow:"hidden", background:"linear-gradient(155deg,#0d1a2a,#091420,#060e18)" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(26,60,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,60,255,0.05) 1px,transparent 1px)", backgroundSize:"48px 48px" }}/>
            <div style={{ position:"absolute", left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(26,60,255,0.3),transparent)", animation:"scanLine 4s linear infinite", zIndex:1, pointerEvents:"none" }}/>
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              <path d="M0,340 Q100,315 200,335 Q300,355 400,328 Q500,305 600,325 Q700,340 800,330 L800,600 L0,600 Z" fill="rgba(26,60,255,0.07)"/>
              <path d="M0,340 Q100,315 200,335 Q300,355 400,328 Q500,305 600,325 Q700,340 800,330" stroke="rgba(26,60,255,0.2)" strokeWidth="1.5" fill="none"/>
              <line x1="400" y1="0" x2="420" y2="340" stroke="rgba(242,237,230,0.05)" strokeWidth="3"/>
              <line x1="0" y1="220" x2="800" y2="245" stroke="rgba(242,237,230,0.04)" strokeWidth="2"/>
              <rect x="80"  y="140" width="110" height="65" fill="rgba(242,237,230,0.025)" rx="2"/>
              <rect x="450" y="160" width="90"  height="55" fill="rgba(242,237,230,0.02)"  rx="2"/>
              <rect x="600" y="100" width="140" height="80" fill="rgba(242,237,230,0.018)" rx="2"/>
              <rect x="200" y="260" width="70"  height="40" fill="rgba(242,237,230,0.02)"  rx="2"/>
              <text x="400" y="500" fill="rgba(26,60,255,0.3)" fontSize="18" fontFamily="monospace" textAnchor="middle" letterSpacing="8">EGE DENİZİ</text>
            </svg>

            {reports.map((r, idx) => (
              <div key={r.id} className="pin-dot" onClick={() => setSelectedPin(selectedPin?.id===r.id ? null : r)}
                style={{ position:"absolute", left:`${r.x}%`, top:`${r.y}%`, transform:"translate(-50%,-50%)", zIndex: selectedPin?.id===r.id ? 20 : 10 }}>
                <div style={{ position:"absolute", top:"50%", left:"50%", width: selectedPin?.id===r.id ? 60:46, height: selectedPin?.id===r.id ? 60:46, borderRadius:"50%", background:`${scoreColor(r.score)}15`, border:`1px solid ${scoreColor(r.score)}30`, animation:`pulseRing ${2+idx*.3}s infinite`, pointerEvents:"none" }}/>
                <div style={{ position:"relative", zIndex:1, width: selectedPin?.id===r.id ? 40:32, height: selectedPin?.id===r.id ? 40:32, background: scoreColor(r.score), display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue'", fontSize: selectedPin?.id===r.id ? 20:16, color:"white", boxShadow:`0 0 ${selectedPin?.id===r.id?28:16}px ${scoreColor(r.score)}80`, border: selectedPin?.id===r.id ? "2px solid rgba(255,255,255,0.5)":"none", transition:"all .15s ease", animation:`pinDrop .4s ease ${idx*.06}s both` }}>
                  {r.score}
                </div>
                <div style={{ position:"absolute", top:-4, right:-4, zIndex:2, width:16, height:16, background:"#0a0a0a", border:`1px solid ${scoreColor(r.score)}60`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Space Mono'", fontSize:7, color:scoreColor(r.score) }}>{r.reports}</div>
              </div>
            ))}

            <div style={{ position:"absolute", bottom:24, left:24, background:"rgba(8,8,8,0.9)", border:"1px solid rgba(255,255,255,0.08)", padding:"12px 16px", backdropFilter:"blur(8px)", zIndex:15 }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:"rgba(255,255,255,0.2)", textTransform:"uppercase", marginBottom:10 }}>İHLAL SKORU</div>
              {[["#22c55e","0–3","İyi durumda"],["#f59e0b","4–6","Endişe verici"],["#e63022","7+","Kritik ihlal"]].map(([c,s,l])=>(
                <div key={s} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                  <div style={{ width:10, height:10, background:c, flexShrink:0 }}/>
                  <span style={{ fontFamily:"'Space Mono'", fontSize:8, color:"rgba(255,255,255,0.5)" }}><b style={{color:c}}>{s}</b> — {l}</span>
                </div>
              ))}
              <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.07)", fontFamily:"'Space Mono'", fontSize:7, color:"rgba(255,255,255,0.2)" }}>
                {reports.length} NOKTA · {reports.reduce((s,r)=>s+r.reports,0)} RAPOR
              </div>
            </div>

            <button onClick={() => setScreen("check")} style={{ position:"absolute", bottom:24, right: selectedPin ? 360:24, width:52, height:52, background:"#e63022", border:"none", color:"white", fontSize:26, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 32px rgba(230,48,34,0.5)", zIndex:15, fontWeight:700, transition:"right .25s" }}>+</button>
          </div>

          {/* Side panel */}
          <div style={{ width: selectedPin ? 340 : 0, overflow:"hidden", transition:"width .25s ease", background:"#0d0d0d", borderLeft:"1px solid rgba(255,255,255,0.07)", flexShrink:0, display:"flex", flexDirection:"column" }}>
            {selectedPin && (
              <div style={{ width:340, padding:24, display:"flex", flexDirection:"column", gap:20, animation:"fadeUp .2s ease", overflowY:"auto" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:"rgba(255,255,255,0.25)", textTransform:"uppercase" }}>KONUM DETAYI</div>
                  <button onClick={() => setSelectedPin(null)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:18 }}>×</button>
                </div>
                <div style={{ background: scoreBg(selectedPin.score), border:`1px solid ${scoreBorder(selectedPin.score)}`, padding:"20px 24px", display:"flex", alignItems:"center", gap:20 }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:72, color: scoreColor(selectedPin.score), lineHeight:1 }}>{selectedPin.score}</div>
                  <div>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:3, color: scoreColor(selectedPin.score), textTransform:"uppercase", marginBottom:4 }}>{scoreLabel(selectedPin.score)}</div>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:"#f2ede6", letterSpacing:1, lineHeight:1.1 }}>{selectedPin.name}</div>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:"rgba(255,255,255,0.3)", marginTop:6 }}>{selectedPin.reports} rapor · {selectedPin.district}</div>
                  </div>
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:"rgba(255,255,255,0.25)", textTransform:"uppercase" }}>İHLAL YOĞUNLUĞU</div>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:7, color: scoreColor(selectedPin.score) }}>{Math.round((selectedPin.score/25)*100)}%</div>
                  </div>
                  <div style={{ height:3, background:"rgba(255,255,255,0.07)" }}>
                    <div style={{ height:"100%", width:`${(selectedPin.score/25)*100}%`, background: scoreColor(selectedPin.score), transition:"width .4s ease" }}/>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:12 }}>KATEGORİ DAĞILIMI</div>
                  {CATEGORIES.map(c => {
                    const catScore = Math.min(5, Math.round((selectedPin.score/25) * 5 * (0.6+Math.random()*0.8)));
                    return (
                      <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <span style={{ fontSize:14, width:20, flexShrink:0 }}>{c.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                            <span style={{ fontFamily:"'Space Mono'", fontSize:8, color:"rgba(255,255,255,0.4)" }}>{c.short}</span>
                            <span style={{ fontFamily:"'Space Mono'", fontSize:8, color: c.color }}>{catScore}/5</span>
                          </div>
                          <div style={{ height:2, background:"rgba(255,255,255,0.06)" }}>
                            <div style={{ height:"100%", width:`${(catScore/5)*100}%`, background: c.color }}/>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setScreen("check")} style={{ background:"#e63022", border:"none", color:"white", fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:4, padding:"12px 0", cursor:"pointer" }}>
                  BU ALANI SEN DE PUAN VER →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKLIST SCREEN */}
      {screen === "check" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"20px 28px 16px", background:"#111", borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:3, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:8 }}>DEĞERLENDİRDİĞİN KONUM</div>
              <input placeholder="Konum adını gir — örn: Kadınlar Denizi, Kuşadası" value={locName} onChange={e=>setLocName(e.target.value)}
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", padding:"10px 14px", fontFamily:"'IBM Plex Sans'", fontSize:13, color:"#f2ede6", outline:"none" }}/>
              <div style={{ marginTop:10, display:"flex", gap:8 }}>
                {CATEGORIES.map((c,i) => {
                  const catVio = c.questions.filter((_,qi) => { const a=answers[`${c.id}_${qi}`]; return a==="hayır"||a==="belirsiz"; }).length;
                  const catAns = c.questions.filter((_,qi) => answers[`${c.id}_${qi}`]).length;
                  return (
                    <button key={c.id} className="cat-tab" onClick={() => setActiveCat(i)} style={{ flex:1, padding:"6px 4px", background: activeCat===i ? `${c.color}18`:"rgba(255,255,255,0.03)", border:`1px solid ${activeCat===i ? c.color : "rgba(255,255,255,0.08)"}`, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, transition:"all .15s" }}>
                      <span style={{ fontSize:15 }}>{c.icon}</span>
                      <span style={{ fontFamily:"'Space Mono'", fontSize:6, letterSpacing:1, textTransform:"uppercase", color: activeCat===i ? c.color : "rgba(255,255,255,0.3)" }}>{c.short}</span>
                      <span style={{ fontFamily:"'Space Mono'", fontSize:7, color: catVio>0 ? "#e63022" : catAns===5 ? "#22c55e" : "rgba(255,255,255,0.2)" }}>
                        {catAns}/5{catVio>0 ? ` ·${catVio}✕`:""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ padding:"14px 28px", background:"#0d0d0d", borderBottom:`2px solid ${cat.color}20`, flexShrink:0, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>{cat.icon}</span>
              <div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color: cat.color, letterSpacing:2 }}>{cat.title}</div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:"rgba(255,255,255,0.2)", letterSpacing:2 }}>{cat.hint}</div>
              </div>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"16px 28px", display:"flex", flexDirection:"column", gap:8 }}>
              {cat.questions.map((q,qi) => {
                const key = `${cat.id}_${qi}`;
                const ans = answers[key];
                const bc  = ans==="evet" ? "rgba(34,197,94,0.2)" : ans==="hayır" ? "rgba(230,48,34,0.2)" : ans==="belirsiz" ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.07)";
                const bg  = ans==="evet" ? "rgba(34,197,94,0.04)" : ans==="hayır" ? "rgba(230,48,34,0.04)" : ans==="belirsiz" ? "rgba(245,158,11,0.04)" : "#111";
                return (
                  <div key={qi} style={{ background:bg, border:`1px solid ${bc}`, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, animation:`fadeUp .2s ease ${qi*.04}s both` }}>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span style={{ fontFamily:"'Bebas Neue'", fontSize:20, color: cat.color, lineHeight:1, flexShrink:0, marginTop:1 }}>{qi+1}</span>
                      <div style={{ fontSize:13, color:"#f2ede6", lineHeight:1.55 }}>{q}</div>
                    </div>
                    <div style={{ display:"flex", gap:6, marginLeft:28 }}>
                      {[["evet","✓ EVET","#22c55e"],["hayır","✗ HAYIR","#e63022"],["belirsiz","? BELİRSİZ","#f59e0b"]].map(([val,label,col]) => (
                        <button key={val} className="ans-btn" onClick={() => setAns(cat.id,qi,val)} style={{ flex:1, padding:"8px 4px", border:`1px solid ${ans===val ? col : "rgba(255,255,255,0.1)"}`, background: ans===val ? `${col}20` : "none", cursor:"pointer", fontFamily:"'Space Mono'", fontSize:8, letterSpacing:1, textTransform:"uppercase", color: ans===val ? col : "rgba(255,255,255,0.35)", fontWeight: ans===val ? 700 : 400, transition:"all .1s" }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score panel */}
          <div style={{ width:280, background:"#111", borderLeft:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:"20px 20px 0", flex:1, overflowY:"auto" }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:16 }}>CANLI SKOR</div>
              <div style={{ background: scoreBg(score), border:`1px solid ${scoreBorder(score)}`, padding:"20px", textAlign:"center", marginBottom:16 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:80, color: scoreColor(score), lineHeight:1 }}>{score}</div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:4, color: scoreColor(score), textTransform:"uppercase", marginTop:4 }}>{scoreLabel(score)}</div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:"rgba(255,255,255,0.2)", marginTop:4 }}>/ 25 ihlal puanı</div>
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ height:3, background:"rgba(255,255,255,0.07)", marginBottom:4 }}>
                  <div style={{ height:"100%", width:`${(score/25)*100}%`, background: scoreColor(score), transition:"width .3s ease" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'Space Mono'", fontSize:7, color:"rgba(255,255,255,0.2)" }}>
                  <span>0 — Temiz</span><span>25 — Kritik</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:20 }}>
                {[["0–3","İYİ","#22c55e","Takip et"],["4–6","ENDİŞE","#f59e0b","Belgele & paylaş"],["7+","KRİTİK","#e63022","MASA'ya bildir"]].map(([range,label,col,action]) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:10, opacity: (range==="0–3"&&score<=3)||(range==="4–6"&&score>3&&score<=6)||(range==="7+"&&score>6) ? 1 : 0.3, transition:"opacity .3s" }}>
                    <div style={{ width:3, height:32, background:col, flexShrink:0 }}/>
                    <div>
                      <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:col, letterSpacing:2 }}>{range} — {label}</div>
                      <div style={{ fontFamily:"'Space Mono'", fontSize:7, color:"rgba(255,255,255,0.3)" }}>{action}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:"rgba(255,255,255,0.25)", letterSpacing:2, marginBottom:8 }}>YANIT: {answered}/{totalQ}</div>
              <div style={{ height:2, background:"rgba(255,255,255,0.07)", marginBottom:20 }}>
                <div style={{ height:"100%", width:`${(answered/totalQ)*100}%`, background:"rgba(255,255,255,0.2)", transition:"width .2s ease" }}/>
              </div>
              {score >= 5 && (
                <div style={{ background:"rgba(230,48,34,0.08)", border:"1px solid rgba(230,48,34,0.2)", padding:"10px 12px", marginBottom:16, animation:"fadeUp .3s ease" }}>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:"#e63022", letterSpacing:2, marginBottom:4 }}>⚠ RAPORLANABİLİR İHLAL</div>
                  <div style={{ fontFamily:"'IBM Plex Sans'", fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.5 }}>3+ ihlal tespit edildi. Bu alan resmi başvuruya konu olabilir.</div>
                </div>
              )}
            </div>
            <div style={{ padding:20, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              <button onClick={answered >= 5 ? submit : undefined} style={{ width:"100%", padding:"14px 0", background: answered >= 5 ? "#e63022" : "rgba(255,255,255,0.05)", border:"none", fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:5, color: answered >= 5 ? "white" : "rgba(255,255,255,0.15)", cursor: answered >= 5 ? "pointer" : "not-allowed", transition:"all .2s", marginBottom:8 }}>
                {answered < 5 ? `${5-answered} SORU DAHA` : "MASA'YA BİLDİR →"}
              </button>
              <div style={{ fontFamily:"'Space Mono'", fontSize:7, color:"rgba(255,255,255,0.15)", textAlign:"center", letterSpacing:2 }}>EN AZ 5 SORU GEREKLİ</div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS SCREEN */}
      {screen === "reports" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"20px 28px", background:"#111", borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
              <div style={{ display:"flex", gap:24, marginBottom:16 }}>
                {[["TOPLAM RAPOR",reports.reduce((s,r)=>s+r.reports,0),"#f2ede6"],["KRİTİK",reports.filter(r=>r.score>6).length,"#e63022"],["ENDİŞELİ",reports.filter(r=>r.score>3&&r.score<=6).length,"#f59e0b"],["İYİ",reports.filter(r=>r.score<=3).length,"#22c55e"]].map(([label,val,col]) => (
                  <div key={label}>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:38, color:col, lineHeight:1 }}>{val}</div>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:2, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {[["all","TÜMÜ"],["bad","KRİTİK"],["mid","ENDİŞE"],["good","İYİ"]].map(([val,label]) => (
                  <button key={val} onClick={()=>setFilterScore(val)} style={{ padding:"4px 12px", background: filterScore===val ? "rgba(255,255,255,0.1)" : "none", border:`1px solid ${filterScore===val ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`, cursor:"pointer", fontFamily:"'Space Mono'", fontSize:8, letterSpacing:2, textTransform:"uppercase", color: filterScore===val ? "#f2ede6" : "rgba(255,255,255,0.3)", transition:"all .15s" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 100px 80px 100px", padding:"8px 28px", background:"#0d0d0d", borderBottom:"1px solid rgba(255,255,255,0.05)", flexShrink:0 }}>
              {["SKOR","KONUM","BÖLGE","RAPOR","DURUM"].map(h => (
                <div key={h} style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>{h}</div>
              ))}
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              {[...filteredReports].sort((a,b)=>b.score-a.score).map((r,i) => (
                <div key={r.id} className="report-row" onClick={() => { setSelectedPin(r); setScreen("map"); }} style={{ display:"grid", gridTemplateColumns:"60px 1fr 100px 80px 100px", padding:"14px 28px", borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", animation:`fadeUp .15s ease ${i*.03}s both`, transition:"background .1s" }}>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <div style={{ width:40, height:40, background: scoreBg(r.score), border:`1px solid ${scoreBorder(r.score)}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:"'Bebas Neue'", fontSize:24, color: scoreColor(r.score) }}>{r.score}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:4 }}>
                    <div style={{ fontSize:13, color:"#f2ede6" }}>{r.name}</div>
                    <div style={{ height:2, background:"rgba(255,255,255,0.06)", width:120 }}>
                      <div style={{ height:"100%", width:`${(r.score/25)*100}%`, background: scoreColor(r.score) }}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", fontFamily:"'Space Mono'", fontSize:9, color:"rgba(255,255,255,0.3)" }}>{r.district}</div>
                  <div style={{ display:"flex", alignItems:"center", fontFamily:"'Space Mono'", fontSize:9, color:"rgba(255,255,255,0.3)" }}>{r.reports}</div>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <div style={{ background: scoreBg(r.score), border:`1px solid ${scoreBorder(r.score)}`, padding:"3px 8px", fontFamily:"'Space Mono'", fontSize:7, letterSpacing:1, color: scoreColor(r.score), textTransform:"uppercase" }}>
                      {scoreEmoji(r.score)} {scoreLabel(r.score).split(" ")[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {showSuccess && successData && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(8,8,8,0.97)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", animation:"successBoom .5s ease" }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:100, letterSpacing:12, lineHeight:1, color:"#f2ede6" }}>
              MA<span style={{ color:"#e63022" }}>S</span>A
            </div>
            <div style={{ fontFamily:"'Space Mono'", fontSize:10, letterSpacing:6, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginTop:8, marginBottom:32 }}>
              RAPOR ALINDI — HARİTAYA EKLENİYOR
            </div>
            <div style={{ display:"inline-block", background: scoreBg(successData.score), border:`1px solid ${scoreBorder(successData.score)}`, padding:"24px 40px" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:88, color: scoreColor(successData.score), lineHeight:1 }}>{successData.score}</div>
              <div style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:4, color: scoreColor(successData.score), textTransform:"uppercase", marginTop:6 }}>{scoreLabel(successData.score)}</div>
              <div style={{ fontFamily:"'IBM Plex Sans'", fontSize:13, color:"rgba(255,255,255,0.4)", marginTop:12 }}>{successData.name}</div>
            </div>
            <div style={{ marginTop:24, fontFamily:"'IBM Plex Sans'", fontSize:13, color:"rgba(255,255,255,0.25)", lineHeight:1.7 }}>
              {successData.score >= 5 ? "Bu alan raporlanabilir ihlal bölgesi olarak işaretlendi." : "Veriler kıyı takip haritasına eklendi."}<br/>
              <span style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:3, color:"rgba(255,255,255,0.15)" }}>#KıyımSenin #MASAKolektif</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
