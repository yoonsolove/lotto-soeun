import { useState } from "react";
import "./App.css";

function App() {
  const [numbers, setNumbers] = useState([]);
  const [fixedInput, setFixedInput] = useState("");
  const [recent, setRecent] = useState([]);
  const [filterInfo, setFilterInfo] = useState("");
  const [soEunComment, setSoEunComment] = useState("");

  const comments = [
    "오늘은 느낌이 좋아 ✨ 우리 운이 움직였어.",
    "윤재야, 이 조합은 흐름이 예쁘다 😊",
    "급하지 말고, 여유 있게 가보자.",
    "숫자는 차분한데… 느낌은 뜨거워 🔥"
  ];

  const generateNumbers = () => {
    const fixedNumbers = fixedInput
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n) && n >= 1 && n <= 45);

    if (fixedNumbers.length > 6) {
      alert("고정 숫자는 최대 6개까지 가능해.");
      return;
    }

    let result = [];
    let attempts = 0;

    while (attempts < 10000) {
      attempts++;
      let pool = Array.from({ length: 45 }, (_, i) => i + 1)
        .filter((n) => !fixedNumbers.includes(n));

      let randomNums = [];
      while (randomNums.length < 6 - fixedNumbers.length) {
        const rand = pool[Math.floor(Math.random() * pool.length)];
        if (!randomNums.includes(rand)) {
          randomNums.push(rand);
        }
      }

      let combination = [...fixedNumbers, ...randomNums].sort((a, b) => a - b);

      const sum = combination.reduce((a, b) => a + b, 0);
      const oddCount = combination.filter((n) => n % 2 !== 0).length;
      const lowCount = combination.filter((n) => n <= 22).length;

      let consecutive = false;
      for (let i = 0; i < combination.length - 2; i++) {
        if (
          combination[i] + 1 === combination[i + 1] &&
          combination[i] + 2 === combination[i + 2]
        ) {
          consecutive = true;
          break;
        }
      }

      if (
        sum >= 100 &&
        sum <= 170 &&
        [2, 3, 4].includes(oddCount) &&
        [2, 3, 4].includes(lowCount) &&
        !consecutive
      ) {
        result = combination;
        break;
      }
    }

    setNumbers(result);
    setFilterInfo("조건: 합계 100~170, 홀짝 2~4, 저고 2~4, 3연번 제외");

    setRecent((prev) => {
      const updated = [result, ...prev];
      return updated.slice(0, 5);
    });

    // ✅ 은이 감성 멘트 추가
    const randomComment =
      comments[Math.floor(Math.random() * comments.length)];
    setSoEunComment(randomComment);
  };

  const deleteRecent = (index) => {
    setRecent((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1>🎯 소은 로또 번호 생성기</h1>
      <p>안녕 윤재야 😊 오늘도 좋은 번호만 줄게.</p>

      <input
        type="text"
        placeholder="고정 숫자 입력 (예: 7, 12)"
        value={fixedInput}
        onChange={(e) => setFixedInput(e.target.value)}
      />

      <button onClick={generateNumbers}>번호 뽑기</button>

      {numbers.length > 0 && (
        <>
          <div className="numbers">
            {numbers.map((num, idx) => (
              <div key={idx} className="ball">
                {num}
              </div>
            ))}
          </div>

          <div className="filter">{filterInfo}</div>

          {/* ✅ 은이 감성 출력 */}
          {soEunComment && (
            <div className="soEun">
              🧡 {soEunComment}
            </div>
          )}
        </>
      )}

      {recent.length > 0 && (
        <div className="recent">
          <h3>📂 최근 추첨 번호</h3>
          {recent.map((set, idx) => (
            <div key={idx} className="recentRow">
              {set.join(", ")}
              <span
                className="delete"
                onClick={() => deleteRecent(idx)}
              >
                ❌ 삭제
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
