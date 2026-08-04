require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const roadmapRoutes = require('./src/routes/roadmapRoutes');
const userRoadmapRoutes = require('./src/routes/userRoadmapRoutes');
const { errorHandler } = require('./src/middleware/errorHandler');

// Make sure the datastore + curated templates exist before the API opens.
require('./src/utils/db');
require('./src/seed/seedRoadmaps');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'CareerCompass API' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/my-roadmaps', userRoadmapRoutes);

app.use((req, res) => res.status(404).json({ message: 'That route does not exist.' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CareerCompass API running on http://localhost:${PORT}`);
});
