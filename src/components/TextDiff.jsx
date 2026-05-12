import React, { useState } from 'react';

export default function TextDiff() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  const maxLines = Math.max(oldLines.length, newLines.length);

  return (
    <div className="tool-box">
      <div className="diff-grid">
        <div>
          <label>Original Text</label>
          <textarea
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="Paste original text here..."
          />
        </div>

        <div>
          <label>New Text</label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Paste new text here..."
          />
        </div>
      </div>

      <div className="results">
        <h3>Differences</h3>

        {Array.from({ length: maxLines }).map((_, index) => {
          const oldLine = oldLines[index] || '';
          const newLine = newLines[index] || '';
          const changed = oldLine !== newLine;

          return (
            <div key={index} className={changed ? 'line changed' : 'line'}>
              <span className="line-number">{index + 1}</span>
              <div>
                {changed ? (
                  <>
                    <p className="removed">- {oldLine || 'Empty line'}</p>
                    <p className="added">+ {newLine || 'Empty line'}</p>
                  </>
                ) : (
                  <p>{oldLine}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}