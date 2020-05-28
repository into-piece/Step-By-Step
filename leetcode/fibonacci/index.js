// 斐波那契数列
function fibonacci(n) {
  if (n === 1 || n === 0) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
const a = fibonacci(8);
console.log(a,'=======fibonacci')


// 尾调用
function fibonacci2(n, current=0, next=1) {
  if (n === 1 ) return next;
  if (n === 0 ) return 0;
  return fibonacci2(n-1, next, current+next)
}
const b = fibonacci2(8);
console.log(b,'=======fibonacci2')


// 递推
function fibonacci3(n) {
  let arr = Array(n).fill(0)
  let total = 0
  arr[0] = 0
  arr[1] = 1
  for(let i = 2; i < n; i++){
    arr[i] = arr[i-1] +  arr[i-2]
  }
  return arr[n]
}

function fibonacci31(n) {
  let cur = 0
  let next = 1
  let temp
  for(let i = 0; i < n; i++){
    temp = cur
    cur = next
    next += temp
  }

  return cur
}

function fibonacci(n) {
  let current = 0;
  let next = 1;
  for(let i = 0; i < n; i++){
      [current, next] = [next, current + next];
  }
  return current;
}

function fibonacci(n) {
  let current = 0;
  let next = 1;
  while(n --> 0){
      [current, next] = [next, current + next];
  }
  return current;
}

function fibonacci(n){
	let seed = 1;
	return [...Array(n)].reduce(p => {
		const temp = p + seed; 
		seed = p;
		return temp;
	},0)
}

const c = fibonacci3(8);
console.log(c,'=======fibonacci3')