import { Link } from 'react-router-dom';
import { Code2, Trash2, Copy, ExternalLink, Download } from 'lucide-react';

function timeAgo(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

export default function ProjectCard({ project, onDelete, onDuplicate, onDownload }) {
  const isWeb = !project.language || project.language === 'web';

  return (
    <div className="flex flex-col justify-between rounded-xl border border-cc-border bg-cc-panel p-5 transition-all hover:border-cc-accent/50 hover:shadow-lg">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded bg-cc-panel2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cc-accent2 border border-cc-border">
            {isWeb ? 'Web Project' : project.language}
          </span>
          <span className="text-[11px] font-medium text-cc-muted">
            {timeAgo(project.updatedAt)}
          </span>
        </div>

        <h3 className="mt-3 truncate text-base font-bold text-cc-text">{project.name}</h3>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-cc-border/60 pt-3">
        <Link
          to={`/playground/${project.id}`}
          className="flex items-center gap-1 text-xs font-bold text-cc-accent hover:underline"
        >
          <span>Open Editor</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center gap-1">
          {onDownload && (
            <button
              type="button"
              onClick={() => onDownload(project)}
              title="Download Project HTML"
              className="rounded-md p-1.5 text-cc-muted hover:bg-cc-panel2 hover:text-cc-text transition"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}

          {onDuplicate && (
            <button
              type="button"
              onClick={() => onDuplicate(project)}
              title="Duplicate Project"
              className="rounded-md p-1.5 text-cc-muted hover:bg-cc-panel2 hover:text-cc-text transition"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(project)}
            title={`Delete ${project.name}`}
            className="rounded-md p-1.5 text-cc-muted hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
