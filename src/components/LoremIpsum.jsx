import { useState } from "react";

const LOREM_WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim",
  "ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip",
  "ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate",
  "velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat",
  "cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim",
  "id","est","laborum","praesent","varius","interdum","ligula","volutpat","cursus","nunc",
  "convallis","egestas","tincidunt","condimentum","finibus","accumsan","maximus","sodales",
  "feugiat","ornare","posuere","pellentesque","sapien","euismod","fringilla","pharetra"
];

const OPENING = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function rnd(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function word() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function sentence() {
  const len = rnd(8, 18);
  const words = Array.from({ length: len }, word);
  const w0 = words[0];
  words[0] = w0.charAt(0).toUpperCase() + w0.slice(1);
  return words.join(" ") + ".";
}

function paragraph() {
  return Array.from({ length: rnd(3, 6) }, sentence).join(" ");
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    const paras = [OPENING];
    for (let i = 1; i < count; i++) paras.push(paragraph());
    setOutput(paras.join("\n\n"));
    setCopied(false);
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(function () {
      setCopied(true);
      setTimeout(function () { setCopied(false); }, 2000);
    });
  }

  const paragraphList = output ? output.split("\n\n") : [];

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: 20, padding: 32, fontFamily: "inherit" }}>
      <div style={{ background: "var(--surface-2)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <label style={{ fontWeight: "600", fontSize: "15px", color: "var(--text)" }}>Number of paragraphs</label>
          <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--upload-btn-bg)" }}>{count}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={count}
          onChange={function (e) { setCount(Number(e.target.value)); }}
          style={{ width: "100%", accentColor: "var(--upload-btn-bg)", marginBottom: "6px", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
          <span>1</span><span>10</span>
        </div>
      </div>

      <button
        onClick={generate}
        style={{ width: "100%", background: "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "18px", fontSize: "17px", fontWeight: "700", cursor: "pointer", marginBottom: "20px", minHeight: "56px", fontFamily: "inherit" }}
      >
        Generate Lorem Ipsum
      </button>

      {output && (
        <div style={{ background: "var(--surface-2)", borderRadius: "16px", padding: "24px" }}>
          {paragraphList.map(function (para, i) {
            return (
              <p key={i} style={{ fontSize: "15px", lineHeight: "1.75", color: "var(--text)", marginBottom: i < paragraphList.length - 1 ? "16px" : "0" }}>
                {para}
              </p>
            );
          })}
          <button
            onClick={copy}
            style={{ marginTop: "20px", background: copied ? "#16a34a" : "var(--upload-btn-bg)", color: "var(--upload-btn-color)", border: "none", borderRadius: "99px", padding: "12px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", minHeight: "44px", transition: "background 0.15s", fontFamily: "inherit" }}
          >
            {copied ? "Copied!" : "Copy all text"}
          </button>
        </div>
      )}
    </div>
  );
}
