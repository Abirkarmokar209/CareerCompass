const express = require('express');
const {
  listMine, getOne, create, update, addMilestone, removeMilestone, remove,
} = require('../controllers/userRoadmapController');
const { addLog, setMilestoneStatus, dashboardSummary } = require('../controllers/progressController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/dashboard/summary', dashboardSummary);

router.get('/', listMine);
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

router.post('/:id/milestones', addMilestone);
router.delete('/:id/milestones/:milestoneId', removeMilestone);
router.patch('/:id/milestones/:milestoneId', setMilestoneStatus);
router.post('/:id/milestones/:milestoneId/logs', addLog);

module.exports = router;
