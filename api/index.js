import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { loadRoutes } from './helpers/loadRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

loadRoutes(app, new URL('./routes/', import.meta.url));

app.listen(process.env.PORT || 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));