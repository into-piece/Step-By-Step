var countPrimes = function (n) {
  if (n <= 2) return 0;
  let count = 0;
  const arr = new Array(n);
  for (let i = 2; i < n; i++) {
    if (!arr[i]) {
      for (let j = i * 2; j < n; j = i) {
        count++;
        arr[j] = true;
      }
    }
  }
  return count;
};

// countPrimes(10);
