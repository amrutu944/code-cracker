import { Link } from 'react-router-dom';

function timeAgo(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(isoDate).toLocaleDateString();
}

export default function ProjectCard({ project, onDelete }) {
  return (
    <div className="flex flex-col justify-between rounded-cc border border-cc-border bg-cc-panel p-4 transition-colors hover:border-cc-accent/50">
      <div>
        <h3 className="truncate text-sm font-semibold text-cc-text">{project.name}</h3>
        <p className="mt-1 text-xs text-cc-muted">Updated {timeAgo(project.updatedAt)}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Link
          to={`/playground/${project.id}`}
          className="text-sm font-medium text-cc-accent2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent2"
        >
          Open →
        </Link>
        <button
          type="button"
          onClick={() => onDelete(project)}
          aria-label={`Delete ${project.name}`}
          className="rounded-md px-2 py-1 text-xs font-medium text-cc-muted hover:bg-red-500/10 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
