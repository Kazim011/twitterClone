const db = require("../../data/dbConfig");

const checkCommetId = async (req, res, next) => {
  try {
    const comment_id = req.params.id;

    const isIdValid = await db("comments").where({ comment_id }).first();

    if (!isIdValid) {
      res.status(404).json({ message: "id bulanamadı" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkCommetId,
};
