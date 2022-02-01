var array = [1, 1, 3, 6, 5, 2];

for (let i = 0; i < array.length; i++) {
  let arr = [array[i], array[array.length - 1 - i]];

  let hi = [arr[0] + arr[1]];
  console.log(hi);
}
