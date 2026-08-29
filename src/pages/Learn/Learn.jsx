export default function Learn() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cc-panel2 text-2xl" aria-hidden="true">
        📚
      </span>
      <h1 className="mt-5 text-2xl font-bold text-cc-text">Structured Learning</h1>
      <p className="mt-3 text-cc-muted">
        Guided lessons covering HTML, CSS, JavaScript and beyond are coming soon, designed to pair perfectly with the
        Playground so you can practice everything you learn immediately.
      </p>
      <p className="mt-6 text-sm text-cc-muted">Until then, the Playground is the best place to experiment and learn by doing.</p>
    </div>
  );
}
