const express = require("express");
const router = express.Router();
const tweetModel = require("./tweet-model");
const mdw = require("./tweet-middleware");

// Tüm tweetleri getir
router.get("/", async (req, res) => {
  try {
    const tweets = await tweetModel.getAll();
    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", mdw.checkUserId, (req, res, next) => {
  res.status(200).json(req.yorum);
});

// Yeni bir tweet oluştur
router.post("/", async (req, res) => {
  try {
    const newTweet = await tweetModel.create(req.body);
    res.status(201).json(newTweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", mdw.checkTweetId, async (req, res, next) => {
  try {
    const updateTweet = await tweetModel.updateById(req.params.id, req.body);
    res.json(updateTweet);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", mdw.checkTweetId, async (req, res, next) => {
  try {
    await tweetModel.remove(req.params.id);
    res.json({ message: "Tweet silme işlemi başarılı." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
