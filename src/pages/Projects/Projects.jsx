import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../../components/ProjectCard/ProjectCard.jsx';
import NewProjectDialog from '../../components/NewProjectDialog.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useProjects } from '../../hooks/useProjects.js';

export default function Projects() {
  const { projects, error, createProject, deleteProject } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();

  function handleCreate(name) {
    const project = createProject(name);
    setDialogOpen(false);
    if (project) navigate(`/playground/${project.id}`);
  }

  function confirmDelete() {
    if (pendingDelete) {
      deleteProject(pendingDelete.id);
      setPendingDelete(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-cc-text">My Projects</h1>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1.5 rounded-cc bg-cc-accent px-4 py-2 text-sm font-semibold text-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent2"
        >
          <span aria-hidden="true">+</span> New Project
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {projects.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-cc-muted">You don't have any projects yet.</p>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-4 rounded-cc bg-cc-accent px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={setPendingDelete} />
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
