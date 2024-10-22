const express = require("express");
const multer = require("multer");
const Post = require("../models/post.model");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

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

// router.post("/", async (req, res) => {
//   const { title, description, image } = req.body;
//   // const image = req.file.path;

//   try {
//     const newPost = new Post({ title, description, image });
//     await newPost.save();
//     res.status(201).json({ message: "post created successfully", newPost });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

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

// router.post("/:id", async (req, res) => {
//   const { title, description } = req.body;
//   const updatedData = { title, description };

//   try {
//     const updatedPost = await Post.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       {
//         new: true,
//       }
//     );
//     res.status(200).json({ message: "post updated successfully", updatedPost });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;