import { useState } from "react";

export default function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const getDiff = () => {
    if (!text1 || !text2) return null;
    
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result = [];
    const maxLen = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLen; i++) {
      const l1 = lines1[i] ?? null;
      const l2 = lines2[i] ?? null;

      if (l1 === l2) {
        result.push({ type: "same", text: l1, line: i + 1 });
      } else if (l1 === null) {
        result.push({ type: "added", text: l2, line: i + 1 });
      } else if (l2 === null) {
        result.push({ type: "removed", text: l1, line: i + 1 });
      } else {
        result.push({ type: "removed", text: l1, line: i + 1 });
        result.push({ type: "added", text: l2, line: i + 1 });
      }
    }
    return result;
  };

  const diff = getDiff();
  const changes = diff ? diff.filter(d => d.type !== "same").length : 0;

  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:20,padding:32}}>
      
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <div>
          <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>
            Original Text
          </label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Paste your original text here..."
            style={{width:"100%",height:220,border:"1px solid #d1d5db",borderRadius:12,padding:"12px 16px",fontSize:14,fontFamily:"monospace",color:"#111827",resize:"vertical",outline:"none",lineHeight:1.6,boxSizing:"border-box"}}
          />
        </div>
        <div>
          <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>
            Modified Text
          </label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Paste your modified text here..."
            style={{width:"100%",height:220,border:"1px solid #d1d5db",borderRadius:12,padding:"12px 16px",fontSize:14,fontFamily:"monospace",color:"#111827",resize:"vertical",outline:"none",lineHeight:1.6,boxSizing:"border-box"}}
          />
        </div>
      </div>

      {diff && (
        <>
          <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:10,padding:"8px 16px",fontSize:14,fontWeight:600,color:"#166534"}}>
              + {diff.filter(d => d.type === "added").length} added
            </div>
            <div style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:10,padding:"8px 16px",fontSize:14,fontWeight:600,color:"#991b1b"}}>
              - {diff.filter(d => d.type === "removed").length} removed
            </div>
            <div style={{background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:10,padding:"8px 16px",fontSize:14,fontWeight:600,color:"#374151"}}>
              {diff.filter(d => d.type === "same").length} unchanged
            </div>
          </div>

          {changes === 0 ? (
            <div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:14,padding:24,textAlign:"center"}}>
              <p style={{fontSize:16,fontWeight:700,color:"#166534"}}>✓ No differences found. The texts are identical.</p>
            </div>
          ) : (
            <div style={{border:"1px solid #e5e7eb",borderRadius:14,overflow:"hidden",fontFamily:"monospace",fontSize:13}}>
              {diff.map((line, i) => (
                <div key={i} style={{
                  display:"flex",
                  background: line.type === "added" ? "#f0fdf4" : line.type === "removed" ? "#fef2f2" : "#fff",
                  borderBottom:"1px solid #f3f4f6",
                }}>
                  <div style={{
                    width:40,
                    minWidth:40,
                    padding:"8px 12px",
                    fontSize:11,
                    color:"#9ca3af",
                    background: line.type === "added" ? "#dcfce7" : line.type === "removed" ? "#fee2e2" : "#f9fafb",
                    textAlign:"center",
                    userSelect:"none",
                  }}>
                    {line.line}
                  </div>
                  <div style={{
                    width:24,
                    minWidth:24,
                    padding:"8px 4px",
                    textAlign:"center",
                    fontWeight:700,
                    color: line.type === "added" ? "#16a34a" : line.type === "removed" ? "#dc2626" : "#d1d5db",
                  }}>
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </div>
                  <div style={{padding:"8px 12px",flex:1,color: line.type === "added" ? "#166534" : line.type === "removed" ? "#991b1b" : "#374151",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!text1 && !text2 && (
        <div style={{background:"#f9fafb",border:"1px dashed #d1d5db",borderRadius:14,padding:32,textAlign:"center",color:"#9ca3af"}}>
          <p style={{fontSize:15}}>Paste two texts above to compare them</p>
        </div>
      )}

      <div style={{marginTop:24,fontSize:13,color:"#6b7280",textAlign:"center"}}>
        🔒 Your text never leaves your device.
      </div>
    </div>
  );
}