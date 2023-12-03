import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { loadRoutes } from './helpers/loadRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load routes
loadRoutes(app, new URL('./routes/', import.meta.url));

app.listen(port, () => console.log(`Server is running on port ${port}`));