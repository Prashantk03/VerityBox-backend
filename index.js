const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const postRoutes = require('./routes/posts');

const app = express();
app.use(cors());
app.use(express.json());

const commentRoutes = require("./routes/comments")

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));    
})
.catch(err => console.error(err));