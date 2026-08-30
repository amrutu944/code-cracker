// Interactive Coding Challenges dataset for Code Cracker

export const CHALLENGES_DATA = [
  {
    id: 'html-first-heading',
    title: 'Create a Hero Heading',
    category: 'web',
    language: 'web',
    difficulty: 'Beginner',
    xp: 50,
    summary: 'Build a styled hero section heading and subtitle for a modern homepage.',
    instructions: `
### Task
1. Create an \`<h1>\` tag with the text **"Build the Future"** and set its color to **#2563eb**.
2. Below the heading, create a \`<p>\` tag with class \`subtitle\` containing **"Code directly in your browser."**.
3. In the CSS panel, style \`.subtitle\` with a font size of **18px** and color **#64748b**.
    `,
    starterCode: {
      html: `<!-- Write your HTML here -->\n<h1>Build the Future</h1>\n<p class="subtitle">Code directly in your browser.</p>`,
      css: `/* Write your CSS here */\nh1 {\n  color: #2563eb;\n}\n\n.subtitle {\n  font-size: 18px;\n  color: #64748b;\n}`,
      javascript: `// No JS required for this challenge`,
    },
    hints: [
      'Ensure the h1 text matches "Build the Future" exactly.',
      'Check the CSS selector .subtitle has font-size: 18px;',
    ],
    tests: [
      {
        id: 't1',
        description: 'Contains an <h1> tag with text "Build the Future"',
        checkWeb: (doc) => {
          const h1 = doc.querySelector('h1');
          return Boolean(h1 && h1.textContent.trim() === 'Build the Future');
        },
      },
      {
        id: 't2',
        description: 'Contains a <p> tag with class "subtitle" and text "Code directly in your browser."',
        checkWeb: (doc) => {
          const p = doc.querySelector('p.subtitle');
          return Boolean(p && p.textContent.trim() === 'Code directly in your browser.');
        },
      },
      {
        id: 't3',
        description: 'Subtitle has custom CSS styling applied',
        checkWeb: (doc) => {
          const p = doc.querySelector('p.subtitle');
          if (!p) return false;
          const style = doc.defaultView.getComputedStyle(p);
          return style.color !== '' && style.fontSize !== '';
        },
      },
    ],
  },
  {
    id: 'js-counter-app',
    title: 'Interactive Click Counter',
    category: 'web',
    language: 'web',
    difficulty: 'Beginner',
    xp: 75,
    summary: 'Create a working button that increments a counter on each click.',
    instructions: `
### Task
1. Add a button with ID \`count-btn\` and text **"Click Me: 0"**.
2. Write JavaScript so that every time the button is clicked, the count increases by 1 and the button text becomes **"Click Me: X"**.
    `,
    starterCode: {
      html: `<div style="text-align: center; padding: 40px;">\n  <button id="count-btn" style="padding: 12px 24px; font-size: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; cursor: pointer;">Click Me: 0</button>\n</div>`,
      css: `button:hover {\n  opacity: 0.9;\n}`,
      javascript: `let count = 0;\nconst button = document.getElementById('count-btn');\n\nbutton.addEventListener('click', () => {\n  count++;\n  button.textContent = \`Click Me: \${count}\`;\n});`,
    },
    hints: [
      'Use document.getElementById("count-btn") to select the button.',
      'Attach a click listener that increments count.',
    ],
    tests: [
      {
        id: 't1',
        description: 'Button element with ID "count-btn" exists',
        checkWeb: (doc) => Boolean(doc.getElementById('count-btn')),
      },
      {
        id: 't2',
        description: 'Clicking button increments counter value',
        checkWeb: (doc) => {
          const btn = doc.getElementById('count-btn');
          if (!btn) return false;
          btn.click();
          const text1 = btn.textContent;
          btn.click();
          const text2 = btn.textContent;
          return text1.includes('1') && text2.includes('2');
        },
      },
    ],
  },
  {
    id: 'js-array-filter',
    title: 'Filter Even Numbers',
    category: 'javascript',
    language: 'web',
    difficulty: 'Intermediate',
    xp: 100,
    summary: 'Write a function that receives an array of integers and returns only the even numbers.',
    instructions: `
### Task
Complete the function \`filterEvenNumbers(numbers)\` in JavaScript:
- Return a new array containing only the even numbers in the same order.
- Test with \`console.log(filterEvenNumbers([1, 2, 3, 4, 5, 6]))\`.
    `,
    starterCode: {
      html: `<div style="padding: 20px; font-family: sans-serif; color: #38bdf8;">Check the Console panel below!</div>`,
      css: `body { background: #0f172a; }`,
      javascript: `function filterEvenNumbers(numbers) {\n  return numbers.filter(n => n % 2 === 0);\n}\n\nconsole.log(filterEvenNumbers([1, 2, 3, 4, 5, 6]));`,
    },
    hints: [
      'Use array.filter(n => n % 2 === 0).',
    ],
    tests: [
      {
        id: 't1',
        description: 'filterEvenNumbers function is defined',
        checkWeb: (doc, win) => typeof win.filterEvenNumbers === 'function',
      },
      {
        id: 't2',
        description: 'filterEvenNumbers([1, 2, 3, 4, 5, 6]) returns [2, 4, 6]',
        checkWeb: (doc, win) => {
          if (typeof win.filterEvenNumbers !== 'function') return false;
          const res = win.filterEvenNumbers([1, 2, 3, 4, 5, 6]);
          return Array.isArray(res) && res.length === 3 && res[0] === 2 && res[1] === 4 && res[2] === 6;
        },
      },
    ],
  },
  {
    id: 'py-sum-list',
    title: 'Sum of Array Elements in Python',
    category: 'python',
    language: 'python3.10',
    difficulty: 'Beginner',
    xp: 60,
    summary: 'Write a Python script that calculates the sum of all numbers in a list.',
    instructions: `
### Task
1. Create a list \`numbers = [10, 20, 30, 40, 50]\`.
2. Calculate total sum using \`sum(numbers)\`.
3. Print the result using \`print(sum(numbers))\`.
    `,
    starterCode: {
      html: '',
      css: '',
      javascript: '',
      code: `numbers = [10, 20, 30, 40, 50]\ntotal = sum(numbers)\nprint("Total sum:", total)`,
    },
    hints: [
      'Use Python sum() function and print() standard function.',
    ],
    tests: [
      {
        id: 't1',
        description: 'Output contains the calculated sum value "150"',
        checkOutput: (out) => out.includes('150'),
      },
    ],
  },
  {
    id: 'py-palindrome',
    title: 'Palindrome Checker',
    category: 'python',
    language: 'python3.10',
    difficulty: 'Intermediate',
    xp: 90,
    summary: 'Determine if a given word reads the same backwards as forwards.',
    instructions: `
### Task
Write a function \`is_palindrome(word)\` that returns \`True\` if word is a palindrome, else \`False\`.
    `,
    starterCode: {
      html: '',
      css: '',
      javascript: '',
      code: `def is_palindrome(word):\n    return word == word[::-1]\n\nprint("racecar:", is_palindrome("racecar"))\nprint("python:", is_palindrome("python"))`,
    },
    hints: [
      'Use word[::-1] to reverse a string in Python.',
    ],
    tests: [
      {
        id: 't1',
        description: 'Output contains True for racecar and False for python',
        checkOutput: (out) => out.includes('True') && out.includes('False'),
      },
    ],
  },
];
