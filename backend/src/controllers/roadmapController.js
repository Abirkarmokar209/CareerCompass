const { collection } = require('../utils/db');

const Templates = collection('roadmapTemplates');

function listTemplates(req, res) {
  const { category } = req.query;
  let templates = Templates.all();
  if (category) {
    templates = templates.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ templates });
}

function getTemplate(req, res) {
  const template = Templates.find((t) => t.id === req.params.id);
  if (!template) return res.status(404).json({ message: 'Roadmap template not found.' });
  res.json({ template });
}

module.exports = { listTemplates, getTemplate };
