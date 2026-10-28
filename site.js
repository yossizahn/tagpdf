// Tag PDF site: Tag's window as on Windows 10 (modern chrome, classic contents) with the page
// as an MDI child, and File > PDF settings drawn from dialog-data.js (read from the real dialog
// of WINPDF.DLL).
"use strict";

const CONFIG = {
  version: "0.1.0",               // install/setup.iss AppVersion
  download: "TagPDFSetup.exe",    // where the installer is published (to be decided)
};

const D = window.DIALOG;
const UPDOWN = 0x4000;
const store = {
  get(k) { try { return localStorage.getItem("tagpdf." + k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem("tagpdf." + k, v); } catch { /* private window */ } },
};
// the language: the one picked in View, else the first Hebrew or English one in the browser's
// preferences (he, or the old iw), else English
const browserLang = () => {
  for (const l of navigator.languages?.length ? navigator.languages : [navigator.language || ""]) {
    if (/^(he|iw)\b/i.test(l)) return "he";
    if (/^en\b/i.test(l)) return "en";
  }
  return "en";
};
let lang = store.get("lang") || browserLang();
let skin = store.get("skin") === "7" ? "7" : "10";

// ---- texts of the frame and the document (the dialog's own come from dialog-data.js)

const T = {
  en: {
    appTitle: "Tag PDF",
    childTitle: "1  C:\\TAG\\TAGPDF.I",
    childShort: "TAGPDF.I",
    menus: ["&File", "&Edit", "&View", "&Search", "&Markup", "&Attributes", "&Layout", "S&cript", "&Window", "&Help"],
    download: "&Download TagPDFSetup.exe", settings: "PDF &settings...", exit: "E&xit",
    dlg10: "Dialogs: Windows 1&0", dlg7: "Dialogs: Windows &7",
    about: "&About Tag PDF...",
    weights: ["Normal", "Bold"],
    // the status bar's three modes: labels bold, a click cycles them
    st: { distance: "Distance", page: "Page", line: "Line:", depth: "Depth:", leading: "Leading:", ll: "LL:", charLead: "Char lead:", wordSp: "Word sp:",
      ascii: "ASCII value:", hex: "Hex", pos: "Cursor position:", total: "Total:", chars: "chars", inSel: "chars in selection" },
    seeCmds: "See &commands",
    menu: { newText: "&New text...", open: "&Open...", save: "&Save", saveAs: "Save &as...", saveAll: "Save all c&hanges...", closeAll: "&Close all...",
      chdir: "Change &directory...", imp: "&Import...", exp: "&Export...", rename: "&Rename...", preview: "Print pre&view", printSetup: "Print se&tup...",
      prefs: "Pr&eferences...", print: "&Print...", undo: "&Undo", cut: "Cu&t", copy: "&Copy", paste: "&Paste", selectAll: "Select &All",
      wrap: "&Word wrap", second: "Secondary &language", charmap: "C&haracter map", split: "&Split window", ruler: "See &ruler",
      pagePreview: "&Page preview", fit: "&Fit to screen", zoom: "&Zoom", accents: "See &accents", attrs: "Show a&ttributes",
      special: "&Special characters...", shortcuts: "Short &cuts...", sayHi: "Say &hi" },
    // the page's style sheet: Tag codes are one or two characters, the name is the style's own
    codes: { "01": "Title", "02": "Heading", "03": "Body", "04": "List item", "05": "Note", "06": "Buttons" },
    ok: "OK",
    aboutText: "Tag PDF {v}\n\nA PDF printer for Tag (תג) 3.99 and TagXP.\nWINPDF.DLL, the \"Tag PDF\" printer and File > PDF settings.",
    exitText: "This is a web page: there is nothing to close.",
    notHere: "This button works in Tag. On the web page nothing opens.",
    saved: "On the web page nothing is saved.\nIn Tag, OK writes WINPDF.INI in the Tag folder.",
    doc: `
<h1>Tag PDF</h1>
<p>A PDF printer for Tag (תג) 3.99 and TagXP. Print a book from Tag as you always do, pick <b>Tag PDF</b>, and get a PDF.</p>
<div class="cta">
  <button class="default" data-act="download">Download TagPDFSetup.exe</button>
  <button data-act="settings">See the PDF settings...</button>
  <span class="small">Version {v} · Windows 10 or later</span>
</div>
<h2>What it does</h2>
<ul>
  <li>Prints from PAGINATE, AROT and File › Print as usual: choose <b>Tag PDF</b> in the LIB's printer box or in File › Print setup.</li>
  <li>The PDF looks like Bullzip's, the PDFs printing houses already get from Tag users. Fonts are embedded, only the letters used.</li>
  <li>Hebrew can be searched and copied, also in Tag's 8-bit fonts (GFrank, VTRashi, VTVilna, Hadassah).</li>
  <li>Every other printer prints exactly as before.</li>
  <li>Settings in Tag's own menu: <b>File › PDF settings</b>, in English or Hebrew.</li>
</ul>
<h2>Install</h2>
<ol>
  <li>Download <b>TagPDFSetup.exe</b> and run it. Tag may stay open.</li>
  <li>It finds your Tag folder and puts in <code>WINPDF.DLL</code>, <code>WINPDFSET.PRG</code> and <code>WINPDF.INI</code>; sets the PDF driver in the printer table; adds File › PDF settings to <code>TAG.INI</code> if you want; and adds the <b>Tag PDF</b> Windows printer.</li>
  <li>Restart Tag, then print to <b>Tag PDF</b>.</li>
</ol>
<p>To remove it, run the setup again and choose <b>Remove</b>.</p>
<h2>The settings</h2>
<p>Open <b>File › PDF settings</b> to try the dialog: the same tabs and controls as in Tag. Point at a setting to read what it does.</p>
<div class="note">Greyed settings are planned and don't work yet.</div>
`,
  },
  he: {
    appTitle: "Tag PDF",
    childTitle: "1  C:\\TAG\\TAGPDF.I",
    childShort: "TAGPDF.I",
    menus: ["&קובץ", "&עריכה", "&הצג", "&חיפוש", "&סימון", "&תכונות", "ע&יצוב", "ס&קריפט", "&חלון", "ע&זרה"],
    download: "&הורד את TagPDFSetup.exe", settings: "הגדרות &PDF...", exit: "&יציאה",
    dlg10: "חלונות: Windows 1&0", dlg7: "חלונות: Windows &7",
    about: "&אודות Tag PDF...",
    weights: ["רגיל", "שמן"],
    st: { distance: "מרחק:", page: "עמוד", line: "שורה:", depth: "עומק:", leading: "גוף:", ll: "LL:", charLead: "גוף תו:", wordSp: "רווח בין מלים:",
      ascii: "ערך ASCII:", hex: "Hex", pos: "מקום הסמן:", total: "סה\"כ סימנים:", chars: "", inSel: "סימנים בבחירה" },
    seeCmds: "ראה &פקודות",
    menu: { newText: "&טקסט חדש...", open: "&פתח...", save: "&שמור קובץ", saveAs: "שמור &בשם...", saveAll: "שמור כל &שינויים...", closeAll: "&סגור הכל...",
      chdir: "לשנות &ספריה...", imp: "&ייבוא...", exp: "י&צוא...", rename: "&החלף שם...", preview: "הדפס &דף", printSetup: "הגדרת &מדפסת",
      prefs: "&העדפות...", print: "&הדפסה...", undo: "&ביטול פעולה", cut: "&גזור", copy: "&העתק", paste: "ה&דבק", selectAll: "בחר ה&כל",
      wrap: "&ישור אוטומטי", second: "שפה &משנית", charmap: "מפת &תווים", split: "&פיצול חלון", ruler: "ראה &סרגל",
      pagePreview: "&דף תצוגה", fit: "ה&תאם למסך", zoom: "ה&גדלה", accents: "ראה &ניקוד", attrs: "ראה &תכונות",
      special: "&תווים מיוחדים...", shortcuts: "&קיצורים...", sayHi: "&אמור שלום" },
    codes: { "01": "כותרת ראשית", "02": "כותרת", "03": "גוף", "04": "רשימה", "05": "הערה", "06": "כפתורים" },
    ok: "אישור",
    aboutText: "Tag PDF {v}\n\nמדפסת PDF לתג 3.99 ול-TagXP.\nWINPDF.DLL, המדפסת \"Tag PDF\" וקובץ › הגדרות PDF.",
    exitText: "זה דף אינטרנט: אין מה לסגור.",
    notHere: "הכפתור הזה פועל בתג. בדף האינטרנט שום דבר לא נפתח.",
    saved: "בדף האינטרנט שום דבר לא נשמר.\nבתג, אישור כותב את WINPDF.INI בתיקיית תג.",
    doc: `
<h1>Tag PDF</h1>
<p>מדפסת PDF לתג 3.99 ול-TagXP. מדפיסים ספר מתג כמו תמיד, בוחרים <b>Tag PDF</b>, ומקבלים PDF.</p>
<div class="cta">
  <button class="default" data-act="download">הורד את TagPDFSetup.exe</button>
  <button data-act="settings">הצג את הגדרות ה-PDF...</button>
  <span class="small">גרסה {v} · Windows 10 ומעלה</span>
</div>
<h2>מה הוא עושה</h2>
<ul>
  <li>מדפיס מ-PAGINATE, מ-AROT ומקובץ › הדפסה כרגיל: בוחרים <b>Tag PDF</b> בחלון המדפסת של ה-LIB או בקובץ › הגדרת הדפסה.</li>
  <li>ה-PDF נראה כמו של Bullzip, כמו קובצי ה-PDF שבתי הדפוס כבר מקבלים ממשתמשי תג. הגופנים מוטמעים, רק האותיות שבשימוש.</li>
  <li>אפשר לחפש ולהעתיק את העברית, גם בגופנים של 8 סיביות של תג (GFrank, VTRashi, VTVilna, Hadassah).</li>
  <li>כל שאר המדפסות מדפיסות בדיוק כמו קודם.</li>
  <li>ההגדרות בתפריט של תג עצמו: <b>קובץ › הגדרות PDF</b>, באנגלית או בעברית.</li>
</ul>
<h2>התקנה</h2>
<ol>
  <li>הורידו את <b>TagPDFSetup.exe</b> והריצו אותו. תג יכול להישאר פתוח.</li>
  <li>הוא מוצא את תיקיית תג ומכניס אליה את <code>WINPDF.DLL</code>, <code>WINPDFSET.PRG</code> ו-<code>WINPDF.INI</code>; קובע את מנהל ההתקן של ה-PDF בטבלת המדפסת; מוסיף את קובץ › הגדרות PDF ל-<code>TAG.INI</code> אם תרצו; ומוסיף את המדפסת <b>Tag PDF</b> ל-Windows.</li>
  <li>הפעילו את תג מחדש, והדפיסו ל-<b>Tag PDF</b>.</li>
</ol>
<p>להסרה, הריצו את ההתקנה שוב ובחרו <b>הסר</b>.</p>
<h2>ההגדרות</h2>
<p>פתחו את <b>קובץ › הגדרות PDF</b> כדי לנסות את החלון: אותן לשוניות ואותם פקדים כמו בתג. הצביעו על הגדרה כדי לקרוא מה היא עושה.</p>
<div class="note">הגדרות אפורות מתוכננות ועדיין לא פועלות.</div>
`,
  },
};
const t = (k) => T[lang][k];
const tv = (k) => t(k).replaceAll("{v}", CONFIG.version);
const rtl = () => lang === "he";

// "&File" → F underlined; "&&" is a plain "&"
function mnemonic(s) {
  const span = document.createElement("span");
  for (const p of s.split(/(&&|&.)/)) {
    if (p === "&&") span.append("&");
    else if (p.length === 2 && p[0] === "&") { const u = document.createElement("u"); u.textContent = p[1]; span.append(u); }
    else if (p) span.append(p);
  }
  return span;
}
const plain = (s) => s.replace(/&(.)/g, "$1");

function el(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") e.className = v;
    else if (k === "style") Object.assign(e.style, v);
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
  }
  e.append(...kids);
  return e;
}

function infoIcon() {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 32 32");
  s.setAttribute("aria-hidden", "true");
  s.innerHTML = "<circle cx='16' cy='16' r='15' fill='#1e6fd9'/><rect x='14.5' y='13' width='3' height='11' fill='#fff'/><rect x='14.5' y='8' width='3' height='3' fill='#fff'/>";
  return s;
}

// ---- the frame

const ACTS = {
  download() { location.href = CONFIG.download; },
  settings() { openDialog(); },
  about() { aboutBox(); },
  printSetup() { printSetupDialog(); },
  exit() { msgbox(t("exitText")); },
  en() { setLang("en"); },
  he() { setLang("he"); },
  skin10() { setSkin("10"); },
  skin7() { setSkin("7"); },
  copy() { document.execCommand("copy"); },
  closeText() { if (active) mdiClose(active); },
  sayhi() { postCommand(lang === "he" ? 'msg "שלום!" heb' : 'msg "Hi!"'); },
  selectAll() {
    if (!active) return;
    active.doc.focus();
    getSelection().selectAllChildren(active.doc);
  },
  wrap() {
    autoWrap = !autoWrap;
    const b = document.getElementById("wrapbtn");
    b?.classList.toggle("on", autoWrap);
    b?.setAttribute("aria-pressed", String(autoWrap));
    buildMenus();
  },
  see() {
    seeCommands = !seeCommands;
    for (const k of kids) k.doc.classList.toggle("see", seeCommands);
    buildMenus();
    drawCaret();
  },
  newText() { newTextDialog(); },
  run() { runCommand(document.getElementById("cmd").value); },
};

// ---- the command line: `run file "winpdfset.prg"` (what File > PDF settings runs) and `msg`;
// anything else gets Tag's error box. Errors are Tag's own texts.

const cmdHistory = ['run file "winpdfset.prg"'];

// posts a command as Tag posts a menu macro without a brace: into the field and the history, then runs
function postCommand(line) {
  const f = document.getElementById("cmd");
  if (f) f.value = line;
  runCommand(line);
}

function runCommand(line, keep = true) {
  const v = line.trim();
  if (!v) return;
  if (keep) {
    const at = cmdHistory.indexOf(v);
    if (at >= 0) cmdHistory.splice(at, 1);
    cmdHistory.unshift(v);
  }
  if (/^run\s+file\s+"?winpdfset(\.prg)?"?$/i.test(v)) { openDialog(); return; }
  try {
    const toks = tokenize(v);
    const head = toks[0];
    if (head.k === "id" && head.v.toLowerCase() === "msg") return cmdMsg(toks.slice(1));
    if (head.k === "id" && head.v.toLowerCase() === "new") return cmdNew(toks.slice(1));
    if (head.k === "id") throw new TagError("Global symbol " + head.v + " does not exist.");
    throw new TagError("Syntax error.");
  } catch (e) {
    if (!(e instanceof TagError)) throw e;
    tagError(e.message);
  }
}

class TagError extends Error {}

// numbers (no exponent), "strings" (\" and \\ escapes; \n and other escapes give the letter, as
// Tag's msg shows them), names, + - * / ( ) ,
function tokenize(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '"') {
      let str = "";
      i++;
      while (i < src.length && src[i] !== '"') {
        if (src[i] === "\\" && i + 1 < src.length) { const n = src[i + 1]; str += n === "r" ? " " : n; i += 2; } else str += src[i++];
      }
      if (i >= src.length) throw new TagError("Unterminated string.");
      i++;
      out.push({ k: "str", v: str });
    } else if (/[0-9.]/.test(c)) {
      const m = /^(\d*\.?\d*)(in|cm|pt|pc)?/i.exec(src.slice(i));
      if (!m[1] || m[1] === ".") throw new TagError("Syntax error.");
      const unit = { in: 72.27, cm: 28.45, pc: 12, pt: 1 }[(m[2] || "").toLowerCase()];
      out.push({ k: "num", v: Math.fround(parseFloat(m[1]) * (unit || 1)), real: m[1].includes(".") || !!unit || undefined });
      i += m[0].length;
    } else if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i));
      out.push({ k: "id", v: m[0] });
      i += m[0].length;
    } else if ("+-*/(),".includes(c)) { out.push({ k: "op", v: c }); i++; }
    else throw new TagError("Syntax error.");
  }
  return out;
}

// expressions: + - * / with Tag's rules (7/2 is 3.5, string + number is an error, "a" + "b" joins)
function parseExpr(toks, pos) {
  let [l, p] = parseTerm(toks, pos);
  while (toks[p] && toks[p].k === "op" && "+-".includes(toks[p].v)) {
    const op = toks[p].v;
    let r;
    [r, p] = parseTerm(toks, p + 1);
    l = arith(op, l, r);
  }
  return [l, p];
}
function parseTerm(toks, pos) {
  let [l, p] = parseAtom(toks, pos);
  const mulOp = (tk) => tk && ((tk.k === "op" && "*/".includes(tk.v)) || (tk.k === "id" && /^(div|mod)$/i.test(tk.v)));
  while (mulOp(toks[p])) {
    const op = toks[p].v.toLowerCase();
    let r;
    [r, p] = parseAtom(toks, p + 1);
    l = arith(op, l, r);
  }
  return [l, p];
}
function parseAtom(toks, p) {
  const tk = toks[p];
  if (!tk) throw new TagError("Syntax error.");
  if (tk.k === "num" || tk.k === "str") return [tk, p + 1];
  if (tk.k === "op" && tk.v === "-") { const [v, q] = parseAtom(toks, p + 1); return [arith("-", { k: "num", v: 0 }, v), q]; }
  if (tk.k === "op" && tk.v === "(") {
    const [v, q] = parseExpr(toks, p + 1);
    if (!toks[q] || toks[q].v !== ")") throw new TagError("Syntax error.");
    return [v, q + 1];
  }
  if (tk.k === "id") throw new TagError("Global symbol " + tk.v + " does not exist.");
  throw new TagError("Syntax error.");
}
function arith(op, a, b) {
  if (a.k === "str" || b.k === "str") {
    if (op === "+" && a.k === "str" && b.k === "str") return { k: "str", v: a.v + b.v };
    throw new TagError("Invalid arithmetic operation.");
  }
  // div and mod are whole-number division and remainder
  if ((op === "/" || op === "div" || op === "mod") && b.v === 0) throw new TagError("Divide by zero error.");
  if (op === "div" || op === "mod") return { k: "num", v: op === "div" ? Math.trunc(a.v / b.v) | 0 : (Math.trunc(a.v) % Math.trunc(b.v)) | 0 };
  const real = a.real || b.real || op === "/";
  let v = op === "+" ? a.v + b.v : op === "-" ? a.v - b.v : op === "*" ? a.v * b.v : a.v / b.v;
  v = real ? Math.fround(v) : (v | 0);                 // reals are 32-bit floats, ints wrap
  return { k: "num", v, real: real && !Number.isInteger(v) ? true : real || undefined };
}
// a number as Tag prints it: C's %f with the trailing zeros dropped
function tagNumber(n) {
  if (!n.real) return String(n.v);
  return n.v.toFixed(6).replace(/\.?0+$/, "");
}

// new tx "name" [visible | hidden | iconic] [heb | eng] (also new "name" tx ...: the keywords in
// any order): a new empty text window titled just the name
function cmdNew(toks) {
  let name = null, kind = null, l = tagLang, show = "visible";
  for (const tk of toks) {
    const w = tk.k === "id" ? tk.v.toLowerCase() : null;
    if (tk.k === "str" && name === null) name = tk.v;
    else if (w === "tx" || w === "pg") kind = w;
    else if (w === "heb" || w === "eng") l = w === "heb" ? "he" : "en";
    else if (w === "visible" || w === "hidden" || w === "iconic") show = w;
    else if (tk.k === "id") throw new TagError("Global symbol " + tk.v + " does not exist.");
    else throw new TagError("Syntax error.");
  }
  if (kind !== "tx") throw new TagError("Syntax error.");
  if (!name) return;
  newText(name, l, show);
}

// a new text, as Tag's: empty, typed into, TAG.INI [DEFAULTS] (12 pt Hebrew / 10 pt English,
// leading 14 pt, LL 12 cm), filling the client without being maximised
function newText(name, l, show = "visible") {
  const c = makeChild({ title: name, short: name, lang: l, editable: true });
  tidyText(c);
  c.doc.classList.toggle("see", seeCommands);
  if (show === "hidden") { c.el.hidden = true; return; }
  if (show === "iconic") { mdiSet(c, "min"); return; }
  activate(c);
  caretHome(c);
}

// msg <value> [title <value>] [heb]
function cmdMsg(toks) {
  if (!toks.length) throw new TagError("Syntax error.");
  let [val, p] = parseExpr(toks, 0);
  let title = "", heb = false;
  while (p < toks.length) {
    const tk = toks[p];
    if (tk.k === "id" && tk.v.toLowerCase() === "heb") { heb = true; p++; }
    else if (tk.k === "id" && tk.v.toLowerCase() === "title") { let tv; [tv, p] = parseExpr(toks, p + 1); title = tv.k === "str" ? tv.v : tagNumber(tv); }
    else if (tk.k === "op" && tk.v === ",") throw new TagError("Duplicate parameter: " + (toks[p + 1]?.v ?? "").toString().toUpperCase());
    else throw new TagError("Duplicate parameter: " + String(tk.v).toUpperCase());
  }
  tagMsg(val.k === "str" ? val.v : tagNumber(val), title, heb);
}

// Tag's msg box: a script dialog: the title as the caption, background #e9e9e9, the text
// centred and bold, ^! toggles
// bold, other ^ marks are formatting and never shown; OK (heb: אישור, the text right to left)
function tagMsg(text, title, heb) {
  const close = () => { outer.remove(); layerState(); document.getElementById("cmd")?.focus(); };
  const [outer, body] = windowShell(title, "msg tagmsg", close);
  outer.dir = heb ? "rtl" : "ltr";
  const line = el("div", { class: "text" });
  let bold = true, run = "";
  const flush = () => { if (run) { line.append(bold ? el("b", {}, run) : document.createTextNode(run)); run = ""; } };
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "^" && i + 1 < text.length) {
      flush();
      if (text[i + 1] === "!") bold = !bold;
      i++;
    } else run += text[i];
  }
  flush();
  const ok = el("button", { class: "push default", onclick: close }, heb ? "אישור" : "OK");
  ok.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter" || e.key === "Escape") { e.preventDefault(); close(); } });
  body.append(el("div", { class: "tagmsg-body" }, line, el("div", { class: "buttons" }, ok)));
  layer.append(outer);
  layerState();
  center(outer);
  ok.focus();
}

// ---- Tag's own dialogs, laid out as Tag lays them out: items in dialog units of
// MS Sans Serif 8 (1 DLU = 1.5 px across, 1.625 px down at 96 dpi), drawn with the skin's
// controls. Item: [kind, x, y, cx, cy, text, opts]; kinds: group, static, edit, combo, radio,
// check, button (opts.def = the default button), icon.
const DLU = (x, y) => [Math.round(x * 1.5), Math.round(y * 1.625)];
function tagDialog(caption, w, h, items, cls = "") {
  const close = () => { outer.remove(); layerState(); focusText(); };
  const [outer, body] = windowShell(caption, "msg tagdlg " + cls, close);
  const [cw, ch] = DLU(w, h);
  const client = el("div", { class: "client", style: { width: cw + "px", height: ch + "px" } });
  const byId = {};
  let group = 0;
  for (const [kind, x, y, cx, cy, text, o = {}] of items) {
    const [l, tp] = DLU(x, y), [wd, ht] = DLU(cx, cy);
    const box = { left: l + "px", top: tp + "px", width: wd + "px", height: ht + "px" };
    let node;
    if (kind === "group") node = el("fieldset", { class: "group", style: box }, el("legend", {}, plain(text)));
    else if (kind === "static") { node = el("div", { class: "c static", style: { ...box, textAlign: o.align || "start" } }, mnemonic(text)); if (o.sunken) node.classList.add("sunkfield"); }
    else if (kind === "edit") { const i = el("input", { class: "full", type: "text", spellcheck: "false" }); i.value = text; node = el("div", { class: "c", style: box }, i); }
    else if (kind === "combo") {
      const sl = el("select", { class: "full" }, ...o.items.map((x, i) => el("option", { value: i }, x)));
      sl.selectedIndex = o.sel || 0;
      node = el("div", { class: "c", style: { ...box, height: Math.round(14 * 1.625) + "px" } }, sl);
    } else if (kind === "radio" || kind === "check") {
      const id = "td" + Math.random().toString(36).slice(2);
      if (o.group) group++;
      const input = el("input", { type: kind === "radio" ? "radio" : "checkbox", id, checked: !!o.checked, name: kind === "radio" ? "tdg" + group : false });
      node = el("div", { class: "c", style: box }, el("div", { class: "check" }, input, el("label", { for: id }, mnemonic(text))));
    } else if (kind === "button") node = el("div", { class: "c", style: box }, el("button", { class: "push full" + (o.def ? " default" : ""), type: "button" }, mnemonic(text)));
    else if (kind === "icon") node = el("div", { class: "c tagicon " + text, style: box });
    if (o.id) byId[o.id] = node;
    client.append(node);
  }
  body.append(client);
  layer.append(outer);
  layerState();
  center(outer);
  return { outer, client, byId, close };
}

// File > New text...: Name and the primary language, the last ones entered
// kept for the session; OK runs `new tx "name" visible heb|eng` (not posted), an empty name
// makes nothing
let lastNew = { name: "", lang: "he" };    // TAG.INI LANG=heb
const tagLang = "he";
function newTextDialog() {
  const he = rtl();
  const d = he
    ? tagDialog("טקסט חדש", 153, 56, [
      ["edit", 61, 7, 72, 12, lastNew.name, { id: "name" }],
      ["radio", 63, 35, 40, 12, "לועזית", { id: "eng", group: true, checked: lastNew.lang === "en" }],
      ["radio", 109, 35, 40, 12, "עברית", { id: "heb", checked: lastNew.lang === "he" }],
      ["static", 137, 9, 16, 10, "שם"], ["static", 81, 25, 52, 10, "שפה ראשית"],
      ["button", 6, 7, 46, 14, "אישור", { id: "ok", def: true }], ["button", 6, 25, 46, 14, "ביטול", { id: "cancel" }]], "newtextdlg")
    : tagDialog("New text", 149, 55, [
      ["static", 4, 10, 20, 10, "Name"], ["edit", 26, 8, 63, 12, lastNew.name, { id: "name" }],
      ["static", 26, 26, 59, 10, "Primary language"],
      ["radio", 8, 36, 40, 12, "English", { id: "eng", group: true, checked: lastNew.lang === "en" }],
      ["radio", 54, 36, 40, 12, "Hebrew", { id: "heb", checked: lastNew.lang === "he" }],
      ["button", 100, 8, 46, 14, "OK", { id: "ok", def: true }], ["button", 100, 25, 46, 14, "Cancel", { id: "cancel" }]], "newtextdlg");
  d.outer.dir = he ? "rtl" : "ltr";
  const name = d.byId.name.querySelector("input");
  const ok = () => {
    lastNew = { name: name.value, lang: d.byId.eng.querySelector("input").checked ? "en" : "he" };
    d.close();
    // New text's command: the dialog's `new tx ~name~ visible heb`, its first two ~ made quotes
    if (lastNew.name.trim()) runCommand('new tx "' + lastNew.name + '" visible ' + (lastNew.lang === "he" ? "heb" : "eng"), false);
  };
  d.byId.ok.querySelector("button").onclick = ok;
  d.byId.cancel.querySelector("button").onclick = d.close;
  d.outer.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); ok(); } });
  name.focus();
  name.select();
}

// Help > About: in the spirit of Tag's own Help > About Tag: Tag's message box, no
// caption, #e9e9e9, short lines in a bold system font, each centred, OK under them
function aboutBox() {
  const he = rtl();
  const lines = he
    ? ["Tag PDF", "גירסה: " + CONFIG.version, "לתג 3.99 ומטה"]
    : ["Tag PDF", "Version: " + CONFIG.version, "For Tag 3.99 and lower"];
  const close = () => { outer.remove(); layerState(); focusText(); };
  const [outer, body] = windowShell("", "msg tagabout", close);
  outer.dir = he ? "rtl" : "ltr";
  const ok = el("button", { class: "push default", onclick: close }, he ? "אישור" : "OK");
  body.append(el("div", { class: "aboutbody" }, el("div", { class: "lines" }, ...lines.map((x) => el("div", {}, x))), ok));
  layer.append(outer);
  layerState();
  center(outer);
  ok.focus();
}

// File > Print setup..., as Tag's own Print Setup box:
// the printers, Tag PDF chosen, with each one's status, type, where and comment; paper,
// orientation, and Tag's own "D.p.i. for line breaks". Nothing is kept: OK and Cancel close it.
const PRINTERS = [
  { name: "Tag PDF", type: "Tag PDF", where: "TAGPDF:", comment: "", dpi: 600 },
  { name: "Bullzip PDF Printer", type: "Bullzip PDF Printer", where: "BULLZIP", comment: "", dpi: 300 },
  { name: "Microsoft Print to PDF", type: "Microsoft Print To PDF", where: "PORTPROMPT:", comment: "", dpi: 600 },
  { name: "Microsoft XPS Document Writer", type: "Microsoft XPS Document Writer v4", where: "PORTPROMPT:", comment: "", dpi: 600 },
];
function printSetupDialog() {
  const he = rtl();
  const L = he
    ? { cap: "הגדרת מדפסת", printer: "מדפסת", name: "שם:", props: "מאפיינים", status: "מצב:", type: "סוג:", where: "מיקום:", comment: "הערה:",
      paper: "נייר", size: "גודל:", source: "מקור:", orient: "כיוון", portrait: "לאורך", landscape: "לרוחב", dpi: "D.p.i. לשבירת שורות", ok: "אישור", cancel: "ביטול",
      ready: "מוכן", auto: "בחירה אוטומטית" }
    : { cap: "Print Setup", printer: "Printer", name: "&Name:", props: "&Properties", status: "Status:", type: "Type:", where: "Where:", comment: "Comment:",
      paper: "Paper", size: "Si&ze:", source: "&Source:", orient: "Orientation", portrait: "P&ortrait", landscape: "L&andscape", dpi: "D.p.i. for line breaks", ok: "OK", cancel: "Cancel",
      ready: "Ready", auto: "Automatically Select" };
  const d = tagDialog(L.cap, 288, 174, [
    ["group", 8, 4, 272, 84, L.printer],
    ["static", 16, 20, 36, 8, L.name], ["combo", 52, 18, 152, 152, "", { id: "name", items: PRINTERS.map((x) => x.name), sel: 0 }],
    ["button", 212, 17, 60, 14, L.props, { id: "props" }],
    ["static", 16, 36, 36, 10, L.status], ["static", 52, 36, 224, 10, "", { id: "status" }],
    ["static", 16, 48, 36, 10, L.type], ["static", 52, 48, 224, 10, "", { id: "type" }],
    ["static", 16, 60, 36, 10, L.where], ["static", 52, 60, 224, 10, "", { id: "where" }],
    ["static", 16, 72, 36, 10, L.comment], ["static", 52, 72, 224, 10, "", { id: "comment" }],
    ["group", 8, 92, 164, 56, L.paper],
    ["static", 16, 108, 36, 8, L.size], ["combo", 52, 106, 112, 112, "", { items: ["A4", "Letter", "A3", "A5", "Legal"], sel: 0 }],
    ["static", 16, 128, 36, 8, L.source], ["combo", 52, 126, 112, 112, "", { items: [L.auto], sel: 0 }],
    ["group", 180, 92, 100, 56, L.orient], ["icon", 195, 112, 20, 20, "portrait", { id: "oicon" }],
    ["radio", 224, 106, 52, 12, L.portrait, { id: "portrait", group: true, checked: true }], ["radio", 224, 126, 52, 12, L.landscape, { id: "landscape" }],
    ["static", 82, 156, 64, 9, L.dpi, { align: "end" }], ["static", 149, 156, 22, 10, "", { id: "dpi", sunken: true }],
    ["button", 180, 154, 48, 14, L.ok, { id: "ok", def: true }], ["button", 232, 154, 48, 14, L.cancel, { id: "cancel" }],
  ], "printsetup");
  d.outer.dir = he ? "rtl" : "ltr";
  const sel = d.byId.name.querySelector("select");
  const show = () => {
    const pr = PRINTERS[sel.selectedIndex];
    d.byId.status.textContent = L.ready;
    d.byId.type.textContent = pr.type;
    d.byId.where.textContent = pr.where;
    d.byId.comment.textContent = pr.comment;
    d.byId.dpi.textContent = String(pr.dpi);
  };
  sel.onchange = show;
  show();
  for (const r of ["portrait", "landscape"]) d.byId[r].querySelector("input").onchange = () => d.byId.oicon.classList.toggle("landscape", r === "landscape");
  d.byId.ok.querySelector("button").onclick = d.close;
  d.byId.cancel.querySelector("button").onclick = d.close;
  d.byId.props.querySelector("button").onclick = () => msgbox(t("notHere"));
  sel.focus();
}

// Tag's error box: title "Tag", the message, OK
function tagError(text) { tagMsg("^!" + text, "Tag", false); }

let autoWrap = true;
let seeCommands = false;   // View > See commands
let statusMode = 0;        // the status bar's mode, 0-2

// The menu bar: rebuilt alone when a check mark changes, so the caret stays where it is
function buildMenus() {
  // Tag's own items with the keys Tag shows (its built-in ones and TAG.INI's
  // [MENU KEYS]: F7, F9, Ctrl+I, F2); an item the page can't do is greyed. [act | null, label,
  // checked, key, submenu]. File ends in the TAG.INI macros, as Tag appends them.
  const M = t("menu");
  const items = {
    0: [["newText", M.newText, undefined, "Ctrl+N"], [null, M.open, undefined, "Ctrl+O"], [null, M.save, undefined, "Ctrl+S"], [null, M.saveAs],
      [null, M.saveAll, undefined, "", true], [null, M.closeAll, undefined, "", true], null,
      [null, M.chdir, undefined, "F7"], [null, M.imp, undefined, "Ctrl+I"], [null, M.exp], [null, M.rename], null,
      [null, M.preview, undefined, "F9"], ["printSetup", M.printSetup], [null, M.prefs], null,
      ["exit", t("exit")], null, [null, M.print, undefined, "F2"], null,
      ["settings", t("settings")], ["sayhi", M.sayHi], ["download", t("download")]],
    1: [[null, M.undo, undefined, "Ctrl+Z"], [null, M.cut, undefined, "Ctrl+X"], ["copy", M.copy, undefined, "Ctrl+C"], [null, M.paste, undefined, "Ctrl+V"],
      ["selectAll", M.selectAll, undefined, "Ctrl+A"], null, ["wrap", M.wrap, autoWrap], [null, M.second], [null, M.charmap, undefined, "Ctrl+Q"]],
    2: [[null, M.split], [null, M.ruler, true], [null, M.pagePreview, undefined, "", true], null,
      [null, M.fit], [null, M.zoom + " \u00d7 1", true], null,
      ["see", t("seeCmds"), seeCommands, "Alt+R"], [null, M.accents], [null, M.attrs], null,
      ["en", "English", lang === "en"], ["he", "עברית", lang === "he"], null, ["skin10", t("dlg10"), skin === "10"], ["skin7", t("dlg7"), skin === "7"]],
    8: kids.map((k, i) => ["win" + i, "&" + (i + 1) + " " + k.title.replace(/^\d+\s+/, ""), k === active]),
    9: [[null, M.special], [null, M.shortcuts], null, ["about", t("about")]],
  };
  const bar = document.getElementById("menubar");
  bar.dir = rtl() ? "rtl" : "ltr";
  bar.replaceChildren();
  t("menus").forEach((title, n) => {
    const top = el("div", { class: "top" + (items[n] ? "" : " inert") });
    const b = el("button", { "aria-haspopup": items[n] ? "true" : false }, mnemonic(title));
    top.append(b);
    if (items[n]) {
      const pull = el("div", { class: "pull", role: "menu" });
      for (const it of items[n]) {
        if (!it) { pull.append(el("hr")); continue; }
        const [act, label, checked, key, sub] = it;
        pull.append(el("button", { role: checked === undefined ? "menuitem" : "menuitemcheckbox", "aria-checked": checked === undefined ? false : String(checked),
          disabled: !act, onclick: () => { closeMenus(); act.startsWith("win") ? mdiShow(kids[+act.slice(3)]) : ACTS[act](); } },
          mnemonic(label), el("span", { class: "key" }, key || ""), ...(sub ? [el("span", { class: "sub" })] : [])));
      }
      top.append(pull);
      b.addEventListener("click", (e) => { e.stopPropagation(); const was = top.classList.contains("open"); closeMenus(); top.classList.toggle("open", !was); });
      b.addEventListener("mouseenter", () => { if (bar.querySelector(".open") && !top.classList.contains("open")) { closeMenus(); top.classList.add("open"); } });
    }
    bar.append(top);
  });
  if (active?.state === "max") bar.append(el("span", { class: "mdibtns" }, ...childButtons(["min", "restore", "close"])));
}

function buildFrame() {
  document.documentElement.lang = lang;
  for (const n of document.querySelectorAll("[data-t]")) n.textContent = t(n.dataset.t);
  document.title = "Tag PDF";
  caption();

  // Tag's menus; File, View and Help work here
  buildMenus();

  // the instruction bar: the command line runs WINPDFSET.PRG, as File > PDF settings does in Tag
  const instr = document.getElementById("instr");
  const cmd = el("input", { id: "cmd", value: cmdHistory[0] || "", spellcheck: "false", "aria-label": "Command line",
    onkeydown: (e) => {
      if (e.key === "Enter") { e.preventDefault(); ACTS.run(); }
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        // the history, as the combo's list: Up goes back to older commands
        e.preventDefault();
        const i = Math.max(0, Math.min(cmdHistory.length - 1, cmdHistory.indexOf(cmd.value) + (e.key === "ArrowUp" ? 1 : -1)));
        if (cmdHistory[i] !== undefined) cmd.value = cmdHistory[i];
      }
    } });
  instr.replaceChildren(
    // G runs the command line; the next button is Auto wrap, a toggle (on, as Tag starts)
    el("button", { class: "btn raised g", title: "Go", onclick: ACTS.run }, "G"),
    el("span", { class: "combo sunken cmd", id: "cmdbox", onmousedown: (e) => {
      // the arrow (the combo's right 18 px) drops the history down
      const r = e.currentTarget.getBoundingClientRect();
      if (e.clientX < r.right - 19) return;
      e.preventDefault();
      if (dropList.owner === e.currentTarget) { closeDrop(); return; }
      openDrop(e.currentTarget, cmdHistory.map((h) => [h]), cmd.value, (i) => { cmd.value = cmdHistory[i]; cmd.focus(); });
    } }, cmd),
    el("button", { class: "btn raised" + (autoWrap ? " on" : ""), id: "wrapbtn", title: "Auto wrap", "aria-pressed": String(autoWrap), onclick: () => ACTS.wrap() }, "\u21B5"),
    dropCombo("font", () => docFonts().map((f, i) => [f + " (" + (i + 1) + ")"])),
    dropCombo("weight", () => t("weights").map((w) => [w])),
    el("button", { class: "btn raised it", id: "it", tabindex: "-1", title: "Italic" }, "I"),
    el("button", { class: "btn raised un", id: "un", tabindex: "-1", title: "Underline" }, "U"),
    el("span", { class: "size sunken", id: "sizefield" }),
    el("span", { class: "spin" }, el("span", { class: "raised" }, "\u25B2"), el("span", { class: "raised" }, "\u25BC")),
    codeCombo(),
  );

  // the status bar: the caret's fields (statusUpdate), the path, cm; a click cycles the mode
  const status = document.getElementById("status");
  status.className = "status " + (rtl() ? "he" : "en");
  status.replaceChildren(
    el("span", { class: "fields", id: "fields", dir: rtl() ? "rtl" : "ltr" }),
    el("span", { class: "path" }, "C:\\TAG\\TAGPDF.I"),
    el("span", { class: "cm raised" }, "cm"),
  );
  status.onclick = (e) => { if (!e.target.closest(".cm")) { statusMode = (statusMode + 1) % 3; statusUpdate(); } };
  status.onmousedown = (e) => e.preventDefault();

  // the site's page: child 1, read only, in the UI's language
  if (!siteChild && !kids.length && !frameBuilt) siteChild = makeChild({ title: t("childTitle"), short: t("childShort"), lang, editable: false });
  frameBuilt = true;
  if (siteChild) {
    const doc = siteChild.doc;
    siteChild.lang = lang;
    siteChild.text.dir = rtl() ? "rtl" : "ltr";
    doc.innerHTML = tv("doc");
    for (const b of doc.querySelectorAll("[data-act]")) b.addEventListener("click", ACTS[b.dataset.act]);
    for (const c of doc.querySelectorAll(".cta")) c.contentEditable = "false";
    markCodes(doc);
  }
  for (const k of kids) k.doc.classList.toggle("see", seeCommands);
  if (!active && kids.length) activate(kids.at(-1));
  else if (active) { ruler(active); caption(); }
  if (active === siteChild) caretHome();
  statusUpdate();
}
let frameBuilt = false;

// Every paragraph of the page gets a style code, as a Tag text has (the code byte at its start);
// spaces become spans so See commands can put Tag's ^ under each one
const CODE_OF = [["h1", "01"], ["h2", "02"], ["p", "03"], ["li", "04"], [".note", "05"], [".cta", "06"]];
function markCodes(doc) {
  for (const [sel, code] of CODE_OF) for (const n of doc.querySelectorAll(sel)) n.dataset.code = code;
  markForeign(doc);
  const walk = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.parentElement.closest(".cta") || !n.data.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  for (const n of nodes) {
    const parts = n.data.split(/( )/);
    if (parts.length < 2) continue;
    n.replaceWith(...parts.filter(Boolean).map((x) => x === " " ? el("span", { class: "sp" }, " ") : document.createTextNode(x)));
  }
}

// The secondary language's runs: Latin words in a Hebrew text, Hebrew ones in an English text
// (with the spaces and signs between two of them). See commands paints each run on Tag's grey and
// draws it in logical order in the paragraph's direction.
function markForeign(doc) {
  const rx = doc.closest(".text")?.dir === "rtl"
    ? /[A-Za-z0-9][A-Za-z0-9 .,:;'"()\/_+&%-]*[A-Za-z0-9)]|[A-Za-z]/g
    : /[\u05d0-\u05ea][\u05d0-\u05ea\u0591-\u05c7 "'-]*[\u05d0-\u05ea]|[\u05d0-\u05ea]/g;
  const walk = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.parentElement.closest(".cta, code") || !n.data.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  for (const n of nodes) {
    const parts = [];
    let last = 0;
    for (const m of n.data.matchAll(rx)) {
      if (m.index > last) parts.push(document.createTextNode(n.data.slice(last, m.index)));
      parts.push(el("span", { class: "fl" }, m[0]));
      last = m.index + m[0].length;
    }
    if (!parts.length) continue;
    if (last < n.data.length) parts.push(document.createTextNode(n.data.slice(last)));
    n.replaceWith(...parts);
  }
}

// Tag's style combo in the instruction bar: the code of the paragraph
// holding the caret, a light-blue ¶ (the style has a paragraph block) and its {name}; the list
// holds every code of the sheet, the current one inverted
function codeRow(code) {
  return [el("b", { class: "code" }, code), el("span", { class: "pil" }, "\u00B6"), el("span", { class: "name" }, "{" + t("codes")[code] + "}")];
}
function codeCombo() {
  return dropCombo("codes", () => Object.keys(t("codes")).map((c) => codeRow(c)));
}

// A combo of the instruction bar: a field and a list that drops below it (in a layer of its own,
// so the bar never clips it). Rows are arrays of nodes or strings; the current row is the one
// whose text is the field's. The text is read only, so picking a row only closes the list.
function dropCombo(kind, rows) {
  const field = el("span", { class: "field", id: kind + "field" });
  const box = el("span", { class: "combo sunken " + kind, dir: kind === "codes" && rtl() ? "rtl" : "ltr", role: "combobox", "aria-expanded": "false" }, field);
  box.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (dropList.owner === box) { closeDrop(); return; }
    openDrop(box, rows(), field.textContent);
  });
  return box;
}

const dropList = el("div", { class: "droplist", role: "listbox", hidden: true });
document.body.append(dropList);
function openDrop(box, rows, current, onPick) {
  closeDrop();
  dropList.replaceChildren(...rows.map((r, i) => {
    const row = el("div", { class: "row", role: "option" }, ...r.map((x) => (typeof x === "string" ? x : x.cloneNode(true))));
    row.classList.toggle("cur", row.textContent === current);
    row.addEventListener("mousedown", (e) => { e.preventDefault(); e.stopPropagation(); closeDrop(); onPick?.(i); });
    return row;
  }));
  const r = box.getBoundingClientRect();
  dropList.dir = box.dir;
  Object.assign(dropList.style, { left: r.left + "px", top: r.bottom + "px", minWidth: r.width + "px" });
  dropList.hidden = false;
  dropList.owner = box;
  box.setAttribute("aria-expanded", "true");
  dropList.querySelector(".cur")?.scrollIntoView({ block: "nearest" });
}
function closeDrop() {
  dropList.hidden = true;
  dropList.owner?.setAttribute("aria-expanded", "false");
  dropList.owner = null;
}
document.addEventListener("mousedown", (e) => { if (dropList.owner && !dropList.contains(e.target) && !dropList.owner.contains(e.target)) closeDrop(); });
addEventListener("resize", closeDrop);

// Every font the document uses, in the order they first appear (Tag's font combo lists the
// fonts of the printer table; here the page's own)
function docFonts() {
  const seen = [];
  if (!active) return [];
  const walk = document.createTreeWalker(active.doc, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    if (!walk.currentNode.data.trim()) continue;
    const f = fontName(walk.currentNode.parentElement);
    if (!seen.includes(f)) seen.push(f);
  }
  return seen;
}
const fontName = (e) => getComputedStyle(e).fontFamily.split(",")[0].replace(/["']/g, "").trim();

// The font, weight, size, I and U of the character before the caret (the one after it at a
// paragraph's start), as Tag shows them
function instrUpdate(node) {
  const cs = getComputedStyle(node);
  const fonts = docFonts();
  const f = fontName(node);
  const set = (id, v) => { const e = document.getElementById(id); if (e && e.textContent !== v) e.textContent = v; };
  set("fontfield", f + " (" + (fonts.indexOf(f) + 1) + ")");
  set("weightfield", t("weights")[parseInt(cs.fontWeight, 10) >= 600 ? 1 : 0]);
  set("sizefield", String(Math.round(parseFloat(cs.fontSize) * 0.75)));
  document.getElementById("it")?.classList.toggle("on", cs.fontStyle === "italic");
  document.getElementById("un")?.classList.toggle("on", cs.textDecorationLine.includes("underline") || !!node.closest("u"));
}

// ---- the text of a child: Tag's text window has a caret, so the page is contenteditable.
// The site's page refuses every edit (the arrows, Home / End, Ctrl+arrows, PgUp / PgDn and clicks
// move the caret); a new text takes typing as plain text: spaces become Tag's marked spaces,
// Enter starts a paragraph, formatting and pasted styles are dropped.
function wireText(c) {
  const doc = c.doc;
  doc.contentEditable = "true";
  if (c.editable) {
    doc.addEventListener("beforeinput", (e) => {
      if (e.inputType === "insertText" && e.data) { e.preventDefault(); insertPlain(e.data); }
      else if (e.inputType === "insertParagraph" || e.inputType === "insertLineBreak") { e.preventDefault(); document.execCommand("insertParagraph"); }
      else if (e.inputType.startsWith("format") || e.inputType === "insertFromDrop") e.preventDefault();
    });
    doc.addEventListener("paste", (e) => { e.preventDefault(); insertPlain(e.clipboardData.getData("text/plain").replace(/\r\n?/g, "\n")); });
    doc.addEventListener("input", () => { c.modified = true; tidyText(c); statusUpdate(); drawCaret(); });
  } else {
    for (const ev of ["beforeinput", "paste", "drop", "cut", "dragstart"]) doc.addEventListener(ev, (e) => e.preventDefault());
    doc.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === "Tab") e.preventDefault(); });
  }
  doc.addEventListener("focus", drawCaret);
  doc.addEventListener("blur", drawCaret);
  doc.addEventListener("keydown", () => {
    caretEl.classList.remove("idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => caretEl.classList.add("idle"), CARET_TIMEOUT);
  });
}
// The frontmost text window is the active one whatever has the focus, as Tag's: each child keeps
// its last selection, and the status bar and the instruction bar read that one
document.addEventListener("selectionchange", () => {
  const sel = getSelection();
  if (active && sel.rangeCount && active.doc.contains(sel.anchorNode) && active.doc.contains(sel.focusNode)) {
    active.sel = { anchorNode: sel.anchorNode, anchorOffset: sel.anchorOffset, focusNode: sel.focusNode, focusOffset: sel.focusOffset };
  }
  statusUpdate();
  drawCaret();
});

// the child's selection: the live one while it is in its text, else the one it kept
function textSelection(c = active) {
  const sel = getSelection();
  if (c && sel.rangeCount && c.doc.contains(sel.anchorNode) && c.doc.contains(sel.focusNode)) return sel;
  const k = c?.sel;
  if (!k || !c.doc.contains(k.focusNode) || !c.doc.contains(k.anchorNode)) return null;
  const r = document.createRange();
  r.setStart(k.anchorNode, k.anchorOffset);
  r.setEnd(k.focusNode, k.focusOffset);
  const back = r.collapsed && (k.anchorNode !== k.focusNode || k.anchorOffset !== k.focusOffset);
  if (back) { r.setStart(k.focusNode, k.focusOffset); r.setEnd(k.anchorNode, k.anchorOffset); }
  return { ...k, rangeCount: 1, isCollapsed: k.anchorNode === k.focusNode && k.anchorOffset === k.focusOffset, getRangeAt: () => r, toString: () => r.toString() };
}

// typed or pasted text at the caret: spaces as marked spans, a line end as a new paragraph
function insertPlain(text) {
  const lines = text.split("\n");
  lines.forEach((line, n) => {
    if (n) document.execCommand("insertParagraph");
    const sel = getSelection();
    if (!sel.rangeCount) return;
    const r = sel.getRangeAt(0);
    r.deleteContents();
    const frag = document.createDocumentFragment();
    let last = null;
    for (const part of line.split(/( )/).filter(Boolean)) frag.append(last = part === " " ? el("span", { class: "sp" }, " ") : document.createTextNode(part));
    if (!last) return;
    r.insertNode(frag);
    r.setStartAfter(last);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
  });
  active?.doc.dispatchEvent(new Event("input"));
}

// a new text's paragraphs: every block a <p>; an empty one keeps its ¶ at the line's start
function tidyText(c) {
  if (!c.doc.firstElementChild) c.doc.append(el("p", {}, el("br")));
  for (const b of c.doc.children) {
    b.classList.toggle("empty", !b.textContent);
  }
}

function focusText() {
  if (!active || layer.querySelector(".dlg,.msg")) return;
  active.doc.focus({ preventScroll: true });
  // back to where the caret was in this window
  const k = active.sel;
  if (k && active.doc.contains(k.anchorNode) && active.doc.contains(k.focusNode)) getSelection().setBaseAndExtent(k.anchorNode, k.anchorOffset, k.focusNode, k.focusOffset);
}

// Tag's caret over the text (the browser's is transparent, caret-color). As Tag's caret: the
// Windows system caret, which inverts what is under it;
// 2 px wide over columns x-1 and x, as tall as the line's largest glyph ascent + descent (not the
// line spacing); at the very end of the text a 6 x 6 square ending a row above the baseline
// (right of x on an LTR line, left of it on an RTL one). It blinks at GetCaretBlinkTime (530 ms
// by default; Tag never sets it) and Windows 10 stops the blinking after 5 s without input.
// Not done: the triangle carets Tag shows where the language changes.
const caretEl = el("div", { id: "caret", hidden: true });
let caretTimer = 0, idleTimer = 0;
const BLINK = 530, CARET_TIMEOUT = 5000;

function drawCaret() {
  if (!active) { caretEl.hidden = true; return; }
  const doc = active.doc, text = active.text;
  const sel = getSelection();
  const show = document.activeElement === doc && sel.rangeCount && sel.isCollapsed && doc.contains(sel.focusNode);
  caretEl.hidden = !show;
  if (!show) return;
  const r = sel.getRangeAt(0).cloneRange();
  const node = sel.focusNode.nodeType === 1 ? sel.focusNode : sel.focusNode.parentElement;
  const rtlHere = getComputedStyle(node).direction === "rtl";
  let box = [...r.getClientRects()].pop();
  if (!box || !box.height) {
    // at an element's edge a collapsed range has no box: the edge of the node there (read only,
    // so the selection isn't disturbed)
    const n = sel.focusNode.nodeType === 1 ? sel.focusNode.childNodes[sel.focusOffset] || sel.focusNode : sel.focusNode;
    const nr = document.createRange();
    nr.selectNodeContents(n);
    const b = nr.getClientRects()[0] || (n.nodeType === 1 ? n.getBoundingClientRect() : null);
    if (!b) { caretEl.hidden = true; return; }
    const rtlN = getComputedStyle(n.nodeType === 1 ? n : n.parentElement).direction === "rtl";
    box = { left: rtlN ? b.right : b.left, top: b.top, bottom: b.bottom, height: b.height };
  }
  // the line's largest glyph box: every text box of the paragraph that shares the caret's line
  let top = box.top, bottom = box.top + box.height;
  const para = node.closest("[data-code], .page > *");
  if (para && para !== doc) {
    const pr = document.createRange();
    pr.selectNodeContents(para);
    const mid = box.top + box.height / 2;
    for (const x of pr.getClientRects()) if (x.height > 4 && x.top <= mid && x.bottom >= mid) { top = Math.min(top, x.top); bottom = Math.max(bottom, x.bottom); }
  }
  // the end of the text: the 6 x 6 caret, its bottom row a pixel above the baseline
  const end = document.createRange();
  end.selectNodeContents(doc);
  end.setStart(sel.focusNode, sel.focusOffset);
  const atEnd = !end.toString().trim();
  const t = text.getBoundingClientRect();
  let x = box.left - t.left + text.scrollLeft;
  let y = top - t.top + text.scrollTop, h = bottom - top;
  if (atEnd) {
    const fs = parseFloat(getComputedStyle(node).fontSize);
    const baseline = box.top + box.height - 0.207 * fs - t.top + text.scrollTop;   // Tahoma's descent
    if (rtlHere) x -= 6;
    y = Math.round(baseline) - 6; h = 6;
  } else x -= 1;
  caretEl.classList.toggle("end", atEnd);
  caretEl.style.left = x + "px";
  caretEl.style.top = y + "px";
  caretEl.style.height = h + "px";
  // shown while it moves, then blinking, then (no input for 5 s) steady
  caretEl.classList.add("moving");
  caretEl.classList.remove("idle");
  clearTimeout(caretTimer);
  clearTimeout(idleTimer);
  caretTimer = setTimeout(() => caretEl.classList.remove("moving"), BLINK);
  idleTimer = setTimeout(() => caretEl.classList.add("idle"), CARET_TIMEOUT);
}
addEventListener("resize", drawCaret);

function caretHome(c = active) {
  if (!c || layer.querySelector(".dlg,.msg")) return;
  const first = c.doc.firstElementChild;
  if (!first) return;
  c.doc.focus({ preventScroll: true });
  getSelection().collapse(first.firstChild || first, 0);
}

// The status bar and the code combo follow the caret, as Tag's do: mode 0 Page,
// Line, Depth (the caret's line from the text's top), Leading (that line's height), LL; mode 1
// Char lead, Word sp; mode 2 the ASCII value of the character before the caret (Tag's byte:
// Hebrew in CP862), its position and the total
const CM = 96 / 2.54;
const cm = (px) => (px / CM).toFixed(2).replace(/\.?0+$/, "") + " cm";
function tagByte(ch) {
  const c = ch.codePointAt(0);
  if (c >= 0x5d0 && c <= 0x5ea) return 0x80 + c - 0x5d0;
  return c < 256 ? c : 63;
}

function statusUpdate() {
  const fields = document.getElementById("fields");
  if (!fields) return;
  const cf = document.getElementById("codesfield");
  if (!active) {
    // no text: the status bar shows only the folder, the bar's fields are blank
    fields.replaceChildren();
    for (const id of ["fontfield", "weightfield", "sizefield"]) { const e = document.getElementById(id); if (e) e.textContent = ""; }
    if (cf) { cf.replaceChildren(); delete cf.dataset.code; }
    return;
  }
  const doc = active.doc;
  const sel = textSelection() || { rangeCount: 0, isCollapsed: true, toString: () => "" };
  let focus = doc.firstElementChild || doc, off = 0;
  if (sel.rangeCount) { focus = sel.focusNode; off = sel.focusOffset; }
  const el0 = focus.nodeType === 1 ? focus : focus.parentElement;

  // the code combo: the code of the caret's paragraph (a new text has none)
  const para = el0.closest(".page > *") || doc.firstElementChild || doc;
  const code = para.dataset?.code || "";
  if (cf && cf.dataset.code !== code) {
    cf.dataset.code = code;
    cf.replaceChildren(...(code ? codeRow(code) : []));
  }
  // the character before the caret, or the one after it at the start of a text node
  let charEl = el0;
  if (focus.nodeType === 1) {
    const k = focus.childNodes[off - 1] || focus.childNodes[off];
    if (k) charEl = k.nodeType === 1 ? k : k.parentElement;
  }
  instrUpdate(charEl);

  // text before the caret; a paragraph end counts one character, as Tag's CR
  const r = document.createRange();
  r.setStart(doc, 0);
  r.setEnd(focus, off);
  const blocks = [...doc.children];
  const ends = blocks.filter((b) => r.comparePoint(b, b.childNodes.length) > 0 && !b.contains(focus)).length;
  const before = r.toString();
  const pos = before.length + ends;
  const total = doc.textContent.replace(/\s+/g, " ").length + blocks.length;

  // the lines down to the caret's: a box below the line so far starts the next line
  const rects = [...r.getClientRects()].filter((x) => x.height > 4).sort((a, b) => a.top - b.top);
  let lines = 0, bottom = -Infinity, lineTop = 0, lineH = 0;
  for (const x of rects) {
    if (x.top >= bottom - 2) { lines++; bottom = x.bottom; lineTop = x.top; lineH = x.height; } else bottom = Math.max(bottom, x.bottom);
  }
  const page = doc.getBoundingClientRect();
  const st = t("st");
  const f = (k, v) => el("span", {}, el("b", {}, k), " ", v);
  const items = [];
  if (statusMode === 0) {
    // Leading: the line's spacing; Depth: from the text's top down to the bottom of the caret's
    // line, so on line 1 it equals the leading (as in Tag's status bar)
    const lead = parseFloat(getComputedStyle(para.nodeType === 1 ? para : el0).lineHeight) || lineH;
    const top0 = (doc.firstElementChild || doc).getBoundingClientRect().top;
    const ll = cm(doc.getBoundingClientRect().width);
    if (sel.isCollapsed || !sel.rangeCount) {
      const depth = lines ? lineTop + lineH + (lead - lineH) / 2 - top0 : lead;
      items.push(f(st.page, "1"), f(st.line, String(Math.max(1, lines))), f(st.depth, cm(Math.max(0, depth))), f(st.leading, cm(lead)), f(st.ll, ll));
    } else {
      // a selection: Line and Depth of the lines it holds, Leading at its start, then
      // Distance, its extent along its first line (the end capped at that line's end)
      const sr = sel.getRangeAt(0);
      const boxes = [...sr.getClientRects()].filter((x) => x.height > 4 && x.width > 0).sort((a, b) => a.top - b.top);
      const groups = [];
      for (const x of boxes) {
        const g = groups.at(-1);
        if (g && x.top < g.bottom - 2) { g.left = Math.min(g.left, x.left); g.right = Math.max(g.right, x.right); g.bottom = Math.max(g.bottom, x.bottom); }
        else groups.push({ top: x.top, bottom: x.bottom, left: x.left, right: x.right });
      }
      const n = groups.length;
      const depth = n ? groups[n - 1].bottom - groups[0].top + (lead - (groups[0].bottom - groups[0].top)) : 0;
      items.push(f(st.page, "1"), f(st.line, String(n)), f(st.depth, cm(Math.max(0, depth))), f(st.leading, cm(lead)), f(st.ll, ll),
        f(st.distance, cm(n ? groups[0].right - groups[0].left : 0)));
    }
  } else if (statusMode === 1) {
    items.push(f(st.page, "1"), f(st.charLead, cm(parseFloat(getComputedStyle(el0).fontSize))), f(st.wordSp, "0.25 EM, 0.75, 1.5"));
  } else {
    const ch = before.slice(-1) || " ";
    const v = tagByte(ch);
    const asc = String(v).padStart(3, "\u00a0") + " (" + st.hex + " " + v.toString(16).padStart(2, "0") + ")";
    const selected = sel.isCollapsed ? 0 : sel.toString().length;
    items.push(f(st.page, "1"), f(st.ascii, asc));
    if (selected) items.push(el("span", {}, selected + " " + st.inSel));
    else items.push(f(st.pos, String(pos)), f(st.total, total + (st.chars ? " " + st.chars : "") + "\u00a0\u00a0 (" + (pos * 100 / total).toFixed(1).replace(/\.0$/, "") + "%)"));
  }
  fields.replaceChildren(...items);
}

// Tag's caption: Windows 10's, or 7.css's title bar
function caption() {
  const cap = document.getElementById("caption");
  const text = "Tag PDF" + (active?.state === "max" ? " - [" + active.short + "]" : "");
  const act = { onclick: () => msgbox(t("exitText")) };
  if (skin === "7") {
    cap.className = "caption win7";
    cap.replaceChildren(el("div", { class: "title-bar active" },
      el("div", { class: "title-bar-text" }, el("span", { class: "app-icon" }), text),
      el("div", { class: "title-bar-controls" }, el("button", { "aria-label": "Minimize", tabindex: "-1" }), el("button", { "aria-label": "Maximize", tabindex: "-1" }), el("button", { "aria-label": "Close", tabindex: "-1", ...act }))));
  } else {
    cap.className = "caption";
    cap.replaceChildren(el("span", { class: "app-icon" }), el("span", { class: "caption-text" }, text),
      el("span", { class: "caption-buttons" }, el("button", { class: "cb min", tabindex: "-1", "aria-label": "Minimize" }), el("button", { class: "cb max", tabindex: "-1", "aria-label": "Maximize" }), el("button", { class: "cb close", tabindex: "-1", "aria-label": "Close", ...act })));
  }
}

// ---- the MDI children. Each is normal (a new one fills the client, like Tag's, without being
// maximised), maximised, minimised (an iconic bar) or closed; moved by its caption, sized by
// its frame. As Windows' MDI: while the active child is maximised, a child activated is too.
// The caret, the instruction bar, the status bar and the Window menu follow the active child.

const MIN_W = 220, MIN_H = 120;
const kids = [];
let active = null;
let siteChild = null;

function childButtons(which, c = active) {
  const glyph = { min: "\u2013", max: "\u2610", restore: "\u2750", close: "\u2715" };
  const label = { min: "Minimize", max: "Maximize", restore: "Restore", close: "Close" };
  const act = { min: () => mdiSet(c, "min"), max: () => mdiSet(c, "max"), restore: () => mdiSet(c, c.state === "min" && c.wasMax ? "max" : "normal"), close: () => mdiClose(c) };
  return which.map((w) => el("button", { class: w, tabindex: "-1", "aria-label": label[w], title: label[w], onclick: (e) => { e.stopPropagation(); act[w](); } }, glyph[w]));
}

// a child window: {title, short, lang, editable}; `html` fills a read-only one
function makeChild(o) {
  const c = { ...o, state: "normal", rect: defaultRect(kids.length), wasMax: false };
  c.titleEl = el("span", { class: "child-title" }, o.title);
  c.btns = el("span", { class: "child-buttons" });
  c.cap = el("div", { class: "child-caption" }, el("span", { class: "child-icon" }), c.titleEl, c.btns);
  c.ruler = el("div", { class: "ruler" });
  c.doc = el("div", { class: "page" + (o.editable ? " newtext " + o.lang : ""), spellcheck: "false" });
  c.text = el("div", { class: "text", dir: o.lang === "he" ? "rtl" : "ltr" }, c.doc);
  c.el = el("section", { class: "child" }, c.cap, c.ruler, c.text);
  c.ibtns = el("span", { class: "child-buttons" });
  c.ititle = el("span", { class: "child-title" }, o.short);
  c.iconic = el("div", { class: "iconic", hidden: true }, el("span", { class: "child-icon" }), c.ititle, c.ibtns);
  document.getElementById("mdi").append(c.el, c.iconic);
  wireChild(c);
  wireText(c);
  new ResizeObserver(() => ruler(c)).observe(c.text);
  kids.push(c);
  return c;
}

// where a child first opens: a normal window, not filling the client: about 56 % of the
// client's width (at least 640 px) and 82 % of its height,
// centred, each later one 26 px further down and right, as Windows cascades
function defaultRect(n) {
  const area = document.getElementById("mdi");
  const W = area.clientWidth || innerWidth, H = area.clientHeight || innerHeight - 120;
  const w = Math.min(W - 8, Math.max(640, Math.round(W * 0.56)));
  const h = Math.min(H - 8, Math.max(MIN_H, Math.round(H * 0.82)));
  const step = (n * 26) % Math.max(26, H - h);
  return { x: Math.max(0, Math.round((W - w) / 2)) + step, y: Math.round((H - h) / 3) + step, w, h };
}

function activate(c) {
  if (!c) { active = null; buildMenus(); caption(); statusUpdate(); return; }
  const wasMax = active && active !== c && active.state === "max";
  if (active && active !== c && wasMax) { active.state = "normal"; layout(active); }
  active = c;
  if (wasMax && c.state === "normal") c.state = "max";
  for (const k of kids) { k.el.classList.toggle("inactive", k !== c); k.el.style.zIndex = k === c ? "2" : "1"; }
  c.text.append(caretEl);
  layout(c);
  queueMicrotask(focusText);
  buildMenus();
  caption();
  ruler(c);
  statusUpdate();
}

function mdiSet(c, state) {
  if (state === "min") c.wasMax = c.state === "max";
  c.state = state;
  layout(c);
  if (state === "min") {
    // the next child shown becomes active, as Windows activates the next window
    const next = [...kids].reverse().find((k) => k !== c && k.state !== "min" && k.state !== "closed");
    if (next && active === c) { activate(next); return; }
  }
  activate(state === "closed" ? null : c);
}

function mdiClose(c) {
  c.state = "closed";
  c.el.remove();
  c.iconic.remove();
  kids.splice(kids.indexOf(c), 1);
  if (c === siteChild) siteChild = null;
  activate(kids.filter((k) => k.state !== "min").pop() || kids.at(-1) || null);
  if (!active) caretEl.hidden = true;
}

// Window › n: the child, shown and active (a minimised one restored)
function mdiShow(c) {
  if (c.state === "min") { mdiSet(c, c.wasMax ? "max" : "normal"); return; }
  activate(c);
  focusText();
}

function layout(c) {
  const area = document.getElementById("mdi");
  c.el.hidden = c.state === "min";
  c.el.classList.toggle("max", c.state === "max");
  c.iconic.hidden = c.state !== "min";
  // minimised children line up from the bottom-left, as Windows arranges icons
  const mins = kids.filter((k) => k.state === "min");
  if (c.state === "min") c.iconic.style.left = (2 + mins.indexOf(c) * 204) + "px";
  c.btns.replaceChildren(...childButtons(["min", "max", "close"], c));
  c.ibtns.replaceChildren(...childButtons(["restore", "max", "close"], c));
  if (c.rect) {
    const W = area.clientWidth, H = area.clientHeight, r = c.rect;
    r.w = Math.max(MIN_W, Math.min(r.w, W)); r.h = Math.max(MIN_H, Math.min(r.h, H));
    r.x = Math.max(60 - r.w, Math.min(r.x, W - 60)); r.y = Math.max(0, Math.min(r.y, H - 24));
    Object.assign(c.el.style, { left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px" });
  } else {
    Object.assign(c.el.style, { left: "0", top: "0", width: "100%", height: "100%" });
  }
}
function layoutAll() { for (const k of kids) layout(k); }

// moving by the caption; sizing by the frame and its corners; a click anywhere activates
function wireChild(c) {
  const EDGE = 6;
  const edges = (e) => {
    const r = c.el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    return (y < EDGE ? "n" : y > r.height - EDGE ? "s" : "") + (x < EDGE ? "w" : x > r.width - EDGE ? "e" : "");
  };
  let dragging = false;
  c.el.addEventListener("pointerdown", () => { if (active !== c) activate(c); }, true);
  c.iconic.addEventListener("pointerdown", () => { if (active !== c) activate(c); });
  c.el.addEventListener("pointermove", (e) => {
    if (c.state !== "normal" || dragging) return;
    const ed = e.target === c.el ? edges(e) : "";
    c.el.style.cursor = ed ? ed + "-resize" : "";
  });
  const drag = (e, how) => {
    const start = { x: c.el.offsetLeft, y: c.el.offsetTop, w: c.el.offsetWidth, h: c.el.offsetHeight }, sx = e.clientX, sy = e.clientY;
    const target = e.currentTarget;
    try { target.setPointerCapture(e.pointerId); } catch { /* a synthetic pointer (#measure) */ }
    dragging = true;
    const move = (m) => {
      const dx = m.clientX - sx, dy = m.clientY - sy;
      const r = { ...start };
      // `how` is "move" or the edges being sized ("n", "se", ...): "move" itself holds an "e"
      if (how === "move") { r.x += dx; r.y += dy; }
      else {
        if (how.includes("e")) r.w = Math.max(MIN_W, start.w + dx);
        if (how.includes("s")) r.h = Math.max(MIN_H, start.h + dy);
        if (how.includes("w")) { r.w = Math.max(MIN_W, start.w - dx); r.x = start.x + start.w - r.w; }
        if (how.includes("n")) { r.h = Math.max(MIN_H, start.h - dy); r.y = start.y + start.h - r.h; }
      }
      c.rect = r;
      layout(c);
    };
    const up = () => { dragging = false; target.removeEventListener("pointermove", move); target.removeEventListener("pointerup", up); drawCaret(); };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
  };
  c.cap.addEventListener("pointerdown", (e) => { if (c.state === "normal" && !e.target.closest("button")) drag(e, "move"); });
  c.cap.addEventListener("dblclick", (e) => { if (!e.target.closest("button")) mdiSet(c, "max"); });
  c.el.addEventListener("pointerdown", (e) => { if (c.state === "normal" && e.target === c.el) { const ed = edges(e); if (ed) drag(e, ed); } });
  c.iconic.addEventListener("dblclick", () => mdiShow(c));
}

// The ruler counts cm from the text's start edge, as Tag's (right to left for Hebrew).
function ruler(c = active) {
  if (!c || c.state === "min") return;
  const r = c.ruler;
  const ltr = c.text.dir !== "rtl";
  const scale = el("div", { class: "scale" });
  r.replaceChildren(el("span", { class: "unit raised" }, "cm"), el("span", { class: "arrow raised" }, ltr ? "\u25BA" : "\u25C4"), scale);
  const page = c.doc.getBoundingClientRect();
  const s = scale.getBoundingClientRect();
  const cm = 96 / 2.54;
  const zero = ltr ? page.left - s.left : page.right - s.left;
  for (let n = 0; ; n++) {
    const x = zero + (ltr ? n : -n) * cm;
    if (x < -20 || x > s.width + 20) break;
    scale.append(el("span", { style: { left: x + "px" } }, String(n)));
  }
  for (let n = -60; n <= 60; n++) { // the ticks: every cm long, every half short
    const x = zero + n * cm / 2;
    if (x < 0 || x > s.width) continue;
    scale.append(el("i", { style: { position: "absolute", left: x + "px", bottom: 0, width: "1px", height: n % 2 ? "3px" : "6px", background: "#000" } }));
  }
}
addEventListener("resize", layoutAll);

// a click on the menu bar, a caption, a ruler or the MDI client keeps the text's focus and caret
document.addEventListener("mousedown", (e) => {
  if (e.target.closest("#menubar, #caption, .child-caption, .ruler, .iconic, .mdi") && !e.target.closest(".text, input, select")) e.preventDefault();
}, true);

// no browser context menu anywhere on the site (Tag has none of its own here)
document.addEventListener("contextmenu", (e) => e.preventDefault());

function closeMenus() { for (const m of document.querySelectorAll(".menubar .open")) m.classList.remove("open"); }
document.addEventListener("click", closeMenus);
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyG" && (e.altKey !== e.ctrlKey) && !e.shiftKey) {
    e.preventDefault();
    if (!layer.querySelector(".dlg,.msg")) ACTS.run();
    return;
  }
  if (e.ctrlKey && !e.altKey && !e.shiftKey && e.code === "KeyN") {
    e.preventDefault();
    if (!layer.querySelector(".dlg,.msg")) newTextDialog();
    return;
  }
  if (e.altKey && !e.ctrlKey && (e.key === "r" || e.key === "R" || e.code === "KeyR")) {
    e.preventDefault();
    if (!layer.querySelector(".dlg,.msg")) ACTS.see();
    return;
  }
  if (e.key !== "Escape") return;
  if (dropList.owner) { closeDrop(); return; }
  if (document.querySelector(".menubar .open")) closeMenus();
  else if (layer.querySelector(".msg")) { layer.querySelector(".msg").remove(); layerState(); }
  else if (layer.querySelector(".dlg")) closeDialog();
});

function setLang(l) {
  lang = l; store.set("lang", l);
  buildFrame();
  if (layer.querySelector(".dlg")) openDialog(curTab);
}

function setSkin(s) {
  skin = s; store.set("skin", s);
  document.documentElement.dataset.skin = s;
  document.getElementById("skin7").disabled = s !== "7";
  buildFrame();
  if (layer.querySelector(".dlg")) openDialog(curTab);
}

// ---- windows over the app: the dialog and message boxes, in the chosen skin

const layer = document.getElementById("layer");
function layerState() { layer.classList.toggle("on", !!layer.querySelector(".dlg,.msg")); }

// A click outside a modal window: Windows flashes the window (active / inactive a few times) and
// plays its default beep. The beep is made here with Web Audio (a short bell), not Windows' file.
layer.addEventListener("pointerdown", (e) => {
  if (e.target !== layer) return;
  e.preventDefault();
  const top = [...layer.querySelectorAll(".dlg,.msg")].pop();
  if (top) flash(top);
  ding();
});

function flash(w) {
  if (w.flashing) return;
  w.flashing = true;
  const win7 = w.querySelector(".window");
  let n = 0;
  const step = () => {
    const off = n % 2 === 0;
    if (win7) win7.classList.toggle("active", !off); else w.classList.toggle("inactive", off);
    if (++n < 8) setTimeout(step, 75); else w.flashing = false;
  };
  step();
}

let audio = null;
function ding() {
  try {
    audio ??= new AudioContext();
    const now = audio.currentTime;
    const out = audio.createGain();
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(0.22, now + 0.008);
    out.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    out.connect(audio.destination);
    for (const [f, g] of [[1318.5, 1], [2637, 0.25], [1975.5, 0.12]]) {
      const o = audio.createOscillator(), v = audio.createGain();
      o.type = "sine";
      o.frequency.value = f;
      v.gain.value = g;
      o.connect(v).connect(out);
      o.start(now);
      o.stop(now + 0.6);
    }
  } catch { /* no audio: the flash alone */ }
}

// returns [outer, body]: outer is placed and dragged, body takes the client area
function windowShell(caption, cls, onClose) {
  const dir = rtl() ? "rtl" : "ltr";
  if (skin === "7") {
    const outer = el("div", { class: "win7 " + cls, dir, role: "dialog", "aria-label": caption });
    const bar = el("div", { class: "title-bar" }, el("div", { class: "title-bar-text" }, caption),
      el("div", { class: "title-bar-controls" }, el("button", { "aria-label": "Close", onclick: onClose })));
    const body = el("div", { class: "window-body", style: { margin: 0, padding: 0 } });
    outer.append(el("div", { class: "window active", style: { margin: 0 } }, bar, body));
    draggable(outer, bar);
    return [outer, body];
  }
  const outer = el("div", { class: "w10 " + cls, dir, role: "dialog", "aria-label": caption });
  const bar = el("div", { class: "tb" }, el("span", { class: "tt" }, caption), el("button", { class: "x", "aria-label": "Close", onclick: onClose }));
  outer.append(bar);
  draggable(outer, bar);
  return [outer, outer];
}

function draggable(w, handle) {
  handle.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    const sx = e.clientX - w.offsetLeft, sy = e.clientY - w.offsetTop;
    handle.setPointerCapture(e.pointerId);
    const move = (m) => {
      w.style.left = Math.min(Math.max(m.clientX - sx, 60 - w.offsetWidth), innerWidth - 60) + "px";
      w.style.top = Math.min(Math.max(m.clientY - sy, 0), innerHeight - 30) + "px";
    };
    const up = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });
}

function center(w) {
  const z = parseFloat(w.style.zoom) || 1;
  const r = w.getBoundingClientRect();
  w.style.left = Math.max(0, (innerWidth - r.width) / 2) / z + "px";
  w.style.top = Math.max(0, (innerHeight - r.height) / 2.4) / z + "px";
}

function msgbox(text) {
  const close = () => { outer.remove(); layerState(); };
  const [outer, body] = windowShell("Tag PDF", "msg", close);
  outer.dir = rtl() ? "rtl" : "ltr";
  const ok = el("button", { class: "push default", onclick: close }, t("ok"));
  body.append(el("div", { class: "body" }, infoIcon(), el("div", {}, text)), el("div", { class: "buttons" }, ok));
  // Ctrl+C copies the box as Windows' message boxes do
  outer.addEventListener("keydown", (e) => {
    if (!e.ctrlKey || e.code !== "KeyC") return;
    e.preventDefault();
    const bar = "---------------------------";
    navigator.clipboard?.writeText([bar, "Tag PDF", bar, text, bar, t("ok"), bar, ""].join("\r\n")).catch(() => {});
  });
  layer.append(outer);
  layerState();
  center(outer);
  ok.focus();
}

// ---- File > PDF settings

// the dialog's About...: WINPDF.DLL's own: a Windows message box, Tag PDF, the
// information icon, the build and where the DLL and WINPDF.INI are (here the usual Tag folder)
function settingsAbout() {
  msgbox(rtl()
    ? "Tag PDF: מדפסת ה-PDF של תג\n\nגרסה: WINPDF " + CONFIG.version + "\n\nWINPDF.DLL: C:\\TAG\\WINPDF.DLL\nההגדרות: C:\\TAG\\WINPDF.INI"
    : "Tag PDF: the PDF printer for Tag\n\nVersion: WINPDF " + CONFIG.version + "\n\nWINPDF.DLL: C:\\TAG\\WINPDF.DLL\nSettings: C:\\TAG\\WINPDF.INI");
}

let curTab = 0;
let dirty = false;
const wired = new Set(D.wired);
const isWired = (id) => wired.has(id & ~UPDOWN);

function closeDialog() { layer.querySelector(".dlg")?.remove(); hideTip(); layerState(); }

function openDialog(tab = 0) {
  closeDialog();
  curTab = tab;
  dirty = false;
  const dlg = D[lang];
  const [outer, body] = windowShell(dlg.caption, "dlg", closeDialog);
  const client = el("div", { class: "client", style: { width: dlg.size[0] + "px", height: dlg.size[1] + "px" } });
  body.append(client);
  const pages = D.tabs.map(() => el("div", { class: "pg", hidden: true }));
  const byId = new Map();
  groupNo = 0;

  for (const c of dlg.controls) {
    const [l, tp, r, b] = c.rect;
    const box = { left: l + "px", top: tp + "px", width: (r - l) + "px", height: (b - tp) + "px" };
    const node = control(c, box);
    if (!node) continue;
    (c.tab < 0 ? client : pages[c.tab]).append(node);
    if (c.id > 0 && node.nodeType === 1) byId.set(c.id, node);
    const tip = D.tips[c.id & ~UPDOWN];
    const mock = c.id > 0 && !isWired(c.id);
    if (node.nodeType === 1 && (tip || mock)) {
      const text = (tip ? tip[rtl() ? 1 : 0] : "") + (mock ? (tip ? "\n" : "") + D.notYet[rtl() ? 1 : 0] : "");
      node.addEventListener("mouseenter", (e) => showTip(text, e));
      node.addEventListener("mousemove", moveTip);
      node.addEventListener("mouseleave", hideTip);
    }
  }
  client.append(...pages);
  layer.append(outer);

  outer.byId = byId;
  outer.pages = pages;
  selectTab(outer, tab);
  update(outer);
  client.addEventListener("input", () => { dirty = true; update(outer); });
  client.addEventListener("change", () => { dirty = true; update(outer); });

  // a phone: the dialog is drawn smaller rather than cut off
  const fit = Math.min(1, (innerWidth - 8) / (dlg.size[0] + 10));
  outer.style.zoom = fit < 1 ? String(fit) : "";
  layerState();
  center(outer);
  outer.querySelector(".client button:not(:disabled), .client input:not(:disabled)")?.focus({ preventScroll: true });
}

function control(c, box) {
  const id = "c" + c.id + "_" + c.tab + "_" + c.rect.join("_");
  const style = c.style >>> 0;
  const on = c.enabled;
  const wrap = (kid) => { const d = el("div", { class: "c", style: box, "data-id": c.id }); d.append(kid); return d; };
  switch (c.class) {
    case "SysTabControl32": {
      const [l, tp, r, b] = c.rect;
      const strip = el("menu", { class: "tabstrip", role: "tablist", style: { left: l + "px", top: tp + "px", width: (r - l) + "px" } },
        ...D.tabs.map((n, i) => el("button", { role: "tab", "aria-selected": "false", "data-tab": i, type: "button" }, n[rtl() ? 1 : 0])));
      strip.addEventListener("click", (e) => {
        const tabEl = e.target.closest("[data-tab]");
        if (tabEl) selectTab(strip.closest(".dlg"), +tabEl.dataset.tab);
      });
      const head = 23;
      const frag = document.createDocumentFragment();
      frag.append(el("div", { class: "tabbox", role: "tabpanel", style: { left: l + "px", top: (tp + head) + "px", width: (r - l) + "px", height: (b - tp - head) + "px" } }), strip);
      return frag;
    }
    case "Button": {
      const kind = style & 0xF;
      if (kind === 7) return el("fieldset", { class: "group", style: box }, el("legend", { class: on ? "" : "dis" }, plain(c.text)));
      if (kind === 2 || kind === 3 || kind === 4 || kind === 9) {
        const radio = kind === 4 || kind === 9;
        const input = el("input", { type: radio ? "radio" : "checkbox", id, disabled: !on, checked: !!c.checked,
          name: radio ? "r" + c.tab + "_" + radioGroup(c) : false });
        return wrap(el("div", { class: "check" + (on ? "" : " dis") }, input, el("label", { for: id }, mnemonic(c.text))));
      }
      const b = el("button", { class: "push full" + (kind === 1 ? " default" : ""), disabled: !on, type: "button" }, mnemonic(c.text));
      b.addEventListener("click", () => press(c.id));
      return wrap(b);
    }
    case "Static": {
      const align = (style & 3) === 1 ? "center" : (style & 3) === 2 ? "end" : "start";
      const s = el("div", { class: "c static" + (on ? "" : " dis"), style: { ...box, textAlign: align }, "data-id": c.id });
      s.append(style & 0x80 ? c.text : mnemonic(c.text));
      return s;
    }
    case "Edit": {
      const i = el("input", { class: "full", type: style & 0x20 ? "password" : "text", disabled: !on, readonly: !!(style & 0x800), spellcheck: "false", "aria-label": c.text || String(c.id) });
      i.value = c.text;
      return wrap(i);
    }
    case "ComboBox": {
      const s = el("select", { class: "full", disabled: !on }, ...c.items.map((x, i) => el("option", { value: i }, x)));
      s.selectedIndex = c.sel;
      return wrap(s);
    }
    case "msctls_updown32": {
      const step = (d) => {
        const ed = layer.querySelector(`.dlg [data-id="${c.id & ~UPDOWN}"] input`);
        if (!ed || ed.disabled) return;
        ed.value = String(Math.max(0, (parseInt(ed.value, 10) || 0) + d));
        ed.dispatchEvent(new Event("input", { bubbles: true }));
      };
      return wrap(el("div", { class: "updown" },
        el("button", { type: "button", tabindex: "-1", disabled: !on, "aria-label": "+", onclick: () => step(1) }, "\u25B2"),
        el("button", { type: "button", tabindex: "-1", disabled: !on, "aria-label": "-", onclick: () => step(-1) }, "\u25BC")));
    }
    case "msctls_trackbar32":
      return wrap(el("input", { type: "range", min: 10, max: 100, value: c.pos ?? 85, disabled: !on, "aria-label": "Quality" }));
  }
  return null;
}

// a radio group starts at a WS_GROUP radio; the following radios of the page belong to it
let groupNo = 0;
function radioGroup(c) { if (c.style & 0x20000) groupNo++; return groupNo; }

function selectTab(w, i) {
  curTab = i;
  w.pages.forEach((p, n) => { p.hidden = n !== i; });
  for (const b of w.querySelectorAll("[data-tab]")) b.setAttribute("aria-selected", String(+b.dataset.tab === i));
  hideTip();
}

function press(id) {
  const w = layer.querySelector(".dlg");
  switch (id) {
    case 1: if (dirty) msgbox(t("saved")); closeDialog(); break;
    case 2: closeDialog(); break;
    case 1007: dirty = false; msgbox(t("saved")); update(w); break;
    case 1005: settingsAbout(); break;
    case 1006: openDialog(curTab); break;
    default: msgbox(t("notHere"));
  }
}

// What WINPDF.DLL's dialog enables, for the controls that work; mock-ups stay greyed.
function update(w) {
  const q = (id) => w.byId.get(id)?.querySelector("input,select,button");
  const sel = (id) => q(id)?.selectedIndex ?? -1;
  const checked = (id) => !!q(id)?.checked;
  const enable = (id, on) => {
    on = on && isWired(id);
    for (const k of [id, id | UPDOWN]) {
      const n = w.byId.get(k);
      if (!n) continue;
      for (const f of n.querySelectorAll("input,select,button")) f.disabled = !on;
      n.querySelector(".check")?.classList.toggle("dis", !on);
    }
  };
  enable(105, sel(104) === 1);
  enable(106, sel(104) === 1);
  enable(115, checked(113));
  enable(116, checked(113));
  enable(111, sel(110) !== 1 || !checked(103));
  enable(202, checked(201));
  enable(408, checked(407));
  enable(807, checked(806));
  enable(1007, dirty);
}

// ---- tooltips (Windows shows them after a moment, under the pointer)

const tipEl = document.getElementById("tip");
let tipTimer = 0, tipXY = [0, 0];
function showTip(text, e) {
  moveTip(e);
  clearTimeout(tipTimer);
  tipTimer = setTimeout(() => {
    tipEl.textContent = text;
    tipEl.dir = rtl() ? "rtl" : "ltr";
    tipEl.hidden = false;
    const r = tipEl.getBoundingClientRect();
    tipEl.style.left = Math.max(4, Math.min(tipXY[0], innerWidth - r.width - 4)) + "px";
    tipEl.style.top = (tipXY[1] + 20 + r.height > innerHeight ? tipXY[1] - r.height - 4 : tipXY[1] + 20) + "px";
  }, 450);
}
function moveTip(e) { tipXY = [e.clientX, e.clientY]; }
function hideTip() { clearTimeout(tipTimer); tipEl.hidden = true; }

// ---- start

setSkin(skin);
if (location.hash === "#settings") openDialog();

// `#measure` (for tests, headless): every label of the dialog that doesn't fit its control, in
// both languages and skins, as JSON in <pre id="measure">. Nothing is remembered.
if (location.hash === "#measure") {
  store.set = () => {};
  const out = [];
  for (const s of ["10", "7"]) for (const l of ["en", "he"]) {
    skin = s; lang = l;
    document.documentElement.dataset.skin = s;
    document.getElementById("skin7").disabled = s !== "7";
    openDialog();
    const w = layer.querySelector(".dlg");
    w.pages.forEach((p, i) => {
      selectTab(w, i);
      for (const n of w.querySelectorAll(".client label, .client .static, .client button.push, .client legend")) {
        if (!n.offsetParent) continue;
        if (n.scrollWidth > n.clientWidth + 1 || n.scrollHeight > n.clientHeight + 2)
          out.push({ skin: s, lang: l, tab: i, text: n.textContent, need: [n.scrollWidth, n.scrollHeight], have: [n.clientWidth, n.clientHeight] });
      }
    });
    const strip = w.querySelector(".tabstrip");
    if (strip.scrollWidth > strip.clientWidth + 1) out.push({ skin: s, lang: l, tabs: [strip.scrollWidth, strip.clientWidth] });
  }
  // a message box over the dialog (About) must be on top of it
  msgbox("z-order");
  const m = layer.querySelector(".msg").getBoundingClientRect();
  if (!document.elementFromPoint(m.left + m.width / 2, m.top + m.height / 2)?.closest(".msg")) out.push({ zorder: "message box under the dialog" });
  layer.querySelector(".msg").remove();
  closeDialog();
  // the command line: msg's values and errors as Tag's, the history (the last run first, no repeats)
  const lastMsg = () => { const m = [...layer.querySelectorAll(".tagmsg")].pop(); const txt = m?.querySelector(".text")?.textContent; m?.remove(); return txt; };
  for (const [cmdline, want] of [["msg 7/2", "3.5"], ["msg 7 div 2", "3"], ["msg 7 mod 3", "1"], ['msg "a" + "b"', "ab"], ["msg 1+2*3", "7"],
    ['msg "a" + 3', "Invalid arithmetic operation."], ["msg 1/0", "Divide by zero error."], ["foo", "Global symbol foo does not exist."],
    ['msg "^Cab^! cd^!zz"', "ab cdzz"], ["msg 1cm", "28.450001"]]) {
    runCommand(cmdline);
    const got = lastMsg();
    if (want !== null && got !== want) out.push({ cmd: cmdline, want, got });
  }
  runCommand("msg 1+2*3");
  lastMsg();
  if (cmdHistory[0] !== "msg 1+2*3" || cmdHistory.filter((h) => h === "msg 1+2*3").length !== 1) out.push({ history: cmdHistory.slice(0, 3) });
  // New text's command makes a second, active, editable window; Print setup shows Tag PDF; About
  runCommand('new tx "probe" visible eng', false);
  if (kids.length !== 2 || active?.title !== "probe" || active.doc.contentEditable !== "true") out.push({ newText: kids.map((k) => k.title) });
  if (document.querySelectorAll("#menubar .top")[8].querySelectorAll(".pull button").length !== 2) out.push({ windowMenu: "not 2 items" });
  mdiClose(active);
  printSetupDialog();
  const ps = layer.querySelector(".printsetup");
  if (ps?.querySelector("select")?.value !== "0" || !ps.textContent.includes("TAGPDF:")) out.push({ printSetup: ps?.textContent.slice(0, 80) });
  ps?.remove();
  aboutBox();
  if (!layer.querySelector(".tagabout")?.textContent.includes(CONFIG.version)) out.push({ about: "no version" });
  layer.querySelector(".tagabout")?.remove();
  // the settings dialog's About... is WINPDF.DLL's own box, not Help > About
  openDialog();
  press(1005);
  const da = [...layer.querySelectorAll(".msg")].pop();
  if (!da || da.classList.contains("tagabout") || !da.textContent.includes("WINPDF.DLL: C:\\TAG\\WINPDF.DLL"))out.push({ dialogAbout: da?.textContent.slice(0, 60) });
  da?.remove();
  closeDialog();
  layerState();
  // dragging a child by its caption moves it and never changes its size (both languages)
  for (const l of ["en", "he"]) {
    lang = l; buildFrame();
    const c = active, before = [c.el.offsetWidth, c.el.offsetHeight, c.el.offsetLeft, c.el.offsetTop];
    const at = c.cap.getBoundingClientRect();
    const pe = (type, x, y) => c.cap.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    pe("pointerdown", at.left + 100, at.top + 8);
    pe("pointermove", at.left + 150, at.top + 38);
    pe("pointerup", at.left + 150, at.top + 38);
    const after = [c.el.offsetWidth, c.el.offsetHeight, c.el.offsetLeft, c.el.offsetTop];
    if (after[0] !== before[0] || after[1] !== before[1] || after[2] !== before[2] + 50 || after[3] !== before[3] + 30) out.push({ drag: l, before, after });
  }
  // the frontmost text stays the active one when the focus goes elsewhere: the caret on a later
  // line, the focus in the command line, three clicks on the status bar: Line is still that line
  (async () => {
    const tick = () => new Promise((r) => setTimeout(r, 30));
    statusMode = 0;
    const p3 = active.doc.querySelectorAll("p")[2];
    active.doc.focus();
    getSelection().collapse(p3.firstChild, 1);
    await tick();
    const line = document.getElementById("fields").textContent;
    document.getElementById("cmd").focus();
    await tick();
    for (let i = 0; i < 3; i++) { document.getElementById("status").click(); await tick(); }
    const after = document.getElementById("fields").textContent;
    if (after !== line || statusMode !== 0) out.push({ focusLost: [line, after, statusMode] });
    document.body.append(el("pre", { id: "measure" }, JSON.stringify(out)));
  })();
}
