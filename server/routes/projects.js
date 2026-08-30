import express from 'express';
import { dbAdapter } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All project endpoints require valid auth token
router.use(authenticateToken);

// GET /api/projects - List projects for logged-in user
router.get('/', async (req, res) => {
  try {
    const projects = await dbAdapter.getUserProjects(req.user.userId);
    return res.json({ success: true, projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve projects.' });
  }
});

// POST /api/projects - Create project for logged-in user
router.post('/', async (req, res) => {
  try {
    const projectData = req.body || {};
    const created = await dbAdapter.createProject(req.user.userId, projectData);
    return res.status(201).json({ success: true, project: created });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create project.' });
  }
});

// GET /api/projects/:id - Get project details
router.get('/:id', async (req, res) => {
  try {
    const project = await dbAdapter.getProjectById(req.params.id, req.user.userId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }
    return res.json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve project.' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body || {};
    const updated = await dbAdapter.updateProject(req.params.id, req.user.userId, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Project not found or not owned by user.' });
    }
    return res.json({ success: true, project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await dbAdapter.deleteProject(req.params.id, req.user.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete project.' });
  }
});

export default router;
