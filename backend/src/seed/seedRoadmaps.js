const { collection } = require('../utils/db');
const { createTemplate } = require('../models/Roadmap');

const Templates = collection('roadmapTemplates');

const templates = [
  createTemplate({
    title: 'Cybersecurity Analyst',
    summary: 'Go from networking fundamentals to SOC-ready analyst skills.',
    category: 'Cybersecurity',
    level: 'Beginner',
    milestones: [
      { title: 'Networking Fundamentals', description: 'OSI model, TCP/IP, subnetting, common ports.', skill: 'Networking', estimatedDays: 10 },
      { title: 'Operating System Internals', description: 'Linux & Windows administration, file permissions, processes.', skill: 'Systems', estimatedDays: 10 },
      { title: 'Security Fundamentals', description: 'CIA triad, threat modeling, common attack vectors.', skill: 'Security Basics', estimatedDays: 7 },
      { title: 'Security Tools Practice', description: 'Wireshark, Nmap, Burp Suite on lab environments.', skill: 'Tooling', estimatedDays: 14 },
      { title: 'SIEM & Monitoring', description: 'Log analysis, alert triage with tools like Wazuh/Splunk.', skill: 'Monitoring', estimatedDays: 10 },
      { title: 'Capture The Flag Practice', description: 'Solve beginner-to-intermediate CTFs on TryHackMe/HackTheBox.', skill: 'Applied Security', estimatedDays: 14 },
      { title: 'Certification Prep (Security+)', description: 'Structured review and practice exams.', skill: 'Certification', estimatedDays: 21 },
    ],
  }),
  createTemplate({
    title: 'Data Analyst',
    summary: 'Build the analytical toolkit to turn raw data into decisions.',
    category: 'Data',
    level: 'Beginner',
    milestones: [
      { title: 'Spreadsheets & Data Literacy', description: 'Excel/Sheets formulas, pivot tables, data cleaning.', skill: 'Spreadsheets', estimatedDays: 7 },
      { title: 'SQL Fundamentals', description: 'Joins, aggregations, window functions.', skill: 'SQL', estimatedDays: 10 },
      { title: 'Python for Analysis', description: 'Pandas, NumPy, data wrangling.', skill: 'Python', estimatedDays: 14 },
      { title: 'Data Visualization', description: 'Matplotlib/Seaborn or Power BI/Tableau dashboards.', skill: 'Visualization', estimatedDays: 10 },
      { title: 'Statistics for Analysts', description: 'Descriptive stats, hypothesis testing, correlation vs causation.', skill: 'Statistics', estimatedDays: 10 },
      { title: 'Capstone Analysis Project', description: 'End-to-end project with a public dataset and a written report.', skill: 'Portfolio', estimatedDays: 14 },
    ],
  }),
  createTemplate({
    title: 'Frontend Web Developer',
    summary: 'From HTML basics to shipping production React applications.',
    category: 'Web Development',
    level: 'Beginner',
    milestones: [
      { title: 'HTML & CSS Foundations', description: 'Semantic markup, flexbox, grid, responsive design.', skill: 'HTML/CSS', estimatedDays: 7 },
      { title: 'JavaScript Essentials', description: 'DOM, async/await, ES modules, fetch.', skill: 'JavaScript', estimatedDays: 14 },
      { title: 'React Fundamentals', description: 'Components, hooks, state and props, routing.', skill: 'React', estimatedDays: 14 },
      { title: 'API Integration', description: 'Consuming REST APIs, handling loading/error states.', skill: 'APIs', estimatedDays: 7 },
      { title: 'Testing & Tooling', description: 'Vite, ESLint, basic unit tests.', skill: 'Tooling', estimatedDays: 7 },
      { title: 'Portfolio Project', description: 'Design, build and deploy a full project end to end.', skill: 'Portfolio', estimatedDays: 14 },
    ],
  }),
  createTemplate({
    title: 'Backend Developer (Node.js)',
    summary: 'Server-side fundamentals through building production APIs.',
    category: 'Web Development',
    level: 'Intermediate',
    milestones: [
      { title: 'Node.js Core', description: 'Event loop, modules, streams.', skill: 'Node.js', estimatedDays: 7 },
      { title: 'Express & REST APIs', description: 'Routing, middleware, error handling.', skill: 'Express', estimatedDays: 10 },
      { title: 'Databases', description: 'Relational vs NoSQL, schema design, queries.', skill: 'Databases', estimatedDays: 14 },
      { title: 'Authentication & Security', description: 'JWT, hashing, input validation, rate limiting.', skill: 'Security', estimatedDays: 10 },
      { title: 'Testing & Deployment', description: 'Automated tests, CI, deploying to the cloud.', skill: 'DevOps', estimatedDays: 10 },
    ],
  }),
];

Templates.all().forEach(() => {}); // touch file to ensure it exists
const existing = Templates.all();
if (existing.length === 0) {
  templates.forEach((t) => Templates.insert(t));
  console.log(`Seeded ${templates.length} roadmap templates.`);
} else {
  console.log('Templates already exist, skipping seed. Delete src/data/db.json to reseed.');
}
