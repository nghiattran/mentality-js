'use strict';

const assert = require('assert');
const mentalityJs = require('./');
const json = require('./example/network.json');

const network = mentalityJs.Network.fromJson(json)
// console.log(network);
// console.log(network);
let head = network.rolling()
head = head.next;
head = head.next;

console.log(head.content);

// describe('test', function(){

//   // You should add more tests here
  
//   it('fail', function() {
//     assert(false);
//   });
// });