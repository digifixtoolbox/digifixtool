import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const clear = () => setText("");

  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border-light)",borderRadius:20,padding:32}}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        style={{width:"100%",minHeight:280,border:"1px solid var(--border-light)",borderRadius:14,padding:20,fontSize:16,fontFamily:"inherit",color:"var(--text)",background:"var(--surface-2)",resize:"vertical",outline:"none",lineHeight:1.6,boxSizing:"border-box"}}
      />

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:12,marginTop:20}}>
        {[
          { label: "Words", value: words },
          { label: "Characters", value: chars },
          { label: "No Spaces", value: charsNoSpaces },
          { label: "Sentences", value: sentences },
          { label: "Paragraphs", value: paragraphs },
          { label: "Read Time", value: readTime + " min" },
        ].map((stat) => (
          <div key={stat.label} style={{background:"var(--surface-2)",border:"1px solid var(--border-light)",borderRadius:12,padding:"16px 20px"}}>
            <p style={{fontSize:28,fontWeight:800,color:"var(--text)",margin:0}}>{stat.value}</p>
            <p style={{fontSize:13,color:"var(--text-muted)",margin:0,marginTop:4}}>{stat.label}</p>
          </div>
        ))}
      </div>

      {text && (
        <button onClick={clear}
          style={{marginTop:20,background:"var(--surface)",border:"1px solid var(--border-light)",padding:"12px 24px",borderRadius:999,fontWeight:600,fontSize:14,cursor:"pointer",color:"var(--text)",fontFamily:"inherit"}}>
          Clear text
        </button>
      )}
    </div>
  );
}
