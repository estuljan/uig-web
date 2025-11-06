import { useEffect, useMemo, useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch('https://api.uig.me/api/v1/words')
      .then((response) => response.json())
      .then((data) => {
        setWords(data);
      })
      .catch((error) => {
        console.error('Failed to fetch words:', error);
      });
  }, []);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return words;
    }

    return words.filter((entry) => {
      const uyghur = entry.word_uyghur.toLowerCase();
      const english = entry.word_english.toLowerCase();
      return (
        uyghur.includes(normalizedQuery) ||
        english.includes(normalizedQuery)
      );
    });
  }, [query, words]);

  return (
    <div className="App">
      <main className="dictionary">
        <h1 className="title">Uyghur Dictionary</h1>
        <input
          type="text"
          className="search"
          placeholder="Search by Uyghur or English word"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
        <ul className="results" aria-live="polite">
          {filteredEntries.length === 0 ? (
            <li className="empty">No matches found.</li>
          ) : (
            filteredEntries.map((entry) => (
              <li key={entry.id} className="entry">
                <div className="entry-word uyghur">{entry.word_uyghur}</div>
                <div className="entry-word english">{entry.word_english}</div>
                <div className="entry-word turkish">{entry.word_turkish}</div>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
