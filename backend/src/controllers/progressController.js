const { v4: uuid } = require('uuid');
const { collection } = require('../utils/db');
const { progressOf } = require('../models/UserRoadmap');

const UserRoadmaps = collection('userRoadmaps');

function findOwned(req) {
  return UserRoadmaps.find((r) => r.id === req.params.id && r.userId === req.user.id);
}

function findMilestone(roadmap, milestoneId) {
  return roadmap.milestones.find((m) => m.id === milestoneId);
}

// Add a daily log entry (markdown-style note + % done that day) to a milestone.
function addLog(req, res) {
  const roadmap = findOwned(req);
  if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
  const milestone = findMilestone(roadmap, req.params.milestoneId);
  if (!milestone) return res.status(404).json({ message: 'Milestone not found.' });

  const { note, percent, date } = req.body;
  const log = {
    id: uuid(),
    date: date || new Date().toISOString().slice(0, 10),
    note: note || '',
    percent: typeof percent === 'number' ? Math.max(0, Math.min(100, percent)) : 0,
  };
  milestone.dailyLogs.push(log);

  const updated = UserRoadmaps.update(roadmap.id, {
    milestones: roadmap.milestones,
    updatedAt: new Date().toISOString(),
  });
  res.status(201).json({ roadmap: { ...updated, progress: progressOf(updated) } });
}

// Toggle (or explicitly set) whether a milestone is complete.
function setMilestoneStatus(req, res) {
  const roadmap = findOwned(req);
  if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
  const milestone = findMilestone(roadmap, req.params.milestoneId);
  if (!milestone) return res.status(404).json({ message: 'Milestone not found.' });

  const completed = req.body.completed !== undefined ? !!req.body.completed : !milestone.completed;
  milestone.completed = completed;
  milestone.completedAt = completed ? new Date().toISOString() : null;

  const updated = UserRoadmaps.update(roadmap.id, {
    milestones: roadmap.milestones,
    updatedAt: new Date().toISOString(),
  });
  res.json({ roadmap: { ...updated, progress: progressOf(updated) } });
}

// Aggregate dashboard data: overall progress, streak, and skill exposure.
function dashboardSummary(req, res) {
  const roadmaps = UserRoadmaps.filter((r) => r.userId === req.user.id);

  const allLogsDates = new Set();
  const skillMinutes = {};
  let totalMilestones = 0;
  let completedMilestones = 0;

  roadmaps.forEach((r) => {
    r.milestones.forEach((m) => {
      totalMilestones += 1;
      if (m.completed) completedMilestones += 1;
      skillMinutes[m.skill] = (skillMinutes[m.skill] || 0) + m.dailyLogs.length;
      m.dailyLogs.forEach((log) => allLogsDates.add(log.date));
    });
  });

  const streak = computeStreak(allLogsDates);
  const skills = Object.entries(skillMinutes)
    .map(([skill, activityCount]) => ({ skill, activityCount }))
    .sort((a, b) => b.activityCount - a.activityCount);

  res.json({
    roadmapCount: roadmaps.length,
    totalMilestones,
    completedMilestones,
    overallPercent: totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
    streakDays: streak,
    activeDays: allLogsDates.size,
    skills,
  });
}

function computeStreak(dateSet) {
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (dateSet.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

module.exports = { addLog, setMilestoneStatus, dashboardSummary };
