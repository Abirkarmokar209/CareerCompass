const { v4: uuid } = require('uuid');
const { collection } = require('../utils/db');
const { createUserRoadmap, progressOf } = require('../models/UserRoadmap');
const { createMilestone } = require('../models/Roadmap');

const UserRoadmaps = collection('userRoadmaps');
const Templates = collection('roadmapTemplates');

function withProgress(roadmap) {
  return { ...roadmap, progress: progressOf(roadmap) };
}

function listMine(req, res) {
  const mine = UserRoadmaps.filter((r) => r.userId === req.user.id).map(withProgress);
  res.json({ roadmaps: mine });
}

function getOne(req, res) {
  const roadmap = UserRoadmaps.find((r) => r.id === req.params.id && r.userId === req.user.id);
  if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
  res.json({ roadmap: withProgress(roadmap) });
}

function create(req, res, next) {
  try {
    const { title, category, source, templateId, milestones } = req.body;
    if (!title) return res.status(400).json({ message: 'Give your roadmap a title.' });

    let baseMilestones = milestones || [];

    if (source === 'template' || source === 'customized') {
      const template = Templates.find((t) => t.id === templateId);
      if (!template) return res.status(404).json({ message: 'Referenced template was not found.' });
      const templateMilestones = template.milestones.map((m) => ({
        title: m.title,
        description: m.description,
        skill: m.skill,
        estimatedDays: m.estimatedDays,
      }));
      // 'customized' allows the client to send an edited milestone list;
      // fall back to the template's own list if none was provided.
      baseMilestones = source === 'customized' && milestones && milestones.length ? milestones : templateMilestones;
    }

    const roadmap = createUserRoadmap({
      userId: req.user.id,
      title,
      category: category || 'General',
      source: source || 'manual',
      templateId: templateId || null,
      milestones: baseMilestones,
    });

    UserRoadmaps.insert(roadmap);
    res.status(201).json({ roadmap: withProgress(roadmap) });
  } catch (err) {
    next(err);
  }
}

function update(req, res, next) {
  try {
    const roadmap = UserRoadmaps.find((r) => r.id === req.params.id && r.userId === req.user.id);
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });

    const { title, category, milestones } = req.body;
    const patch = { updatedAt: new Date().toISOString() };
    if (title !== undefined) patch.title = title;
    if (category !== undefined) patch.category = category;
    if (milestones !== undefined) {
      // Preserve progress on milestones the client echoes back with an id;
      // treat any milestone without an id as brand new.
      patch.milestones = milestones.map((m) =>
        m.id ? { ...roadmap.milestones.find((existing) => existing.id === m.id), ...m } : createMilestone(m)
      );
    }

    const updated = UserRoadmaps.update(roadmap.id, patch);
    res.json({ roadmap: withProgress(updated) });
  } catch (err) {
    next(err);
  }
}

function addMilestone(req, res, next) {
  try {
    const roadmap = UserRoadmaps.find((r) => r.id === req.params.id && r.userId === req.user.id);
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
    const milestone = createMilestone(req.body);
    const milestones = [...roadmap.milestones, milestone];
    const updated = UserRoadmaps.update(roadmap.id, { milestones, updatedAt: new Date().toISOString() });
    res.status(201).json({ roadmap: withProgress(updated) });
  } catch (err) {
    next(err);
  }
}

function removeMilestone(req, res, next) {
  try {
    const roadmap = UserRoadmaps.find((r) => r.id === req.params.id && r.userId === req.user.id);
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
    const milestones = roadmap.milestones.filter((m) => m.id !== req.params.milestoneId);
    const updated = UserRoadmaps.update(roadmap.id, { milestones, updatedAt: new Date().toISOString() });
    res.json({ roadmap: withProgress(updated) });
  } catch (err) {
    next(err);
  }
}

function remove(req, res) {
  const roadmap = UserRoadmaps.find((r) => r.id === req.params.id && r.userId === req.user.id);
  if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
  UserRoadmaps.remove(roadmap.id);
  res.status(204).send();
}

module.exports = { listMine, getOne, create, update, addMilestone, removeMilestone, remove };
