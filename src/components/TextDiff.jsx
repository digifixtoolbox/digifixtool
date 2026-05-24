import React, { useState } from 'react';

const S = {
  box: {
    background: 'var(--surface)',
    borderRadius: '20px',
    border: '1px solid var(--border-light)',
    padding: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '8px',
    letterSpacing: '0.01em',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '12px 14px',
    fontSize: '13px',
    fontFamily: "'SF Mono', 'Fira Mono', 'Fira Code', monospace",
    lineHeight: '1.6',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    background: 'var(--surface-2)',
    color: 'var(--text)',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  results: {
    marginTop: '24px',
  },
  heading: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text)',
    marginBottom: '12px',
  },
  lineBase: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '4px 0',
    borderBottom: '1px solid var(--border-light)',
  },
  lineNumber: {
    flexShrink: 0,
    width: '32px',
    textAlign: 'right',
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontFamily: "monospace",
    paddingTop: '2px',
    userSelect: 'none',
  },
  lineContent: {
    flex: 1,
    minWidth: 0,
  },
  removed: {
    margin: '1px 0',
    padding: '2px 8px',
    borderRadius: '4px',
    background: '#fff0f0',
    color: '#c0392b',
    fontSize: '13px',
    fontFamily: "monospace",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  added: {
    margin: '1px 0',
    padding: '2px 8px',
    borderRadius: '4px',
    background: '#f0fff4',
    color: '#1d8348',
    fontSize: '13px',
    fontFamily: "monospace",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  unchanged: {
    margin: '1px 0',
    padding: '2px 8px',
    fontSize: '13px',
    fontFamily: "monospace",
    color: 'var(--text)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  empty: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '32px 0',
  },
};

export default function TextDiff() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  const maxLines = Math.max(oldLines.length, newLines.length);
  const hasInput = oldText.length > 0 || newText.length > 0;

  return (
    <div style={S.box}>
      <div style={S.grid}>
        <div>
          <label htmlFor="diff-old" style={S.label}>Original Text</label>
          <textarea
            id="diff-old"
            style={S.textarea}
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="Paste original text here..."
          />
        </div>

        <div>
          <label htmlFor="diff-new" style={S.label}>New Text</label>
          <textarea
            id="diff-new"
            style={S.textarea}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Paste new text here..."
          />
        </div>
      </div>

      <div style={S.results}>
        <h3 style={S.heading}>Differences</h3>

        {!hasInput && (
          <p style={S.empty}>Paste text in both panels above to see differences.</p>
        )}

        {hasInput && Array.from({ length: maxLines }).map((_, index) => {
          const oldLine = oldLines[index] || '';
          const newLine = newLines[index] || '';
          const changed = oldLine !== newLine;

          return (
            <div key={index} style={S.lineBase}>
              <span style={S.lineNumber}>{index + 1}</span>
              <div style={S.lineContent}>
                {changed ? (
                  <>
                    <p style={S.removed}>− {oldLine || '(empty line)'}</p>
                    <p style={S.added}>+ {newLine || '(empty line)'}</p>
                  </>
                ) : (
                  <p style={S.unchanged}>{oldLine}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}