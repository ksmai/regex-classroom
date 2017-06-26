import { randomID } from './random-id';

export function testLevel(difficulty: number) {
  return {
    difficulty,
    _id: randomID(),
    tests: [
      { question: 'q1', answer: 'a1' },
      { question: 'q2', answer: 'a2' },
      { question: 'q3', answer: 'a3' },
    ],
  };
}
