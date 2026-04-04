import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [fixedInput, setFixedInput] = useState('');
  const [filterInfo, setFilterInfo] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('lotto_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('lotto_history', JSON.stringify(history));
  }, [history]);

  // 🔥 고해상도 랜덤
  const random = () => {
    const seed = crypto.getRandomValues(new Uint32Array(1))[0];
    return seed / 4294967295;
  };

  // 🔥 필터 리스트 (v2.2 일부 포함)
  const filterList = [
    {
      name: "합계 90~180",
      check: (nums) => {
        const sum = nums.reduce((a, b) => a + b, 0);
        return sum >= 90 && sum <= 180;
      }
    },
    {
      name: "홀짝 2~4",
      check: (nums) => {
        const odd = nums.filter(n => n % 2 !== 0).length;
        return [2,3,4].includes(odd);
      }
    },
    {
      name: "저고 2~4",
      check: (nums) => {
        const low = nums.filter(n => n <= 22).length;
        return [2,3,4].includes(low);
      }
    },
    {
      name: "끝수 중복 최대 2개",
      check: (nums) => {
        const endings = nums.map(n => n % 10);
        const count = {};
        endings.forEach(e => count[e] = (count[e] || 0) + 1);
        return Object.values(count).every(v => v <= 2);
      }
    },
    {
      name: "중복 조합 방지",
      check: (nums) => {
        const key = nums.join(',');
        return !history.some(h => h.join(',') === key);
      }
    },

    // 🔥 v2.2 강화 필터들
    {
      name: "1등 모드: 끝수 3개 허용",
      check: (nums) => {
        const endings = nums.map(n => n % 10);
        const count = {};
        endings.forEach(e => count[e] = (count[e] || 0) + 1);
        return Object.values(count).every(v => v <= 3);
      }
    },
    {
      name: "1등 모드: 3연번만 제한",
      check: (nums) => {
        return !nums.some((_, i, arr) =>
          i < 4 &&
          arr[i] + 1 === arr[i + 1] &&
          arr[i + 1] + 1 === arr[i + 2] &&
          arr[i + 2] + 1 === arr[i + 3]
        );
      }
    },
    {
      name: "1등 모드: 고저 1:5 허용",
      check: (nums) => {
        const low = nums.filter(n => n <= 22).length;
        return low >= 1 && low <= 5;
      }
    }
  ];

  // 🔥 랜덤 필터 선택
  const pickRandomFilters = () => {
    const shuffled = [...filterList].sort(() => random() - 0.5);
    const count = random() > 0.5 ? 3 : 4;
    return shuffled.slice(0, count);
  };

  const generateLottoNumbers = () => {
    const fixed = fixedInput
      .split(',')
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 45);

    if (fixed.length > 5) {
      alert('고정 숫자는 최대 5개까지 가능합니다.');
      return;
    }

    const activeFilters = pickRandomFilters();

    let combination;
    let attempt = 0;

    while (true) {
      attempt++;
      if (attempt > 5000) {
        alert("조건이 너무 강합니다. 다시 시도하세요.");
        return;
      }

      const temp = new Set(fixed);
      while (temp.size < 6) {
        temp.add(Math.floor(random() * 45) + 1);
      }

      combination = Array.from(temp).sort((a, b) => a - b);

      if (activeFilters.every(f => f.check(combination))) break;
    }

    setNumbers(combination);
    setFilterInfo(
      "🔍 적용 필터: " +
      activeFilters.map(f => f.name).join(", ")
    );

    setHistory([combination, ...history]);
  };

  const deleteFromHistory = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
  };

  return (
    <div className="App" style={{ padding: '30px', textAlign: 'center' }}>
      <h1>🎯 소은 로또 번호 생성기 v2.2</h1>

      <input
        type="text"
        placeholder="고정 숫자 입력 (예: 7,12)"
        value={fixedInput}
        onChange={(e) => setFixedInput(e.target.value)}
      />

      <br />
      <button onClick={generateLottoNumbers}>
        번호 뽑기
      </button>

      {numbers.length > 0 && (
        <>
          <div style={{ marginTop: '20px' }}>
            {numbers.join(' , ')}
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            {filterInfo}
          </div>
        </>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3>📋 최근 추첨 번호</h3>
          <ul>
            {history.map((set, idx) => (
              <li key={idx}>
                {set.join(', ')}
                <button onClick={() => deleteFromHistory(idx)}> ❌</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
