const { v4: uuid } = require('uuid');
const { createMilestone } = require('./Roadmap');

/**
 * A UserRoadmap is the tracked, editable copy that lives under a profile.
 * source: 'manual' | 'template' | 'customized'
 */
function createUserRoadmap({ userId, title, category = 'General', source = 'manual', templateId = null, milestones = [] }) {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    userId,
    title,
    category,
    source,
    templateId,
    milestones: milestones.map((m) =>
      m.id && m.dailyLogs ? m : createMilestone(m)
    ),
    createdAt: now,
    updatedAt: now,
  };
}

function progressOf(roadmap) {
  const total = roadmap.milestones.length;
  if (total === 0) return { total: 0, completed: 0, percent: 0 };
  const completed = roadmap.milestones.filter((m) => m.completed).length;
  return { total, completed, percent: Math.round((completed / total) * 100) };
}

module.exports = { createUserRoadmap, progressOf };
