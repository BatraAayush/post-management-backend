const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Post = require("../models/post.model");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const deleteFile = (filePath) => {
  console.log(filePath)
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    } else {
      console.log(`Successfully deleted file: ${filePath}`);
    }
  });
};

router.post("/", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file.path;
  try {
    const newPost = new Post({ title, description, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const updatedData = { title, description };

  if (req.file) {
    updatedData.image = req.file.path;

    const post = await Post.findById(req.params.id);
    if (post && post.image) {
      deleteFile(post.image);
    }
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post && post.image) {
      deleteFile(post.image);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
