import { useCallback, useEffect, useState } from 'react';
import * as projectStorage from '../services/projectStorage.js';

// Manages the list of saved projects: loading, creating, renaming, deleting.
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    try {
      setProjects(projectStorage.getProjects());
      setError(null);
    } catch {
      setError('Could not load your saved projects.');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProject = useCallback(
    (name) => {
      try {
        const project = projectStorage.createProject(name);
        refresh();
        return project;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [refresh]
  );

  const renameProject = useCallback(
    (id, name) => {
      try {
        projectStorage.renameProject(id, name);
        refresh();
      } catch (err) {
        setError(err.message);
      }
    },
    [refresh]
  );

  const deleteProject = useCallback(
    (id) => {
      try {
        projectStorage.deleteProject(id);
        refresh();
      } catch (err) {
        setError(err.message);
      }
    },
    [refresh]
  );

  return { projects, error, createProject, renameProject, deleteProject, refresh };
}
