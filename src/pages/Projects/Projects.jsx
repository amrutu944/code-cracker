import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../../components/ProjectCard/ProjectCard.jsx';
import NewProjectDialog from '../../components/NewProjectDialog.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useProjects } from '../../hooks/useProjects.js';
import * as projectStorage from '../../services/projectStorage.js';
import { Plus, Search, Upload, Download, FolderGit2, Sparkles } from 'lucide-react';

export default function Projects() {
  const { projects, error, createProject, deleteProject, refreshProjects } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  function handleCreate(name) {
    const project = createProject(name);
    setDialogOpen(false);
    if (project) navigate(`/playground/${project.id}`);
  }

  function handleDuplicate(project) {
    const duplicated = createProject(`${project.name} (Copy)`, {
      html: project.html,
      css: project.css,
      javascript: project.javascript,
      code: project.code,
      language: project.language,
    });
    if (refreshProjects) refreshProjects();
  }

  function handleDownloadHTML(project) {
    const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${project.name}</title>
  <style>
    ${project.css || ''}
  </style>
</head>
<body>
  ${project.html || ''}
  <script>
    ${project.javascript || ''}
  </script>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportBackup() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `code_cracker_projects_backup_${Date.now()}.json`);
    dlAnchor.click();
  }

  function handleImportBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          imported.forEach((p) => {
            if (p.name) {
              projectStorage.createProject(p.name, {
                html: p.html,
                css: p.css,
                javascript: p.javascript,
                code: p.code,
                language: p.language,
              });
            }
          });
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  }

  function confirmDelete() {
    if (pendingDelete) {
      deleteProject(pendingDelete.id);
      setPendingDelete(null);
    }
  }

  // Filter & Sort Projects
  const filteredProjects = projects
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cc-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-cc-accent" />
            <h1 className="text-3xl font-extrabold text-cc-text">My Projects</h1>
          </div>
          <p className="mt-1 text-xs text-cc-muted">
            Manage, duplicate, and export your browser-saved coding projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import Projects JSON"
            className="flex items-center gap-1.5 rounded-xl border border-cc-border bg-cc-panel px-3.5 py-2 text-xs font-semibold text-cc-text hover:bg-cc-panel2"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>

          {projects.length > 0 && (
            <button
              type="button"
              onClick={handleExportBackup}
              title="Export All Projects JSON"
              className="flex items-center gap-1.5 rounded-xl border border-cc-border bg-cc-panel px-3.5 py-2 text-xs font-semibold text-cc-text hover:bg-cc-panel2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-cc-accent px-4 py-2 text-xs font-bold text-black shadow-lg shadow-cc-accent/20 hover:brightness-110"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      {projects.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cc-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-cc-border bg-cc-panel py-2 pl-10 pr-4 text-xs text-cc-text placeholder:text-cc-muted outline-none focus:border-cc-accent"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-cc-muted font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-cc-border bg-cc-panel px-3 py-1.5 text-xs text-cc-text outline-none focus:border-cc-accent"
            >
              <option value="updated">Last Modified</option>
              <option value="name">Project Name</option>
            </select>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {projects.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-cc-border bg-cc-panel p-12 text-center">
          <Sparkles className="h-10 w-10 text-cc-accent mb-3" />
          <h3 className="text-lg font-bold text-cc-text">No projects found</h3>
          <p className="mt-1 text-xs text-cc-muted max-w-sm">
            You don't have any saved projects yet. Create your first project to get started!
          </p>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-6 rounded-xl bg-cc-accent px-5 py-2.5 text-xs font-bold text-black hover:brightness-110"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={setPendingDelete}
              onDuplicate={handleDuplicate}
              onDownload={handleDownloadHTML}
            />
          ))}
        </div>
      )}

      <NewProjectDialog open={dialogOpen} onCreate={handleCreate} onCancel={() => setDialogOpen(false)} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this project?"
        message={`"${pendingDelete?.name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
