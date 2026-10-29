const assert = require('node:assert/strict');
const { shuffleChoiceOrder } = require('../app/game/choice-order.js');

const order = shuffleChoiceOrder(3, () => 0);

assert.deepEqual(order, [1, 2, 0]);
assert.deepEqual([...order].sort((a, b) => a - b), [0, 1, 2]);
assert.deepEqual(shuffleChoiceOrder(0, () => 0), []);

console.log('choice-order tests: 3 passed');
