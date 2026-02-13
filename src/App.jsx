import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [fixedInput, setFixedInput] = useState('');
  const [filterInfo, setFilterInfo] = useState('');
  const [history, setHistory] = useState([]);

  const greetings = [
    '오늘은 느낌이 좋아 ✨',
    '소은이가 골라줄게 🎀',
    '왠지 당첨 예감 🎯',
    '윤재만 바라보는 중 🥺'
  ];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  useEffect(() => {
    const saved = localStorage.getItem('lotto_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('lotto_history', JSON.stringify(history));
  }, [history]);

  const isValidCombination = (numbers) => {
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const oddCount = numbers.filter(n => n % 2 !== 0).length;
    const lowCount = numbers.filter(n => n <= 22).length;
    const hasTripleSequence = numbers.some((_, i, arr) =>
      i < 4 && arr[i] + 1 === arr[i + 1] && arr[i + 1] + 1 === arr[i + 2]
    );
    return (
      sum >= 100 && sum <= 170 &&
      [2, 3, 4].includes(oddCount) &&
      [2, 3, 4].includes(lowCount) &&
      !hasTripleSequence
    );
  };

  const generateLottoNumbers = () => {
    const fixed = fixedInput
      .split(',')
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 45);

    if (fixed.length > 5) {
      alert('고정 숫자는 최대 5개까지만 입력할 수 있어요.');
      return;
    }

    let combination;
    while (true) {
      const temp = new Set(fixed);
      while (temp.size < 6) {
        temp.add(Math.floor(Math.random() * 45) + 1);
      }
      combination = Array.from(temp).sort((a, b) => a - b);
      if (isValidCombination(combination)) break;
    }

    setNumbers(combination);
    setFilterInfo(`🔍 조건: 합계 100~170, 홀짝 2~4, 저고 2~4, 3연번 제외${fixed.length ? ` | 고정: ${fixed.join(', ')}` : ''}`);
    setHistory([combination, ...history]);
  };

  const deleteFromHistory = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem('lotto_history', JSON.stringify(newHistory));
  };

  return (
    <div className="App" style={{ padding: '30px', textAlign: 'center' }}>
      <h1 style={{ color: '#2f3542' }}>🎯 소은 로또 번호 생성기</h1>
      <p style={{ marginBottom: '10px', color: '#555' }}>안녕 윤재야 😊 {randomGreeting}</p>

      <input
        type="text"
        placeholder="고정 숫자 입력 (예: 7, 12)"
        value={fixedInput}
        onChange={(e) => setFixedInput(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', width: '260px', border: '1px solid #ccc', borderRadius: '6px' }}
      />

      <br />
      <button
        onClick={generateLottoNumbers}
        style={{ marginTop: '12px', padding: '10px 18px', fontSize: '16px', borderRadius: '6px', border: 'none', backgroundColor: '#ff6b81', color: '#fff', cursor: 'pointer' }}
      >
        번호 뽑기
      </button>

      {numbers.length > 0 && (
        <>
          <div className="result-numbers" style={{ marginTop: '24px' }}>
            {numbers.map((num, idx) => (
              <span
                key={idx}
                style={{ display: 'inline-block', backgroundColor: '#fff', border: '2px solid #ffa502', borderRadius: '50%', width: '44px', height: '44px', lineHeight: '42px', fontSize: '18px', fontWeight: 'bold', color: '#2f3542', margin: '0 6px' }}
              >
                {num}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '12px', color: '#57606f', fontSize: '14px' }}>{filterInfo}</div>
        </>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '36px', textAlign: 'left' }}>
          <h3 style={{ color: '#2f3542' }}>📋 최근 추첨 번호</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {history.map((set, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>
                {set.join(', ')}
                <button onClick={() => deleteFromHistory(idx)} style={{ marginLeft: '10px', color: '#ff4757', background: 'none', border: 'none', cursor: 'pointer' }}>
                  ❌ 삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
