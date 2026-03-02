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

  // 🔥 10개 필터
  const filterList = [
    {
      name: "합계 100~170",
      check: (nums) => {
        const sum = nums.reduce((a, b) => a + b, 0);
        return sum >= 100 && sum <= 170;
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
      name: "3연번 제외",
      check: (nums) => {
        return !nums.some((_, i, arr) =>
          i < 4 &&
          arr[i] + 1 === arr[i + 1] &&
          arr[i + 1] + 1 === arr[i + 2]
        );
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
      name: "30번대 최대 3개",
      check: (nums) => nums.filter(n => n >= 30 && n <= 39).length <= 3
    },
    {
      name: "연번 2개 이하",
      check: (nums) => {
        let count = 0;
        for (let i = 0; i < 5; i++) {
          if (nums[i] + 1 === nums[i+1]) count++;
        }
        return count <= 2;
      }
    },
    {
      name: "1번~10번 최소 1개",
      check: (nums) => nums.some(n => n <= 10)
    },
    {
      name: "40번대 최대 2개",
      check: (nums) => nums.filter(n => n >= 40).length <= 2
    },
    {
      name: "중복 조합 방지",
      check: (nums) => {
        const key = nums.join(',');
        return !history.some(h => h.join(',') === key);
      }
    }
  ];

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
      <h1>🎯 소은 로또 번호 생성기 v2.1</h1>

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
