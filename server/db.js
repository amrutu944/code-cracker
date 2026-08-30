import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFilePath = path.join(__dirname, 'code_cracker_data.json');

let isMongoConnected = false;
let memoryDb = { users: [], projects: [] };

// Initialize file-based JSON storage
function loadJsonDb() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      if (raw) {
        memoryDb = JSON.parse(raw);
        if (!Array.isArray(memoryDb.users)) memoryDb.users = [];
        if (!Array.isArray(memoryDb.projects)) memoryDb.projects = [];
      }
    } else {
      saveJsonDb();
    }
  } catch (err) {
    console.error('Error loading JSON DB file:', err.message);
  }
}

function saveJsonDb() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving JSON DB file:', err.message);
  }
}

// User Schema (Mongoose)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);

// Project Schema (Mongoose)
const ProjectSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  html: { type: String, default: '' },
  css: { type: String, default: '' },
  javascript: { type: String, default: '' },
  code: { type: String, default: '' },
  input: { type: String, default: '' },
  language: { type: String, default: 'web' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const MongoProject = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export async function connectDB() {
  loadJsonDb();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('✅ Database engine ready (File-based JSON storage code_cracker_data.json).');
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 1000 });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB database.');
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️ MongoDB not reachable. Operating on local JSON storage (code_cracker_data.json).');
  }
}

// Database Adapter Methods
export const dbAdapter = {
  // User Operations
  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected) {
      try {
        const user = await MongoUser.findOne({ email: cleanEmail });
        if (user) return { id: user._id.toString(), name: user.name, email: user.email, password: user.password };
      } catch (e) {}
    }
    loadJsonDb();
    const user = memoryDb.users.find((u) => u.email.toLowerCase() === cleanEmail);
    return user || null;
  },

  async createUser({ id, name, email, password }) {
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();
    if (isMongoConnected) {
      try {
        const user = await MongoUser.create({ name, email: cleanEmail, password });
        return { id: user._id.toString(), name: user.name, email: user.email };
      } catch (e) {}
    }
    loadJsonDb();
    const userId = id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newUser = { id: userId, name, email: cleanEmail, password, createdAt: now };
    memoryDb.users.push(newUser);
    saveJsonDb();
    return { id: userId, name, email: cleanEmail };
  },

  async findUserById(userId) {
    if (isMongoConnected) {
      try {
        const user = await MongoUser.findById(userId);
        if (user) return { id: user._id.toString(), name: user.name, email: user.email };
      } catch (e) {}
    }
    loadJsonDb();
    const user = memoryDb.users.find((u) => u.id === userId);
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email };
  },

  // Project Operations
  async getUserProjects(userId) {
    if (isMongoConnected) {
      try {
        const projects = await MongoProject.find({ userId }).sort({ updatedAt: -1 });
        return projects.map((p) => ({
          id: p._id.toString(),
          userId: p.userId,
          name: p.name,
          html: p.html,
          css: p.css,
          javascript: p.javascript,
          code: p.code,
          input: p.input,
          language: p.language,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
      } catch (e) {}
    }
    loadJsonDb();
    const userProjects = memoryDb.projects.filter((p) => p.userId === userId);
    return userProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async getProjectById(projectId, userId) {
    if (isMongoConnected) {
      try {
        const p = await MongoProject.findOne({ _id: projectId, userId });
        if (p) {
          return {
            id: p._id.toString(),
            userId: p.userId,
            name: p.name,
            html: p.html,
            css: p.css,
            javascript: p.javascript,
            code: p.code,
            input: p.input,
            language: p.language,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          };
        }
      } catch (e) {}
    }
    loadJsonDb();
    return memoryDb.projects.find((p) => p.id === projectId && p.userId === userId) || null;
  },

  async createProject(userId, projectData) {
    const now = new Date().toISOString();
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    if (isMongoConnected) {
      try {
        const p = await MongoProject.create({
          userId,
          name: projectData.name || 'Untitled Project',
          html: projectData.html || '',
          css: projectData.css || '',
          javascript: projectData.javascript || '',
          code: projectData.code || '',
          input: projectData.input || '',
          language: projectData.language || 'web',
        });
        return {
          id: p._id.toString(),
          userId: p.userId,
          name: p.name,
          html: p.html,
          css: p.css,
          javascript: p.javascript,
          code: p.code,
          input: p.input,
          language: p.language,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        };
      } catch (e) {}
    }
    loadJsonDb();
    const newProject = {
      id: projectId,
      userId,
      name: projectData.name || 'Untitled Project',
      html: projectData.html || '',
      css: projectData.css || '',
      javascript: projectData.javascript || '',
      code: projectData.code || '',
      input: projectData.input || '',
      language: projectData.language || 'web',
      createdAt: now,
      updatedAt: now,
    };
    memoryDb.projects.push(newProject);
    saveJsonDb();
    return newProject;
  },

  async updateProject(projectId, userId, updates) {
    const now = new Date().toISOString();
    if (isMongoConnected) {
      try {
        const p = await MongoProject.findOneAndUpdate(
          { _id: projectId, userId },
          { ...updates, updatedAt: new Date() },
          { new: true }
        );
        if (p) {
          return {
            id: p._id.toString(),
            userId: p.userId,
            name: p.name,
            html: p.html,
            css: p.css,
            javascript: p.javascript,
            code: p.code,
            input: p.input,
            language: p.language,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          };
        }
      } catch (e) {}
    }
    loadJsonDb();
    const index = memoryDb.projects.findIndex((p) => p.id === projectId && p.userId === userId);
    if (index === -1) return null;

    const updated = {
      ...memoryDb.projects[index],
      ...updates,
      id: projectId,
      userId,
      updatedAt: now,
    };

    memoryDb.projects[index] = updated;
    saveJsonDb();
    return updated;
  },

  async deleteProject(projectId, userId) {
    if (isMongoConnected) {
      try {
        const res = await MongoProject.deleteOne({ _id: projectId, userId });
        if (res.deletedCount > 0) return true;
      } catch (e) {}
    }
    loadJsonDb();
    const initialLen = memoryDb.projects.length;
    memoryDb.projects = memoryDb.projects.filter((p) => !(p.id === projectId && p.userId === userId));
    saveJsonDb();
    return memoryDb.projects.length < initialLen;
  },
};
