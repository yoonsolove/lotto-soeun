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
  }
];

const pickRandomFilters = () => {
  const shuffled = [...filterList].sort(() => 0.5 - Math.random());
  const count = Math.random() > 0.5 ? 3 : 4;
  return shuffled.slice(0, count);
};
