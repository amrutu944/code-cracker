// errorParser.js
// Turns raw runtime error messages into beginner-friendly explanations.

const FRIENDLY_HINTS = [
  {
    match: /is not defined/i,
    hint: 'You used a variable or function that has not been created yet. Check the spelling, or make sure you declared it before using it.',
  },
  {
    match: /is not a function/i,
    hint: 'You tried to call something that is not a function. Double-check the name and that it exists.',
  },
  {
    match: /cannot read propert(y|ies) .* of (null|undefined)/i,
    hint: "You tried to use a property on something that doesn't exist yet. This often happens when document.querySelector can't find an element.",
  },
  {
    match: /unexpected token/i,
    hint: 'There is a typo or a missing bracket, parenthesis, or comma in your code.',
  },
  {
    match: /unexpected end of input/i,
    hint: 'It looks like a closing bracket, parenthesis, or quote is missing somewhere in your code.',
  },
];

export function getFriendlyHint(message = '') {
  const found = FRIENDLY_HINTS.find((entry) => entry.match.test(message));
  return found ? found.hint : null;
}

export function formatConsoleEntry({ level, message, errorName, lineNumber }) {
  const hint = level === 'error' ? getFriendlyHint(message) : null;
  return {
    level,
    message,
    errorName: errorName || null,
    lineNumber: lineNumber || null,
    hint,
    timestamp: Date.now(),
  };
}
