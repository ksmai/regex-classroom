/**
 * Predetermined level data
 * Difficulty can be omitted as it will be inferred from the position
 * of the level in the array (0, 1, 2, ...)
 * see {@link Level} for the detailed format of each level
 */
export const levels = [
  {
    name: 'Fundamentals',
    tests: [
      {
        question: 'Match preceding element 0 or more times',
        answer: '*',
      },
      {
        question: 'Match preceding element 1 or more times',
        answer: '+',
      },
      {
        question: 'Match any single character',
        answer: '.',
      },
      {
        question: "Match either 'a' or 'b'",
        answer: 'a|b',
      },
      {
        question: 'Escape a special character',
        answer: '\\',
      },
      {
        question: 'The character x',
        answer: 'x',
      },
      {
        question: 'The string pixt',
        answer: 'pixt',
      },
    ],
  },
  {
    name: 'Character Classes',
    tests: [
      {
        question: 'Match a digit character',
        answer: '\\d',
      },
      {
        question: 'Match a non-digit character',
        answer: '\\D',
      },
      {
        question: 'Match a whitespace character',
        answer: '\\s',
      },
      {
        question: 'Match a non-whitespace character',
        answer: '\\S',
      },
      {
        question: 'Match a alphanumeric character or underscore',
        answer: '\\w',
      },
      {
        question: 'Match a non-word character',
        answer: '\\W',
      },
    ],
  },
  {
    name: 'Character Classes 2',
    tests: [
      {
        question: "Match any one of the characters in the set 'pqr'",
        answer: '[pqr]',
      },
      {
        question: "Match anything not in character set 'pqr'",
        answer: '[^pqr]',
      },
      {
        question: 'Match a backspace',
        answer: '[\\b]',
      },
    ],
  },
  {
    name: 'Assertions',
    tests: [
      {
        question: 'Match beginning of input',
        answer: '^',
      },
      {
        question: 'Match end of input',
        answer: '$',
      },
      {
        question: 'Match a word boundary',
        answer: '\\b',
      },
      {
        question: 'Match a non-word boundary',
        answer: '\\B',
      },
      {
        question: 'Lookahead',
        answer: '?=',
      },
      {
        question: 'Negative lookahead',
        answer: '?!',
      },
    ],
  },
  {
    name: 'Assertions 2',
    tests: [
      {
        question: 'Lookbehind',
        answer: '?<=',
      },
      {
        question: 'Negative lookbehind',
        answer: '?<!',
      },
      {
        question: 'Once only subexpression',
        answer: '?>',
      },
      {
        question: 'If then condition',
        answer: '?()',
      },
      {
        question: 'If then else condition',
        answer: '?()|',
      },
      {
        question: 'Comment',
        answer: '?#',
      },
    ],
  },
  {
    name: 'Quantifiers',
    tests: [
      {
        question: 'Match exactly n occurrences of preceding expression',
        answer: '{n}',
      },
      {
        question: 'Match at least n and at most m occurrences of preceding expression',
        answer: '{n,m}',
      },
      {
        question: 'Match preceding expression 0 or 1 times',
        answer: '?',
      },
    ],
  },
  {
    name: 'Special Characters',
    tests: [
      {
        question: 'Match control character X',
        answer: '\\cX',
      },
      {
        question: 'Match a line feed',
        answer: '\\n',
      },
      {
        question: 'Match a carriage return',
        answer: '\\r',
      },
      {
        question: 'Match a tab',
        answer: '\\t',
      },
      {
        question: 'Match a NULL',
        answer: '\\0',
      },
    ],
  },
  {
    name: 'Special Characters 2',
    tests: [
      {
        question: 'Match a form feed',
        answer: '\\f',
      },
      {
        question: 'Match a vertical tab',
        answer: '\\v',
      },
      {
        question: 'Match a character with code hh (2 hex digits)',
        answer: '\\xhh',
      },
      {
        question: 'Match a character with code hhhh (4 hex digits)',
        answer: '\\uhhhh',
      },
    ],
  },
  {
    name: 'Flags',
    tests: [
      {
        question: 'Global search',
        answer: 'g',
      },
      {
        question: 'Case insensitive search',
        answer: 'i',
      },
      {
        question: 'Multi-line search',
        answer: 'm',
      },
      {
        question: '"sticky" search match starting at current position in target string',
        answer: 'y',
      },
    ],
  },
  {
    name: 'Groups',
    tests: [
      {
        question: "Match 'a' and remember the match",
        answer: '(a)',
      },
      {
        question: "Match 'a' but do not remember the match",
        answer: '(?:x)',
      },
      {
        question: 'A back reference to the last substring matching the first parenthetical in the regex',
        answer: '\\1',
      },
    ],
  },
];
