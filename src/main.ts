import * as code from "./code";

code.initData();
let insertion = code.getCode(
  `
i = 1;
while (i < length) {
  j = i;
  while (j > 0 && get(j - 1) > get(j)) {
    swap(j, j - 1);
    j--;
  }
  i++;
}
`,
  true
);

console.log(code.data);
for (let i = 0; i < 10000; i++) {
  if (!code.step(insertion)) {
    code.reset(insertion);
  }
}
console.log(code.data);
