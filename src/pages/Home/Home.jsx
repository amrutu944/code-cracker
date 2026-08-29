import { Link } from 'react-router-dom';

const FEATURES = [
  {
    title: 'No installation',
    description: 'Nothing to download. Open your browser and start writing code in seconds.',
    icon: '⚡',
  },
  {
    title: 'Instant results',
    description: 'Click Run and watch your HTML, CSS and JavaScript come to life immediately.',
    icon: '▶',
  },
  {
    title: 'Beginner friendly',
    description: 'A simple three-panel layout designed for people writing their first lines of code.',
    icon: '🌱',
  },
  {
    title: 'Practice anywhere',
    description: 'Your projects are saved right in your browser, ready whenever you come back.',
    icon: '💾',
  },
  {
    title: 'Build real projects',
    description: 'Go beyond snippets — build small websites and see them work end to end.',
    icon: '🧩',
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:pt-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cc-border bg-cc-panel px-3 py-1 text-xs font-medium text-cc-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-cc-accent" aria-hidden="true" />
          A playground built for learning
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-cc-text sm:text-5xl">Code Cracker</h1>
        <p className="mt-3 text-lg font-medium text-cc-accent2">Learn. Code. Build.</p>
        <p className="mx-auto mt-4 max-w-xl text-cc-muted">
          Write HTML, CSS and JavaScript directly in your browser and see your code come to life instantly.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/playground"
            className="w-full rounded-cc bg-cc-accent px-6 py-3 text-sm font-semibold text-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent2 sm:w-auto"
          >
            Start Coding
          </Link>
          <Link
            to="/playground"
            className="w-full rounded-cc border border-cc-border px-6 py-3 text-sm font-semibold text-cc-text hover:bg-cc-panel2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent2 sm:w-auto"
          >
            Explore Playground
          </Link>
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-cc border border-cc-border bg-cc-panel shadow-2xl">
          <div className="flex items-center gap-2 border-b border-cc-border bg-cc-panel2 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-cc-accent" aria-hidden="true" />
            <span className="ml-2 text-xs text-cc-muted">My First Website</span>
          </div>
          <div className="grid grid-cols-1 gap-px bg-cc-border sm:grid-cols-2">
            <div className="bg-cc-panel p-4 text-left font-mono text-xs text-cc-muted">
              <p className="mb-1 text-cc-accent2">HTML</p>
              <p>&lt;h1&gt;Hello, Code Cracker!&lt;/h1&gt;</p>
              <p>&lt;p&gt;Start learning web dev.&lt;/p&gt;</p>
              <p className="mb-1 mt-3 text-cc-accent2">CSS</p>
              <p>h1 {'{'} color: #2563eb; {'}'}</p>
            </div>
            <div className="flex items-center justify-center bg-white p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-[#2563eb]">Hello, Code Cracker!</h2>
                <p className="text-sm text-gray-600">Start learning web development.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <h2 className="text-center text-2xl font-bold text-cc-text">Why Code Cracker?</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-cc border border-cc-border bg-cc-panel p-5">
              <span className="text-2xl" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-cc-text">{feature.title}</h3>
              <p className="mt-1 text-sm text-cc-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
