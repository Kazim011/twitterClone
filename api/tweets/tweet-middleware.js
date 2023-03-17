const tweetModel = require("./tweet-model");

const checkUserId = async function (req, res, next) {
  try {
    const isExist = await tweetModel.idGoreTweetGetir(req.params.id);
    if (!isExist) {
      res.status(404).json({ message: "id bulunamadı" });
    } else {
      req.yorum = isExist;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkTweetId = async function (req, res, next) {
  try {
    const isExist = await tweetModel.getTweetById(req.params.id);
    if (!isExist) {
      res.status(404).json({ message: "id bulunamadı" });
    } else {
      req.yorum = isExist;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkUserId,
  checkTweetId,
};
