import { useState } from "react";

const CATEGORIES = [
  {
    id: "erisim", icon: "🔑", title: "Erişim Hakkı", short: "ERİŞİM", color: "#b91c1c",
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
    id: "hukuk", icon: "⚖️", title: "Hukuk & Mevzuat", short: "HUKUK", color: "#b91c1c",
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
    id: "ekoloji", icon: "🌿", title: "Ekolojik Durum", short: "EKOLOJİ", color: "#b91c1c",
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
    id: "iklim", icon: "🌊", title: "İklim Direnci", short: "İKLİM", color: "#b91c1c",
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
    id: "esitlik", icon: "👥", title: "Toplumsal Eşitlik", short: "EŞİTLİK", color: "#b91c1c",
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

// Brand colors
const C = {
  bg:       "#f0d5c8",   // somon zemin
  bgDeep:   "#e8c9b8",   // biraz koyu somon
  bgLight:  "#f5e0d5",   // açık somon
  paper:    "#faf3ee",   // krem kağıt
  red:      "#b91c1c",   // koyu kırmızı
  redDark:  "#991616",   // daha koyu kırmızı
  redLight: "#dc2626",   // parlak kırmızı
  redFade:  "rgba(185,28,28,0.1)",
  redBorder:"rgba(185,28,28,0.25)",
  text:     "#2d1010",   // çok koyu kahve/kırmızı
  textMid:  "#6b2d2d",   // orta ton
  textFade: "rgba(45,16,16,0.4)",
  border:   "rgba(185,28,28,0.2)",
  borderSoft:"rgba(185,28,28,0.12)",
};

const scoreColor  = s => s <= 3 ? "#166534" : s <= 6 ? "#92400e" : C.red;
const scoreBg     = s => s <= 3 ? "rgba(22,101,52,0.08)" : s <= 6 ? "rgba(146,64,14,0.08)" : "rgba(185,28,28,0.08)";
const scoreBorder = s => s <= 3 ? "rgba(22,101,52,0.2)" : s <= 6 ? "rgba(146,64,14,0.2)" : C.redBorder;
const scoreLabel  = s => s <= 3 ? "İYİ DURUMDA" : s <= 6 ? "ENDİŞE VERİCİ" : "KRİTİK İHLAL";

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
  const [isMobile, setIsMobile]       = useState(false);

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
    const nr = { id: Date.now(), x: 15+Math.random()*70, y: 15+Math.random()*70, name: locName||"Adsız Kıyı Noktası", score: s, reports: 1, district: "Yeni" };
    setReports(p => [...p, nr]);
    setSuccessData({ score: s, name: nr.name });
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); setScreen("map"); setAnswers({}); setLocName(""); setActiveCat(0); }, 3500);
  };

  const filteredReports = reports.filter(r => {
    if (filterScore === "good") return r.score <= 3;
    if (filterScore === "mid")  return r.score > 3 && r.score <= 6;
    if (filterScore === "bad")  return r.score > 6;
    return true;
  });

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) return (
    <div style={{ width:"100%", height:"100vh", background:C.bg, display:"flex", flexDirection:"column", fontFamily:"'IBM Plex Sans',sans-serif", overflow:"hidden", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${C.redBorder};}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseRing{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6}50%{transform:translate(-50%,-50%) scale(1.5);opacity:.1}}
        @keyframes pinDrop{from{transform:translate(-50%,-50%) scale(0)}to{transform:translate(-50%,-50%) scale(1)}}
        @keyframes successPop{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
        .m-ans:hover{opacity:.8;}
        .m-pin:hover{filter:brightness(0.85);}
      `}</style>

      {/* Mobile Header */}
      <div style={{ background:C.bg, borderBottom:`2px solid ${C.red}`, padding:"12px 18px 10px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:26, letterSpacing:6, color:C.red, lineHeight:1 }}>MASA</div>
          <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:C.textFade, textTransform:"uppercase" }}>KIYI İHLAL HARİTASI</div>
        </div>
        <button onClick={() => setIsMobile(false)} style={{ background:"none", border:`1px solid ${C.border}`, padding:"4px 10px", fontFamily:"'Space Mono'", fontSize:7, letterSpacing:2, color:C.textMid, cursor:"pointer", textTransform:"uppercase" }}>
          🖥 MASAÜSTÜ
        </button>
      </div>

      {/* Mobile Map */}
      {screen === "map" && (
        <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
          {/* Map bg */}
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(160deg, ${C.bgDeep} 0%, ${C.bg} 60%, #dfc5b0 100%)` }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.redBorder} 1px,transparent 1px),linear-gradient(90deg,${C.redBorder} 1px,transparent 1px)`, backgroundSize:"36px 36px", opacity:.4 }}/>
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 390 600" preserveAspectRatio="xMidYMid slice">
              <path d="M0,360 Q80,340 160,355 Q240,370 310,348 Q360,335 390,350 L390,600 L0,600 Z" fill={`rgba(185,28,28,0.06)`}/>
              <path d="M0,360 Q80,340 160,355 Q240,370 310,348 Q360,335 390,350" stroke={`rgba(185,28,28,0.15)`} strokeWidth="1.5" fill="none"/>
              <line x1="195" y1="0" x2="205" y2="360" stroke={`rgba(185,28,28,0.06)`} strokeWidth="2"/>
              <line x1="0" y1="240" x2="390" y2="260" stroke={`rgba(185,28,28,0.05)`} strokeWidth="1.5"/>
              <rect x="50" y="150" width="80" height="50" fill={`rgba(185,28,28,0.04)`} rx="2"/>
              <rect x="220" y="170" width="60" height="40" fill={`rgba(185,28,28,0.035)`} rx="2"/>
              <text x="195" y="470" fill={`rgba(185,28,28,0.2)`} fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="5">EGE DENİZİ</text>
            </svg>
          </div>

          {/* Pins */}
          {reports.map((r,idx) => (
            <div key={r.id} className="m-pin" onClick={() => setSelectedPin(selectedPin?.id===r.id ? null : r)}
              style={{ position:"absolute", left:`${r.x}%`, top:`${r.y}%`, transform:"translate(-50%,-50%)", cursor:"pointer", zIndex: selectedPin?.id===r.id ? 12:8 }}>
              <div style={{ position:"absolute", top:"50%", left:"50%", width:40, height:40, borderRadius:"50%", background:`${scoreColor(r.score)}18`, border:`1px solid ${scoreColor(r.score)}30`, animation:`pulseRing ${2+idx*.25}s infinite`, pointerEvents:"none" }}/>
              <div style={{ position:"relative", zIndex:1, width: selectedPin?.id===r.id?36:28, height: selectedPin?.id===r.id?36:28, background: selectedPin?.id===r.id ? C.red : C.paper, border:`2px solid ${scoreColor(r.score)}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue'", fontSize: selectedPin?.id===r.id?18:14, color: selectedPin?.id===r.id ? "white" : scoreColor(r.score), boxShadow:`0 2px 12px ${scoreColor(r.score)}40`, transition:"all .15s", animation:`pinDrop .35s ease ${idx*.05}s both`, borderRadius:2 }}>
                {r.score}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div style={{ position:"absolute", bottom:90, left:14, background:C.paper, border:`1px solid ${C.border}`, padding:"10px 14px" }}>
            <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:2, color:C.textFade, textTransform:"uppercase", marginBottom:8 }}>İHLAL SKORU</div>
            {[["#166534","0–3","İyi"],["#92400e","4–6","Endişe"],[C.red,"7+","Kritik"]].map(([c,s,l])=>(
              <div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <div style={{ width:8, height:8, background:c, borderRadius:1 }}/>
                <span style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.textMid }}><b style={{color:c}}>{s}</b> {l}</span>
              </div>
            ))}
          </div>

          {/* Add btn */}
          <button onClick={() => setScreen("check")} style={{ position:"absolute", bottom:90, right:14, width:48, height:48, background:C.red, border:"none", color:"white", fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, boxShadow:`0 4px 20px rgba(185,28,28,0.4)`, borderRadius:2 }}>+</button>

          {/* Selected pin card */}
          {selectedPin && (
            <div style={{ position:"absolute", bottom:82, left:14, right:14, background:C.paper, border:`2px solid ${C.red}`, padding:16, animation:"fadeUp .2s ease", zIndex:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:2, color:C.textFade, textTransform:"uppercase", marginBottom:4 }}>{selectedPin.reports} RAPOR</div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:C.text, letterSpacing:1 }}>{selectedPin.name}</div>
                </div>
                <div style={{ background: scoreBg(selectedPin.score), border:`1px solid ${scoreBorder(selectedPin.score)}`, padding:"8px 14px", textAlign:"center", marginLeft:12 }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:32, color: scoreColor(selectedPin.score), lineHeight:1 }}>{selectedPin.score}</div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:6, letterSpacing:1, color: scoreColor(selectedPin.score), textTransform:"uppercase" }}>{scoreLabel(selectedPin.score)}</div>
                </div>
              </div>
              <button onClick={() => setScreen("check")} style={{ marginTop:12, width:"100%", padding:"10px", background:C.red, border:"none", color:"white", fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:4, cursor:"pointer" }}>
                SEN DE DEĞERLENDİR →
              </button>
            </div>
          )}

          {/* Bottom nav */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:C.paper, borderTop:`2px solid ${C.red}`, padding:"8px 0 20px", display:"flex", justifyContent:"space-around" }}>
            {[["🗺️","HARİTA","map"],["📋","RAPORLAR","reports"],["➕","EKLE","check"]].map(([icon,label,s]) => (
              <button key={s} onClick={() => { setSelectedPin(null); setScreen(s); }} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"2px 20px" }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span style={{ fontFamily:"'Space Mono'", fontSize:6, letterSpacing:2, textTransform:"uppercase", color: screen===s ? C.red : C.textFade }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Checklist */}
      {screen === "check" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"12px 18px", background:C.bgLight, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <button onClick={() => setScreen("map")} style={{ background:"none", border:"none", color:C.red, fontFamily:"'Space Mono'", fontSize:9, letterSpacing:2, cursor:"pointer", textTransform:"uppercase", marginBottom:8, padding:0 }}>← GERİ</button>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, color:C.red, letterSpacing:2 }}>KIYI DEĞERLENDİR</div>
            <input placeholder="Konum adı..." value={locName} onChange={e=>setLocName(e.target.value)}
              style={{ marginTop:8, width:"100%", background:"white", border:`1px solid ${C.border}`, padding:"8px 12px", fontFamily:"'IBM Plex Sans'", fontSize:12, color:C.text, outline:"none" }}/>
            {/* Cat tabs */}
            <div style={{ display:"flex", gap:6, marginTop:8, overflowX:"auto" }}>
              {CATEGORIES.map((c,i) => {
                const v = c.questions.filter((_,qi) => { const a=answers[`${c.id}_${qi}`]; return a==="hayır"||a==="belirsiz"; }).length;
                return (
                  <button key={c.id} onClick={() => setActiveCat(i)} style={{ flexShrink:0, padding:"4px 10px", background: activeCat===i ? C.red : "white", border:`1px solid ${activeCat===i ? C.red : C.border}`, cursor:"pointer", fontFamily:"'Space Mono'", fontSize:7, letterSpacing:1, textTransform:"uppercase", color: activeCat===i ? "white" : C.textMid, display:"flex", alignItems:"center", gap:4 }}>
                    {c.icon} {c.short} {v>0 && <span style={{ background: activeCat===i?"white":C.red, color: activeCat===i?C.red:"white", borderRadius:"50%", width:13, height:13, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:7 }}>{v}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            {cat.questions.map((q,qi) => {
              const key = `${cat.id}_${qi}`;
              const ans = answers[key];
              return (
                <div key={qi} style={{ background: ans==="evet"?"rgba(22,101,52,0.06)":ans==="hayır"?`rgba(185,28,28,0.06)`:"white", border:`1px solid ${ans==="evet"?"rgba(22,101,52,0.2)":ans==="hayır"?C.redBorder:"rgba(185,28,28,0.1)"}`, padding:"12px 14px", animation:`fadeUp .15s ease ${qi*.04}s both` }}>
                  <div style={{ fontSize:12, color:C.text, lineHeight:1.5, marginBottom:8 }}>{qi+1}. {q}</div>
                  <div style={{ display:"flex", gap:6 }}>
                    {[["evet","✓ EVET","#166534"],["hayır","✗ HAYIR",C.red],["belirsiz","? BELİRSİZ","#92400e"]].map(([val,label,col]) => (
                      <button key={val} className="m-ans" onClick={() => setAns(cat.id,qi,val)} style={{ flex:1, padding:"7px 2px", border:`1px solid ${ans===val?col:"rgba(185,28,28,0.15)"}`, background: ans===val?col:"white", cursor:"pointer", fontFamily:"'Space Mono'", fontSize:7, letterSpacing:1, textTransform:"uppercase", color: ans===val?"white":C.textMid, transition:"all .1s" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding:"14px 16px 24px", background:C.paper, borderTop:`2px solid ${C.red}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:42, color: scoreColor(score), lineHeight:1 }}>{score}</div>
              <div style={{ background: scoreBg(score), border:`1px solid ${scoreBorder(score)}`, padding:"5px 12px", fontFamily:"'Space Mono'", fontSize:8, letterSpacing:2, color: scoreColor(score), textTransform:"uppercase" }}>{scoreLabel(score)}</div>
            </div>
            <div style={{ height:2, background:C.borderSoft, marginBottom:12 }}>
              <div style={{ height:"100%", width:`${(score/25)*100}%`, background: scoreColor(score), transition:"width .3s" }}/>
            </div>
            <button onClick={answered >= 5 ? submit : undefined} style={{ width:"100%", padding:"13px", background: answered>=5?C.red:"rgba(185,28,28,0.15)", border:"none", fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:5, color: answered>=5?"white":C.textFade, cursor: answered>=5?"pointer":"not-allowed" }}>
              {answered < 5 ? `${5-answered} SORU DAHA GEREKLİ` : "MASA'YA BİLDİR →"}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Reports */}
      {screen === "reports" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", background:C.bgLight, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ display:"flex", gap:20 }}>
              {[["KRİTİK",reports.filter(r=>r.score>6).length,C.red],["ENDİŞE",reports.filter(r=>r.score>3&&r.score<=6).length,"#92400e"],["İYİ",reports.filter(r=>r.score<=3).length,"#166534"]].map(([l,v,c])=>(
                <div key={l}><div style={{ fontFamily:"'Bebas Neue'", fontSize:32, color:c, lineHeight:1 }}>{v}</div><div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:2, color:C.textFade, textTransform:"uppercase" }}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
            {[...filteredReports].sort((a,b)=>b.score-a.score).map((r,i) => (
              <div key={r.id} onClick={() => { setSelectedPin(r); setScreen("map"); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderBottom:`1px solid ${C.borderSoft}`, cursor:"pointer", animation:`fadeUp .12s ease ${i*.03}s both` }}>
                <div style={{ width:44, height:44, background: scoreBg(r.score), border:`1px solid ${scoreBorder(r.score)}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, borderRadius:2 }}>
                  <span style={{ fontFamily:"'Bebas Neue'", fontSize:26, color: scoreColor(r.score) }}>{r.score}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:C.text }}>{r.name}</div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.textFade, textTransform:"uppercase", letterSpacing:2, marginTop:3 }}>{scoreLabel(r.score)} · {r.reports} rapor</div>
                  <div style={{ height:2, background:C.borderSoft, marginTop:6, width:"80%" }}>
                    <div style={{ height:"100%", width:`${(r.score/25)*100}%`, background: scoreColor(r.score) }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:C.paper, borderTop:`2px solid ${C.red}`, padding:"8px 0 20px", display:"flex", justifyContent:"space-around" }}>
            {[["🗺️","HARİTA","map"],["📋","RAPORLAR","reports"],["➕","EKLE","check"]].map(([icon,label,s]) => (
              <button key={s} onClick={() => setScreen(s)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"2px 20px" }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span style={{ fontFamily:"'Space Mono'", fontSize:6, letterSpacing:2, textTransform:"uppercase", color: screen===s?C.red:C.textFade }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Success */}
      {showSuccess && successData && (
        <div style={{ position:"fixed", inset:0, zIndex:100, background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
          <div style={{ animation:"successPop .4s ease", textAlign:"center" }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:72, color:C.red, letterSpacing:8 }}>MASA</div>
            <div style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:4, color:C.textFade, textTransform:"uppercase", marginTop:6, marginBottom:28 }}>RAPOR ALINDI</div>
            <div style={{ background: scoreBg(successData.score), border:`2px solid ${scoreBorder(successData.score)}`, padding:"20px 32px" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:72, color: scoreColor(successData.score), lineHeight:1 }}>{successData.score}</div>
              <div style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:3, color: scoreColor(successData.score), textTransform:"uppercase", marginTop:4 }}>{scoreLabel(successData.score)}</div>
            </div>
            <div style={{ marginTop:20, fontFamily:"'IBM Plex Sans'", fontSize:12, color:C.textMid, lineHeight:1.7 }}>
              {successData.score >= 5 ? "Raporlanabilir ihlal bölgesi olarak işaretlendi." : "Kıyı takip haritasına eklendi."}<br/>
              <span style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:2, color:C.textFade }}>#KıyımSenin #MASAKolektif</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%", height:"100vh", background:C.bg, display:"flex", flexDirection:"column", fontFamily:"'IBM Plex Sans',sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${C.redBorder};}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseRing{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6}50%{transform:translate(-50%,-50%) scale(1.5);opacity:.1}}
        @keyframes pinDrop{from{transform:translate(-50%,-50%) scale(0) rotate(-15deg)}to{transform:translate(-50%,-50%) scale(1) rotate(0deg)}}
        @keyframes successBoom{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
        @keyframes scanLine{0%{top:-2px}100%{top:102%}}
        .d-nav:hover{background:rgba(185,28,28,0.06)!important;}
        .d-pin:hover{filter:brightness(0.85);cursor:pointer;}
        .d-ans:hover{opacity:.85;}
        .d-row:hover{background:rgba(185,28,28,0.04)!important;}
        .d-cat:hover{opacity:.8;}
        .d-filter:hover{background:rgba(185,28,28,0.06)!important;}
      `}</style>

      {/* Desktop Nav */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", height:58, background:C.paper, borderBottom:`2px solid ${C.red}`, flexShrink:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          {/* Logo matching brand */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:6 }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:30, letterSpacing:6, color:C.red, lineHeight:1 }}>MASA</div>
            <div style={{ width:0, height:0, borderLeft:"8px solid transparent", borderRight:"8px solid transparent", borderTop:`10px solid ${C.red}`, marginBottom:3, marginLeft:-4 }}/>
          </div>
          <div style={{ width:1, height:26, background:C.border }}/>
          <div style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:3, color:C.textFade, textTransform:"uppercase" }}>
            DOSYA #01 — KIYILAR
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {[["🗺️","HARİTA","map"],["📋","RAPORLAR","reports"],["➕","DEĞERLENDİR","check"]].map(([icon,label,s]) => (
            <button key={s} className="d-nav" onClick={() => { setSelectedPin(null); setScreen(s); }} style={{
              background: screen===s ? C.redFade : "none",
              border: `1px solid ${screen===s ? C.red : C.borderSoft}`,
              color: screen===s ? C.red : C.textMid,
              fontFamily:"'Space Mono'", fontSize:9, letterSpacing:2, textTransform:"uppercase",
              padding:"6px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .15s",
            }}>
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
          <div style={{ width:1, height:26, background:C.border, marginLeft:4 }}/>
          <button onClick={() => setIsMobile(true)} style={{ background:"none", border:`1px solid ${C.borderSoft}`, padding:"5px 12px", fontFamily:"'Space Mono'", fontSize:8, letterSpacing:2, color:C.textFade, cursor:"pointer", textTransform:"uppercase" }}>
            📱 MOBİL
          </button>
        </div>
      </nav>

      {/* Desktop Map */}
      {screen === "map" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
            {/* Map bg */}
            <div style={{ position:"absolute", inset:0, background:`linear-gradient(155deg, ${C.bgDeep} 0%, ${C.bg} 50%, #dfc5b0 100%)` }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.redBorder} 1px,transparent 1px),linear-gradient(90deg,${C.redBorder} 1px,transparent 1px)`, backgroundSize:"52px 52px", opacity:.35 }}/>
              {/* Scan */}
              <div style={{ position:"absolute", left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.redBorder},transparent)`, animation:"scanLine 5s linear infinite", pointerEvents:"none" }}/>
            </div>
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              <path d="M0,340 Q100,315 200,335 Q300,355 400,328 Q500,305 600,325 Q700,340 800,330 L800,600 L0,600 Z" fill={`rgba(185,28,28,0.05)`}/>
              <path d="M0,340 Q100,315 200,335 Q300,355 400,328 Q500,305 600,325 Q700,340 800,330" stroke={`rgba(185,28,28,0.15)`} strokeWidth="1.5" fill="none"/>
              <line x1="400" y1="0" x2="415" y2="340" stroke={`rgba(185,28,28,0.06)`} strokeWidth="3"/>
              <line x1="0" y1="220" x2="800" y2="245" stroke={`rgba(185,28,28,0.05)`} strokeWidth="2"/>
              <rect x="80"  y="130" width="110" height="65" fill={`rgba(185,28,28,0.04)`} rx="2"/>
              <rect x="450" y="150" width="90"  height="55" fill={`rgba(185,28,28,0.035)`} rx="2"/>
              <rect x="600" y="90"  width="140" height="80" fill={`rgba(185,28,28,0.03)`} rx="2"/>
              <rect x="200" y="255" width="70"  height="40" fill={`rgba(185,28,28,0.03)`} rx="2"/>
              <text x="400" y="500" fill={`rgba(185,28,28,0.2)`} fontSize="16" fontFamily="monospace" textAnchor="middle" letterSpacing="8">EGE DENİZİ</text>
            </svg>

            {/* Pins */}
            {reports.map((r,idx) => (
              <div key={r.id} className="d-pin" onClick={() => setSelectedPin(selectedPin?.id===r.id ? null : r)}
                style={{ position:"absolute", left:`${r.x}%`, top:`${r.y}%`, transform:"translate(-50%,-50%)", zIndex: selectedPin?.id===r.id?20:10 }}>
                <div style={{ position:"absolute", top:"50%", left:"50%", width: selectedPin?.id===r.id?58:44, height: selectedPin?.id===r.id?58:44, borderRadius:"50%", background:`${scoreColor(r.score)}12`, border:`1px solid ${scoreColor(r.score)}28`, animation:`pulseRing ${2+idx*.28}s infinite`, pointerEvents:"none" }}/>
                <div style={{ position:"relative", zIndex:1, width: selectedPin?.id===r.id?40:30, height: selectedPin?.id===r.id?40:30, background: selectedPin?.id===r.id ? C.red : C.paper, border:`2px solid ${scoreColor(r.score)}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue'", fontSize: selectedPin?.id===r.id?20:15, color: selectedPin?.id===r.id?"white":scoreColor(r.score), boxShadow:`0 2px 14px ${scoreColor(r.score)}40`, transition:"all .15s", animation:`pinDrop .4s ease ${idx*.055}s both`, borderRadius:2 }}>
                  {r.score}
                </div>
                <div style={{ position:"absolute", top:-5, right:-5, zIndex:2, width:16, height:16, background:C.paper, border:`1px solid ${scoreColor(r.score)}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Space Mono'", fontSize:7, color:scoreColor(r.score) }}>{r.reports}</div>
              </div>
            ))}

            {/* Legend */}
            <div style={{ position:"absolute", bottom:24, left:24, background:C.paper, border:`1px solid ${C.border}`, padding:"12px 16px" }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:C.textFade, textTransform:"uppercase", marginBottom:10 }}>İHLAL SKORU</div>
              {[["#166534","0–3","İyi durumda"],["#92400e","4–6","Endişe verici"],[C.red,"7+","Kritik ihlal"]].map(([c,s,l])=>(
                <div key={s} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                  <div style={{ width:10, height:10, background:c, borderRadius:1 }}/>
                  <span style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.textMid }}><b style={{color:c}}>{s}</b> — {l}</span>
                </div>
              ))}
              <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.borderSoft}`, fontFamily:"'Space Mono'", fontSize:7, color:C.textFade }}>
                {reports.length} NOKTA · {reports.reduce((s,r)=>s+r.reports,0)} RAPOR
              </div>
            </div>

            {/* Add btn */}
            <button onClick={() => setScreen("check")} style={{ position:"absolute", bottom:24, right: selectedPin?364:24, width:52, height:52, background:C.red, border:"none", color:"white", fontSize:26, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, boxShadow:`0 4px 24px rgba(185,28,28,0.4)`, transition:"right .25s", borderRadius:2 }}>+</button>
          </div>

          {/* Side detail panel */}
          <div style={{ width: selectedPin?340:0, overflow:"hidden", transition:"width .25s ease", background:C.paper, borderLeft:`2px solid ${C.red}`, flexShrink:0, display:"flex", flexDirection:"column" }}>
            {selectedPin && (
              <div style={{ width:340, padding:24, display:"flex", flexDirection:"column", gap:20, animation:"fadeUp .2s ease", overflowY:"auto" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:C.textFade, textTransform:"uppercase" }}>KONUM DETAYI</div>
                  <button onClick={() => setSelectedPin(null)} style={{ background:"none", border:"none", color:C.textFade, cursor:"pointer", fontSize:20 }}>×</button>
                </div>
                <div style={{ background: scoreBg(selectedPin.score), border:`2px solid ${scoreBorder(selectedPin.score)}`, padding:"20px 24px", display:"flex", alignItems:"center", gap:20 }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:72, color: scoreColor(selectedPin.score), lineHeight:1 }}>{selectedPin.score}</div>
                  <div>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:3, color: scoreColor(selectedPin.score), textTransform:"uppercase", marginBottom:4 }}>{scoreLabel(selectedPin.score)}</div>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:C.text, letterSpacing:1, lineHeight:1.1 }}>{selectedPin.name}</div>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.textFade, marginTop:6 }}>{selectedPin.reports} rapor · {selectedPin.district}</div>
                  </div>
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:C.textFade, textTransform:"uppercase" }}>İHLAL YOĞUNLUĞU</div>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:7, color: scoreColor(selectedPin.score) }}>{Math.round((selectedPin.score/25)*100)}%</div>
                  </div>
                  <div style={{ height:3, background:C.borderSoft }}>
                    <div style={{ height:"100%", width:`${(selectedPin.score/25)*100}%`, background: scoreColor(selectedPin.score), transition:"width .4s" }}/>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:C.textFade, textTransform:"uppercase", marginBottom:12 }}>KATEGORİ</div>
                  {CATEGORIES.map(c => {
                    const cs = Math.min(5, Math.round((selectedPin.score/25)*5*(0.5+Math.random()*1)));
                    return (
                      <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <span style={{ fontSize:14, width:20, flexShrink:0 }}>{c.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                            <span style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.textMid }}>{c.short}</span>
                            <span style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.red }}>{cs}/5</span>
                          </div>
                          <div style={{ height:2, background:C.borderSoft }}>
                            <div style={{ height:"100%", width:`${(cs/5)*100}%`, background:C.red }}/>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setScreen("check")} style={{ background:C.red, border:"none", color:"white", fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:4, padding:"12px 0", cursor:"pointer" }}>
                  BU ALANI SEN DE PUAN VER →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Checklist */}
      {screen === "check" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"20px 28px 16px", background:C.bgLight, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:3, color:C.textFade, textTransform:"uppercase", marginBottom:8 }}>DEĞERLENDİRDİĞİN KONUM</div>
              <input placeholder="Konum adını gir — örn: Kadınlar Denizi, Kuşadası" value={locName} onChange={e=>setLocName(e.target.value)}
                style={{ width:"100%", background:"white", border:`1px solid ${C.border}`, padding:"10px 14px", fontFamily:"'IBM Plex Sans'", fontSize:13, color:C.text, outline:"none" }}/>
              <div style={{ marginTop:10, display:"flex", gap:8 }}>
                {CATEGORIES.map((c,i) => {
                  const v = c.questions.filter((_,qi) => { const a=answers[`${c.id}_${qi}`]; return a==="hayır"||a==="belirsiz"; }).length;
                  const a = c.questions.filter((_,qi) => answers[`${c.id}_${qi}`]).length;
                  return (
                    <button key={c.id} className="d-cat" onClick={() => setActiveCat(i)} style={{ flex:1, padding:"7px 4px", background: activeCat===i?C.red:"white", border:`1px solid ${activeCat===i?C.red:C.border}`, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, transition:"all .15s" }}>
                      <span style={{ fontSize:16 }}>{c.icon}</span>
                      <span style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:1, textTransform:"uppercase", color: activeCat===i?"white":C.textMid }}>{c.short}</span>
                      <span style={{ fontFamily:"'Space Mono'", fontSize:7, color: v>0?"#dc2626": a===5?"#166534": activeCat===i?"rgba(255,255,255,0.5)":C.textFade }}>{a}/5{v>0?` ·${v}✕`:""}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ padding:"12px 28px", background:C.bg, borderBottom:`1px solid ${C.borderSoft}`, flexShrink:0, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:22 }}>{cat.icon}</span>
              <div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:C.red, letterSpacing:2 }}>{cat.title}</div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.textFade, letterSpacing:2 }}>{cat.hint}</div>
              </div>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"16px 28px", display:"flex", flexDirection:"column", gap:8 }}>
              {cat.questions.map((q,qi) => {
                const key = `${cat.id}_${qi}`;
                const ans = answers[key];
                const bc = ans==="evet"?"rgba(22,101,52,0.2)":ans==="hayır"?C.redBorder:ans==="belirsiz"?"rgba(146,64,14,0.2)":C.borderSoft;
                const bg = ans==="evet"?"rgba(22,101,52,0.05)":ans==="hayır"?`rgba(185,28,28,0.05)`:"white";
                return (
                  <div key={qi} style={{ background:bg, border:`1px solid ${bc}`, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, animation:`fadeUp .18s ease ${qi*.04}s both` }}>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:C.red, lineHeight:1, flexShrink:0, marginTop:1 }}>{qi+1}</span>
                      <div style={{ fontSize:13, color:C.text, lineHeight:1.55 }}>{q}</div>
                    </div>
                    <div style={{ display:"flex", gap:6, marginLeft:28 }}>
                      {[["evet","✓ EVET","#166534"],["hayır","✗ HAYIR",C.red],["belirsiz","? BELİRSİZ","#92400e"]].map(([val,label,col]) => (
                        <button key={val} className="d-ans" onClick={() => setAns(cat.id,qi,val)} style={{ flex:1, padding:"8px 4px", border:`1px solid ${ans===val?col:C.borderSoft}`, background: ans===val?col:"white", cursor:"pointer", fontFamily:"'Space Mono'", fontSize:8, letterSpacing:1, textTransform:"uppercase", color: ans===val?"white":C.textMid, transition:"all .1s" }}>
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
          <div style={{ width:280, background:C.bgLight, borderLeft:`2px solid ${C.red}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:"20px 20px 0", flex:1, overflowY:"auto" }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:C.textFade, textTransform:"uppercase", marginBottom:16 }}>CANLI SKOR</div>
              <div style={{ background: scoreBg(score), border:`2px solid ${scoreBorder(score)}`, padding:"20px", textAlign:"center", marginBottom:16 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:80, color: scoreColor(score), lineHeight:1 }}>{score}</div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:4, color: scoreColor(score), textTransform:"uppercase", marginTop:4 }}>{scoreLabel(score)}</div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.textFade, marginTop:4 }}>/ 25 ihlal puanı</div>
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ height:3, background:C.borderSoft, marginBottom:4 }}>
                  <div style={{ height:"100%", width:`${(score/25)*100}%`, background: scoreColor(score), transition:"width .3s" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'Space Mono'", fontSize:7, color:C.textFade }}>
                  <span>0 — Temiz</span><span>25 — Kritik</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:20 }}>
                {[["0–3","İYİ","#166534","Takip et"],["4–6","ENDİŞE","#92400e","Belgele & paylaş"],["7+","KRİTİK",C.red,"MASA'ya bildir"]].map(([range,label,col,action]) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:10, opacity: (range==="0–3"&&score<=3)||(range==="4–6"&&score>3&&score<=6)||(range==="7+"&&score>6)?1:0.3, transition:"opacity .3s" }}>
                    <div style={{ width:3, height:32, background:col, flexShrink:0 }}/>
                    <div>
                      <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:col, letterSpacing:2 }}>{range} — {label}</div>
                      <div style={{ fontFamily:"'Space Mono'", fontSize:7, color:C.textFade }}>{action}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.textFade, letterSpacing:2, marginBottom:8 }}>YANIT: {answered}/{totalQ}</div>
              <div style={{ height:2, background:C.borderSoft, marginBottom:20 }}>
                <div style={{ height:"100%", width:`${(answered/totalQ)*100}%`, background:C.red, transition:"width .2s" }}/>
              </div>
              {score >= 5 && (
                <div style={{ background:`rgba(185,28,28,0.06)`, border:`1px solid ${C.redBorder}`, padding:"10px 12px", marginBottom:16, animation:"fadeUp .3s ease" }}>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:C.red, letterSpacing:2, marginBottom:4 }}>⚠ RAPORLANABİLİR İHLAL</div>
                  <div style={{ fontFamily:"'IBM Plex Sans'", fontSize:11, color:C.textMid, lineHeight:1.5 }}>Bu alan resmi başvuruya konu olabilir.</div>
                </div>
              )}
            </div>
            <div style={{ padding:20, borderTop:`1px solid ${C.border}` }}>
              <button onClick={answered>=5?submit:undefined} style={{ width:"100%", padding:"14px 0", background: answered>=5?C.red:C.redFade, border:"none", fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:5, color: answered>=5?"white":C.textFade, cursor: answered>=5?"pointer":"not-allowed", transition:"all .2s", marginBottom:8 }}>
                {answered<5?`${5-answered} SORU DAHA`:"MASA'YA BİLDİR →"}
              </button>
              <div style={{ fontFamily:"'Space Mono'", fontSize:7, color:C.textFade, textAlign:"center", letterSpacing:2 }}>EN AZ 5 SORU GEREKLİ</div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Reports */}
      {screen === "reports" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"20px 28px", background:C.bgLight, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
              <div style={{ display:"flex", gap:32, marginBottom:16 }}>
                {[["TOPLAM RAPOR",reports.reduce((s,r)=>s+r.reports,0),C.red],["KRİTİK",reports.filter(r=>r.score>6).length,C.red],["ENDİŞELİ",reports.filter(r=>r.score>3&&r.score<=6).length,"#92400e"],["İYİ",reports.filter(r=>r.score<=3).length,"#166534"]].map(([label,val,col]) => (
                  <div key={label}>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:40, color:col, lineHeight:1 }}>{val}</div>
                    <div style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:2, color:C.textFade, textTransform:"uppercase", marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {[["all","TÜMÜ"],["bad","KRİTİK"],["mid","ENDİŞE"],["good","İYİ"]].map(([val,label]) => (
                  <button key={val} className="d-filter" onClick={()=>setFilterScore(val)} style={{ padding:"4px 14px", background: filterScore===val?C.redFade:"white", border:`1px solid ${filterScore===val?C.red:C.borderSoft}`, cursor:"pointer", fontFamily:"'Space Mono'", fontSize:8, letterSpacing:2, textTransform:"uppercase", color: filterScore===val?C.red:C.textMid, transition:"all .15s" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 100px 80px 110px", padding:"8px 28px", background:C.bg, borderBottom:`1px solid ${C.borderSoft}`, flexShrink:0 }}>
              {["SKOR","KONUM","BÖLGE","RAPOR","DURUM"].map(h => (
                <div key={h} style={{ fontFamily:"'Space Mono'", fontSize:7, letterSpacing:3, color:C.textFade, textTransform:"uppercase" }}>{h}</div>
              ))}
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              {[...filteredReports].sort((a,b)=>b.score-a.score).map((r,i) => (
                <div key={r.id} className="d-row" onClick={() => { setSelectedPin(r); setScreen("map"); }} style={{ display:"grid", gridTemplateColumns:"60px 1fr 100px 80px 110px", padding:"14px 28px", borderBottom:`1px solid ${C.borderSoft}`, cursor:"pointer", animation:`fadeUp .14s ease ${i*.03}s both`, background:"white", transition:"background .1s" }}>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <div style={{ width:42, height:42, background: scoreBg(r.score), border:`1px solid ${scoreBorder(r.score)}`, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                      <span style={{ fontFamily:"'Bebas Neue'", fontSize:26, color: scoreColor(r.score) }}>{r.score}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:5 }}>
                    <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{r.name}</div>
                    <div style={{ height:2, background:C.borderSoft, width:120 }}>
                      <div style={{ height:"100%", width:`${(r.score/25)*100}%`, background: scoreColor(r.score) }}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", fontFamily:"'Space Mono'", fontSize:9, color:C.textFade }}>{r.district}</div>
                  <div style={{ display:"flex", alignItems:"center", fontFamily:"'Space Mono'", fontSize:9, color:C.textFade }}>{r.reports}</div>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <div style={{ background: scoreBg(r.score), border:`1px solid ${scoreBorder(r.score)}`, padding:"3px 8px", fontFamily:"'Space Mono'", fontSize:7, letterSpacing:1, color: scoreColor(r.score), textTransform:"uppercase" }}>
                      {scoreLabel(r.score).split(" ")[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Success */}
      {showSuccess && successData && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", animation:"successBoom .5s ease" }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:100, letterSpacing:14, color:C.red, lineHeight:1 }}>MASA</div>
            <div style={{ fontFamily:"'Space Mono'", fontSize:10, letterSpacing:6, color:C.textFade, textTransform:"uppercase", marginTop:10, marginBottom:32 }}>RAPOR ALINDI — HARİTAYA EKLENİYOR</div>
            <div style={{ display:"inline-block", background: scoreBg(successData.score), border:`2px solid ${scoreBorder(successData.score)}`, padding:"24px 48px" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:88, color: scoreColor(successData.score), lineHeight:1 }}>{successData.score}</div>
              <div style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:4, color: scoreColor(successData.score), textTransform:"uppercase", marginTop:8 }}>{scoreLabel(successData.score)}</div>
              <div style={{ fontFamily:"'IBM Plex Sans'", fontSize:14, color:C.textMid, marginTop:12 }}>{successData.name}</div>
            </div>
            <div style={{ marginTop:28, fontFamily:"'IBM Plex Sans'", fontSize:13, color:C.textMid, lineHeight:1.8 }}>
              {successData.score >= 5 ? "Bu alan raporlanabilir ihlal bölgesi olarak işaretlendi." : "Veriler kıyı takip haritasına eklendi."}<br/>
              <span style={{ fontFamily:"'Space Mono'", fontSize:9, letterSpacing:3, color:C.textFade }}>#KıyımSenin #MASAKolektif #KıyıDosyası</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
