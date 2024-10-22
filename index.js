require("./db/db.connect");
const express = require("express");
const posts = require("./routes/post.router");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/posts", posts);

const PORT = process.env.PORT || 3000;

app.use('/',(req,res) => res.send('Post Management Backend'))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
