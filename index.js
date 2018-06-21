'use strict'

const fastStringify = require('fast-safe-stringify');
const flatStr = require('flatstr');

const s = process.stdout;

// s.write('123', 'utf-8', () => {
//     console.log('done');
// });

// const a = { b : 1 };
// a.o = a;

console.log('a = %d, b = %j', a, a);
// // console.log(JSON.stringify(a));
// console.log(fastStringify(a));
// const b = ["1",2,{a:3}];
// console.log(b);
// console.log(b);
// console.log(b);