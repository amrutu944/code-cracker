// Interactive Structured Learning dataset for Code Cracker

export const LEARN_DATA = [
  {
    id: 'course-web-foundations',
    title: 'Web Development Foundations',
    icon: 'Layout',
    category: 'HTML & CSS',
    level: 'Beginner',
    description: 'Master HTML tags, layout structure, modern CSS styling, flexbox, and responsive design.',
    lessons: [
      {
        id: 'lesson-html-structure',
        title: 'HTML Skeleton & Semantic Elements',
        duration: '5 min read',
        summary: 'Understand doc structure, headings, paragraphs, links, images, and semantic tags.',
        content: `
### HTML Structure
HTML (HyperText Markup Language) gives structure to web pages using **tags**.

A basic HTML element has an opening tag \`<h1>\`, content, and a closing tag \`</h1>\`.

\`\`\`html
<h1>Welcome to My Site</h1>
<p>This is a paragraph of text on my website.</p>
<button>Click Me</button>
\`\`\`

### Semantic Tags
Modern HTML uses semantic elements to describe content meaningfully:
- \`<header>\`: Header or banner area
- \`<main>\`: Main page content
- \`<article>\` & \`<section>\`: Groupings of content
- \`<footer>\`: Bottom section with links or copyright
        `,
        codeExample: {
          html: `<header style="background: #1e293b; padding: 15px; color: white;">\n  <h2>My Awesome Web Page</h2>\n</header>\n\n<main style="padding: 20px;">\n  <p>HTML provides structure, CSS provides style, and JS adds interactivity!</p>\n  <button style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px;">Get Started</button>\n</main>`,
          css: `body { font-family: system-ui, sans-serif; margin: 0; }`,
          javascript: `console.log("Web Foundations loaded!");`,
        },
        quiz: {
          question: 'Which tag is best suited for the main title of a web page?',
          options: ['<title>', '<h1>', '<head>', '<header>'],
          correctIndex: 1,
          explanation: 'The <h1> tag defines the primary level-1 heading on a page.',
        },
      },
      {
        id: 'lesson-css-styling',
        title: 'CSS Styling, Colors & Flexbox',
        duration: '7 min read',
        summary: 'Learn how to apply styles, use colors, margins, padding, and create flexbox layouts.',
        content: `
### CSS Basics
CSS (Cascading Style Sheets) controls colors, fonts, spacing, and layout.

\`\`\`css
h1 {
  color: #38bdf8;
  font-size: 32px;
}

.card {
  background-color: #1e293b;
  border-radius: 8px;
  padding: 20px;
}
\`\`\`

### Flexbox Layout
Flexbox makes it easy to align elements in rows or columns:
- \`display: flex;\`
- \`justify-content: center | space-between;\`
- \`align-items: center;\`
        `,
        codeExample: {
          html: `<div class="container">\n  <div class="card">Box 1</div>\n  <div class="card">Box 2</div>\n  <div class="card">Box 3</div>\n</div>`,
          css: `.container {\n  display: flex;\n  gap: 16px;\n  padding: 20px;\n  background: #0f172a;\n}\n\n.card {\n  flex: 1;\n  background: #1e293b;\n  color: #38bdf8;\n  padding: 24px;\n  border-radius: 8px;\n  text-align: center;\n  font-weight: bold;\n}`,
          javascript: ``,
        },
        quiz: {
          question: 'Which CSS property enables flexbox on a container element?',
          options: ['display: flex;', 'layout: flex;', 'flex-mode: on;', 'position: flex;'],
          correctIndex: 0,
          explanation: 'display: flex; transforms an element into a flex container.',
        },
      },
    ],
  },
  {
    id: 'course-javascript-mastery',
    title: 'Interactive JavaScript Essentials',
    icon: 'Code2',
    category: 'JavaScript',
    level: 'Beginner to Intermediate',
    description: 'Learn variables, functions, events, DOM manipulation, arrays, objects, and async/await.',
    lessons: [
      {
        id: 'lesson-js-dom',
        title: 'DOM Manipulation & Event Listeners',
        duration: '8 min read',
        summary: 'Select elements from the DOM, update content dynamically, and respond to user clicks.',
        content: `
### The Document Object Model (DOM)
JavaScript can query and manipulate HTML elements dynamically:

\`\`\`javascript
const heading = document.querySelector('h1');
heading.textContent = 'Updated Title!';
heading.style.color = '#22c55e';
\`\`\`

### Event Listeners
Listen to user actions such as clicks, typing, or submit:

\`\`\`javascript
const btn = document.getElementById('my-btn');
btn.addEventListener('click', () => {
  alert('Button clicked!');
});
\`\`\`
        `,
        codeExample: {
          html: `<h1 id="title">Click the button below!</h1>\n<button id="btn" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Change Color</button>`,
          css: `body { padding: 20px; font-family: sans-serif; }`,
          javascript: `const title = document.getElementById('title');\nconst btn = document.getElementById('btn');\n\nconst colors = ['#38bdf8', '#22c55e', '#a855f7', '#f43f5e'];\nlet index = 0;\n\nbtn.addEventListener('click', () => {\n  index = (index + 1) % colors.length;\n  title.style.color = colors[index];\n  console.log("Changed color to:", colors[index]);\n});`,
        },
        quiz: {
          question: 'What method attaches an event handler to an HTML element?',
          options: ['element.onClick()', 'element.addEventListener()', 'element.attach()', 'element.listen()'],
          correctIndex: 1,
          explanation: 'addEventListener() registers an event handler for a specified event.',
        },
      },
    ],
  },
  {
    id: 'course-python-basics',
    title: 'Python Programming Quickstart',
    icon: 'Terminal',
    category: 'Python',
    level: 'Beginner',
    description: 'Master Python syntax, variables, lists, dictionaries, loops, functions, and logic.',
    lessons: [
      {
        id: 'lesson-python-intro',
        title: 'Python Variables, Data Types & Print',
        duration: '6 min read',
        summary: 'Learn Python basics: numbers, strings, lists, dictionaries, and standard input/output.',
        content: `
### Python Basics
Python is clean, readable, and powerful:

\`\`\`python
name = "Code Cracker"
xp = 100
skills = ["HTML", "CSS", "JS", "Python"]

print(f"Welcome to {name}! Current XP: {xp}")
for skill in skills:
    print(f"- {skill}")
\`\`\`
        `,
        codeExample: {
          html: '',
          css: '',
          javascript: '',
          code: `name = "Student"\nscore = 95\n\nprint(f"Hello {name}, your quiz score is {score}%.")\n\nif score >= 90:\n    print("Grade: A - Excellent!")\nelif score >= 80:\n    print("Grade: B - Great job!")\nelse:\n    print("Keep practicing!")`,
        },
        quiz: {
          question: 'How do you create a formatted string (f-string) in Python?',
          options: ['f"Hello {name}"', 'format("Hello %s", name)', '"Hello ${name}"', 'string("Hello " + name)'],
          correctIndex: 0,
          explanation: 'Prefixing a string literal with "f" enables f-string expression interpolation.',
        },
      },
    ],
  },
];
