const db = require("../../data/dbConfig");
const commetModel = require("../commets/commets-model");

const getAll = () => {
  return db("tweets as t")
    .leftJoin("users as u", "u.user_id", "t.user_id")
    .select("t.*", "u.name", "u.email", "u.surname");
};

const getTweetById = async (id) => {
  const insertedId = await db("tweets").where({ tweet_id: id }).first();
  return insertedId;
};

const create = async (tweet) => {
  const newTweet = await db("tweets").insert(tweet);
  const tweets = await getTweetsByUserId(newTweet);
  return tweets;
};

const idGoreTweetGetir = async function (user_id) {
  const tweetYorum = await db("users as u")
    .leftJoin("tweets as t", "u.user_id", "t.user_id")
    .leftJoin("comments as c", "t.tweet_id", "c.tweet_id")
    .select(
      "u.user_id",
      "u.name",
      "u.surname",
      "t.tweet_id",
      "t.text",
      "c.comment_id",
      "c.content"
    )
    .where("u.user_id", user_id)
    .groupBy("t.text");
  if (tweetYorum.length === 0) {
    return [];
  }

  const userModel = {
    user_id: user_id,
    name: tweetYorum[0].name,
    surname: tweetYorum[0].surname,
    Tweetler: [],
  };
  for (let i = 0; i < tweetYorum.length; i++) {
    const yorum = tweetYorum[i];
    const textModel = {
      tweet_id: yorum.tweet_id,
      text: yorum.text,
      Yorumlar: [],
    };
    const yorumlar = await commetModel.yorumlarıGetir(yorum.tweet_id);
    textModel.Yorumlar = yorumlar;
    userModel.Tweetler.push(textModel);
  }
  return userModel;
};

function getTweetsByUserId(userId) {
  return db("tweets").where({ tweet_id: userId }).first();
}

const updateById = async (id, tweet) => {
  await db("tweets").where({ tweet_id: id }).update(tweet);
  return getTweetById(id);
};

const remove = async (id) => {
  const deletedTweet = await getTweetById(id);
  await db("tweets").where({ tweet_id: id }).del();
  return deletedTweet;
};

module.exports = {
  getAll,
  create,
  getTweetsByUserId,
  getTweetById,
  idGoreTweetGetir,
  updateById,
  remove,
};
