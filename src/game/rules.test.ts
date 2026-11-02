import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KATA_KERJA_DATA,
  calculateScore,
  updateStreakAndStars,
  checkBadgeUnlocked,
  getRemainingIndices,
  eliminateOneWrongOption,
  formatExampleSentence,
  type AnswerHistory
} from './rules.ts';

test('KATA_KERJA_DATA has exactly 12 verbs with required keys', () => {
  assert.equal(KATA_KERJA_DATA.length, 12);
  for (const item of KATA_KERJA_DATA) {
    assert.ok(item.kataKerja.length > 0);
    assert.ok(item.gambar.length > 0);
    assert.equal(item.pilihanSalah.length, 2);
    assert.ok(item.ayatContoh.toLowerCase().includes(item.kataKerja.toLowerCase()));
  }
});

test('calculateScore calculates 10 on first try, 5 on second, 0 otherwise', () => {
  assert.equal(calculateScore(1), 10);
  assert.equal(calculateScore(2), 5);
  assert.equal(calculateScore(3), 0);
});

test('updateStreakAndStars awards a star every 3 consecutive correct first tries', () => {
  // First correct
  const s1 = updateStreakAndStars(0, 0, true);
  assert.equal(s1.newStreak, 1);
  assert.equal(s1.newStars, 0);
  assert.equal(s1.earnedStar, false);

  // Second correct
  const s2 = updateStreakAndStars(s1.newStreak, s1.newStars, true);
  assert.equal(s2.newStreak, 2);
  assert.equal(s2.newStars, 0);
  assert.equal(s2.earnedStar, false);

  // Third correct -> earns 1 star!
  const s3 = updateStreakAndStars(s2.newStreak, s2.newStars, true);
  assert.equal(s3.newStreak, 3);
  assert.equal(s3.newStars, 1);
  assert.equal(s3.earnedStar, true);

  // Wrong answer -> resets streak, keeps stars
  const s4 = updateStreakAndStars(s3.newStreak, s3.newStars, false);
  assert.equal(s4.newStreak, 0);
  assert.equal(s4.newStars, 1);
  assert.equal(s4.earnedStar, false);
});

test('checkBadgeUnlocked unlocks badge when >= 8 of first 10 questions correct on first try', () => {
  const historySuccess: AnswerHistory[] = [
    { index: 0, verb: 'makan', firstTryCorrect: true, scoreEarned: 10 },
    { index: 1, verb: 'minum', firstTryCorrect: true, scoreEarned: 10 },
    { index: 2, verb: 'tidur', firstTryCorrect: true, scoreEarned: 10 },
    { index: 3, verb: 'berlari', firstTryCorrect: true, scoreEarned: 10 },
    { index: 4, verb: 'melompat', firstTryCorrect: true, scoreEarned: 10 },
    { index: 5, verb: 'menulis', firstTryCorrect: true, scoreEarned: 10 },
    { index: 6, verb: 'membaca', firstTryCorrect: true, scoreEarned: 10 },
    { index: 7, verb: 'mandi', firstTryCorrect: true, scoreEarned: 10 }, // 8th
    { index: 8, verb: 'menyanyi', firstTryCorrect: false, scoreEarned: 5 },
    { index: 9, verb: 'menari', firstTryCorrect: false, scoreEarned: 5 },
  ];
  assert.equal(checkBadgeUnlocked(historySuccess), true);

  const historyFail: AnswerHistory[] = [
    { index: 0, verb: 'makan', firstTryCorrect: true, scoreEarned: 10 },
    { index: 1, verb: 'minum', firstTryCorrect: true, scoreEarned: 10 },
    { index: 2, verb: 'tidur', firstTryCorrect: true, scoreEarned: 10 },
    { index: 3, verb: 'berlari', firstTryCorrect: true, scoreEarned: 10 },
    { index: 4, verb: 'melompat', firstTryCorrect: true, scoreEarned: 10 },
    { index: 5, verb: 'menulis', firstTryCorrect: true, scoreEarned: 10 },
    { index: 6, verb: 'membaca', firstTryCorrect: true, scoreEarned: 10 }, // only 7
    { index: 7, verb: 'mandi', firstTryCorrect: false, scoreEarned: 5 },
    { index: 8, verb: 'menyanyi', firstTryCorrect: false, scoreEarned: 5 },
    { index: 9, verb: 'menari', firstTryCorrect: false, scoreEarned: 5 },
  ];
  assert.equal(checkBadgeUnlocked(historyFail), false);
});

test('getRemainingIndices excludes completed verbs correctly', () => {
  const rem = getRemainingIndices(12, [0, 2, 4]);
  assert.equal(rem.length, 9);
  assert.ok(!rem.includes(0));
  assert.ok(!rem.includes(2));
  assert.ok(!rem.includes(4));
  assert.ok(rem.includes(1));
  assert.ok(rem.includes(11));
});

test('eliminateOneWrongOption leaves exactly 2 options (including the correct one)', () => {
  const options = ['tidur', 'makan', 'berlari'];
  const reduced = eliminateOneWrongOption(options, 'makan');
  assert.equal(reduced.length, 2);
  assert.ok(reduced.includes('makan'));
  assert.ok(reduced.includes('tidur') || reduced.includes('berlari'));
});

test('formatExampleSentence properly splits and identifies verb in sentence', () => {
  const res = formatExampleSentence('Adik makan nasi.', 'makan');
  assert.equal(res.before, 'Adik ');
  assert.equal(res.match, 'makan');
  assert.equal(res.after, ' nasi.');
});
