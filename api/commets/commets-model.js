const db = require("../../data/dbConfig");

const getAll = () => {
  return db("comments as c")
    .leftJoin("users as u", "u.user_id", "c.user_id")
    .leftJoin("tweets as t", "t.tweet_id", "c.tweet_id")
    .select("c.*", "u.name", "u.surname", "u.email", "t.text");
};

const yorumlarıGetir = async function (tweet_id) {
  const yorumlar = await db("comments as c")
    .leftJoin("tweets as t", "c.tweet_id", "t.tweet_id")
    .select("c.comment_id", "c.content", "t.tweet_id", "c.user_id")
    .where("t.tweet_id", tweet_id);
  return yorumlar;
};

const getCommetById = async (id) => {
  const insertedId = await db("comments").where({ comment_id: id }).first();
  return insertedId;
};

const getCommetsByUserId = async (userid) => {
  const instertedId = await db("comments as c")
    .leftJoin("users as u", "u.user_id", "c.user_id")
    .leftJoin("tweets as t", "t.tweet_id", "c.tweet_id")
    .select("c.*", "u.name", "u.surname", "u.email", "t.text")
    .where("comment_id", userid);
  return instertedId;
};

const create = async (commet) => {
  const newCommets = await db("comments").insert(commet);
  console.log(newCommets);
  const commets = await getCommetsByUserId(newCommets[0]);
  return commets;
};

const updateById = async (id, comment) => {
  await db("comments").where({ comment_id: id }).update(comment);
  return getCommetById(id);
};

const remove = async (id) => {
  const deletedCommet = await getCommetById(id);
  await db("comments").where({ comment_id: id }).del();
  return deletedCommet;
};

module.exports = {
  getAll,
  getCommetsByUserId,
  create,
  yorumlarıGetir,
  getCommetById,
  updateById,
  remove,
};
