const { v4: uuid } = require('uuid');

/**
 * A milestone is one waypoint on a roadmap trail.
 */
function createMilestone({ title, description = '', skill = 'General', estimatedDays = 7 }) {
  return {
    id: uuid(),
    title,
    description,
    skill,
    estimatedDays,
    completed: false,
    completedAt: null,
    dailyLogs: [], // { id, date, note, percent }
  };
}

/**
 * A curated template roadmap (browsable/followable/customizable by any user).
 */
function createTemplate({ title, summary, category, level = 'Beginner', milestones = [] }) {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    title,
    summary,
    category,
    level,
    milestones: milestones.map(createMilestone),
    createdAt: now,
  };
}

module.exports = { createMilestone, createTemplate };
