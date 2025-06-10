import Decimal from 'decimal.js';

const PRECEDENSE = {
  '+': 1,
  '-': 1,
  '×': 2,
  '÷': 2,
};

/**
 * a, b, c, d の順番が確定したら、優先度別の演算パターンは
 * ((a  b)  c)  d
 * (a  b)  (c  d)
 * (a  (b  c))  d
 * a  ((b  c)  d)
 * a  (b  (c  d))
 *
 * 演算子のパターンは
 * op1 op2 op3
 * op1 op3 op2
 * op2 op1 op3
 * op2 op3 op1
 * op3 op1 op2
 * op3 op2 op1
 *
 * 結合して 5*6 = 30 通りのパターンがある
 */
const RPN_PATTERNS = [
  [0, 1, 4, 2, 5, 3, 6], // ((a op1 b) op2 c) op3 d
  [0, 1, 4, 2, 6, 3, 5], // ((a op1 b) op3 c) op2 d
  [0, 1, 5, 2, 4, 3, 6], // ((a op2 b) op1 c) op3 d
  [0, 1, 5, 2, 6, 3, 4], // ((a op2 b) op3 c) op1 d
  [0, 1, 6, 2, 4, 3, 5], // ((a op3 b) op1 c) op2 d
  [0, 1, 6, 2, 5, 3, 4], // ((a op3 b) op2 c) op1 d

  [0, 1, 4, 2, 3, 6, 5], // (a op1 b) op2 (c op3 d)
  [0, 1, 4, 2, 3, 5, 6], // (a op1 b) op3 (c op2 d)
  [0, 1, 5, 2, 3, 6, 4], // (a op2 b) op1 (c op3 d)
  [0, 1, 5, 2, 3, 4, 6], // (a op2 b) op3 (c op1 d)
  [0, 1, 6, 2, 3, 5, 4], // (a op3 b) op1 (c op2 d)
  [0, 1, 6, 2, 3, 4, 5], // (a op3 b) op2 (c op1 d)

  [0, 1, 2, 5, 4, 3, 6], // (a op1 (b op2 c)) op3 d
  [0, 1, 2, 6, 4, 3, 5], // (a op1 (b op3 c)) op2 d
  [0, 1, 2, 4, 5, 3, 6], // (a op2 (b op1 c)) op3 d
  [0, 1, 2, 6, 5, 3, 4], // (a op2 (b op3 c)) op1 d
  [0, 1, 2, 4, 5, 3, 6], // (a op3 (b op1 c)) op2 d
  [0, 1, 2, 5, 6, 3, 4], // (a op3 (b op2 c)) op1 d

  [0, 1, 2, 5, 3, 6, 4], // a op1 ((b op2 c) op3 d)
  [0, 1, 2, 6, 3, 5, 4], // a op1 ((b op3 c) op2 d)
  [0, 1, 2, 4, 3, 6, 5], // a op2 ((b op1 c) op3 d)
  [0, 1, 2, 6, 3, 4, 5], // a op2 ((b op3 c) op1 d)
  [0, 1, 2, 4, 3, 5, 6], // a op3 ((b op1 c) op2 d)
  [0, 1, 2, 5, 3, 4, 6], // a op3 ((b op2 c) op1 d)

  [0, 1, 2, 3, 6, 5, 4], // a op1 (b op2 (c op3 d))
  [0, 1, 2, 3, 5, 6, 4], // a op1 (b op3 (c op2 d))
  [0, 1, 2, 3, 6, 4, 5], // a op2 (b op1 (c op3 d))
  [0, 1, 2, 3, 4, 6, 5], // a op2 (b op3 (c op1 d))
  [0, 1, 2, 3, 5, 4, 6], // a op3 (b op1 (c op2 d))
  [0, 1, 2, 3, 4, 5, 6], // a op3 (b op2 (c op1 d))
];

export default function solve(numbers) {
  if (!Array.isArray(numbers) || numbers.length !== 4) {
    throw new Error('invalid parameter array');
  }

  if (numbers.some((num) => typeof num !== 'number' || num < 0 || num > 10 || !Number.isInteger(num))) {
    throw new Error('invalid parameter number');
  }

  let results = [];

  // generate all RPN expressions
  const expressions = expressionPermutations(numbers);
  // filter RPN expressions that evaluate to 24
  results = expressions.filter((tokens) => isCorrectExpression(tokens));
  // convert RPN expressions to infix notation
  results = results.map((tokens) => rpnToInfix(tokens));
  // deduplicate infix expressions
  results = Array.from([...results]);

  return results;
}

function expressionPermutations(numbers) {
  const numberPerms = numberPermutations(numbers);
  const operatorPerms = operatorPermutations(Object.keys(PRECEDENSE));

  const permutations = [];
  for (const numberPerm of numberPerms) {
    for (const operatorPerm of operatorPerms) {
      for (const pattern of RPN_PATTERNS) {
        const tokens = pattern.map((index) => (index < 4 ? numberPerm[index] : operatorPerm[index - 4]));
        permutations.push(tokens);
      }
    }
  }
  return permutations;
}

function numberPermutations(numbers) {
  const backtrack = (index, result) => {
    if (index === numbers.length) {
      permutations.push(result.slice());
      return;
    }
    for (let i = 0; i < numbers.length; ++i) {
      if (used[i] || (i > 0 && numbers[i] === numbers[i - 1] && !used[i - 1])) {
        continue;
      }
      result.push(numbers[i]);
      used[i] = true;
      backtrack(index + 1, result);
      used[i] = false;
      result.pop();
    }
  };

  const permutations = [];
  const used = new Array(numbers.length).fill(false);
  numbers.sort((x, y) => x - y);
  backtrack(0, []);
  return permutations;
}

function operatorPermutations(operators) {
  const permutations = [];
  for (const op1 of operators) {
    for (const op2 of operators) {
      for (const op3 of operators) {
        permutations.push([op1, op2, op3]);
      }
    }
  }
  return permutations;
}

function isCorrectExpression(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (typeof token === 'number') {
      stack.push(new Decimal(token));
    } else if (Object.keys(PRECEDENSE).includes(token)) {
      const num1 = stack.pop();
      const num2 = stack.pop();
      if (num1 === undefined || num2 === undefined) {
        return false; // invalid RPN expression
      }

      let result;
      switch (token) {
        case '+':
          result = num2.plus(num1);
          break;
        case '-':
          result = num2.minus(num1);
          break;
        case '×':
          result = num2.times(num1);
          break;
        case '÷':
          if (num1.isZero()) {
            return false; // division by zero
          }
          result = num2.div(num1);
          break;
        default:
          return false; // invalid operator
      }
      stack.push(result);
    } else {
      return false; // invalid token
    }
  }

  if (stack.length !== 1) {
    return false;
  }
  return stack[0].minus(24).abs().lessThanOrEqualTo(1e-6);
}

function rpnToInfix(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (typeof token === 'number') {
      stack.push({
        expression: token,
        operator: null,
        precedence: Infinity,
      });
    } else {
      let right = stack.pop();
      let left = stack.pop();
      if (token === '+' || token === '*') {
        [left, right] = [left, right].sort();
      }
      const currentPrecedence = PRECEDENSE[token];
      let leftExpression = left.expression;
      let rightExpression = right.expression;
      if (left.operator !== null && left.precedence < currentPrecedence) {
        leftExpression = `(${leftExpression})`;
      }
      if (right.operator !== null && (right.precedence < currentPrecedence || (right.precedence === currentPrecedence && (token === '-' || token === '/')))) {
        rightExpression = `(${rightExpression})`;
      }
      stack.push({
        expression: `${leftExpression} ${token} ${rightExpression}`,
        operator: token,
        precedence: currentPrecedence,
      });
    }
  }
  return stack[0].expression;
}
