import * as code from "./code";

code.initData();
const quick = code.getCode(`
function sort(l, h) {
  if (l < h) {
    i = l; j = h;
    p = med3(get(i),
      get(Math.floor(i + (j - i) / 2)),
      get(j));
    while(true) {
      while (get(i) < p) i++;
      while (p < get(j)) j--;
      if (i >= j) break;
      swap(i, j);
      i++; j--;
    }
    sort(l, i - 1);
    sort(j + 1, h);
  }
}
function med3(x, y, z) {
  if (x < y) {
    if (y < z) return y;
    else if (z < x) return x;
    else return z;
  } else {
    if (z < y) return y;
    else if (x < z) return x;
    else return z;
  }
}
sort(0, length - 1);
`);
const insertion = code.getCode(
  `
for (i = 1; i < length; i++) {
  j = i;
  while (j > 0 && get(j - 1) > get(j)) {
    swap(j, j - 1);
    j--;
  }
}
`,
  true
);

for (let i = 0; i <= 1000000; i++) {
  if (!code.step(quick)) {
    code.reset(quick);
  }
  if (!code.step(insertion)) {
    code.reset(insertion);
  }
  const asc = code.countDataAscending();
  const dec = code.countDataAscending(true);
  if (asc === 0 || dec === 0) {
    console.log(`${asc} ${dec} ${i}`);
    console.log(code.data);
    break;
  }
  if (i % 100000 === 0) {
    console.log(`${asc} ${dec} ${i}`);
    console.log(code.data);
  }
}
