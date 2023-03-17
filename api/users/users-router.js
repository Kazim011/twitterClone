const router = require("express").Router();
const userModel = require("./users-model");
const mdw = require("../token/token-middlawere");
const usersMDW = require("./users-middleware");

router.get("/", async (req, res, next) => {
  const allUsers = await userModel.getAll();
  res.status(200).json(allUsers);
});

router.get("/:id", usersMDW.checkUserId, async (req, res, next) => {
  try {
    const insertedId = await userModel.getById(req.params.id);
    res.status(200).json(insertedId);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", usersMDW.checkUserId, async (req, res, next) => {
  try {
    const updatedUser = await userModel.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", usersMDW.checkUserId, async (req, res, next) => {
  try {
    await userModel.remove(req.params.id);
    res.json({ message: "Kullanıcı silme işlemi başarılı." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
