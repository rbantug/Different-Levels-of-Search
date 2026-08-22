import express from 'express'
import cors from 'cors'

import recipeRoutes from "./routes/recipeRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"
import errorHandler from './middleware/errorHandler.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recipes", recipeRoutes);
app.use("/api/search", searchRoutes);

app.use(errorHandler)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


