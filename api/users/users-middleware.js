const db = require("../../data/dbConfig");

const checkUserId = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const isExistsUser = await db("users").where({ user_id }).first();
    if (!isExistsUser) {
      res.status(404).json({
        message: "kullanıcı bulunamadı.",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkUserId,
};
