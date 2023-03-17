const db = require("../../data/dbConfig");

function getAll() {
  return db("users").select("user_id", "name", "surname", "email");
}

async function getById(id) {
  const insertedID = await db("users").where({ user_id: id }).first();
  let newObje = {
    user_id: insertedID.user_id,
    name: insertedID.name,
    surname: insertedID.surname,
    email: insertedID.email,
  };
  return newObje;
}

function getByFilter(filter) {
  return db("users").where(filter).first();
}

async function create(payload) {
  const insertedId = await db("users").insert(payload);
  return getById(insertedId[0]);
}

const update = async (id, user) => {
  await db("users").where({ user_id: id }).update(user);
  return getById(id);
};

const remove = async (id) => {
  const deletedUser = await getById(id);
  await db("users").where({ user_id: id }).del();
  return deletedUser;
};

module.exports = {
  getAll,
  getById,
  getByFilter,
  create,
  update,
  remove,
};
