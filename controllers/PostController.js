const PostModel = require("../models/Post.js");

module.exports.create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

module.exports.getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get tags",
    });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get posts",
    });
  }
};

module.exports.getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("user")
      .then((doc, error) => {
        console.log(doc);
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Failed to get post",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Post wasn't found",
          });
        }

        res.json(doc);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get posts",
    });
  }
};

module.exports.remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndDelete({
      _id: postId,
    }).then((doc, error) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          message: "Failed to delete post",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Post wasn't found",
        });
      }
      res.json({
        success: true,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};

module.exports.patch = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
      {
        new: true,
      }
    );
    res.json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update post",
    });
  }
};
