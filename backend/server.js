const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mealPlanRoutes = require("./routes/mealPlan");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/trainer', require('./routes/trainer'));
app.use("/api/meal-plan", mealPlanRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));